// aiblog/server/index.mjs
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises'; // 파일 시스템 모듈 추가
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 8787;
const API_KEY = process.env.GOOGLE_API_KEY;
const DB_FILE = path.resolve('blogs.json'); // 저장할 파일 경로

if (!API_KEY) {
  console.error('Missing GOOGLE_API_KEY in server/.env');
  process.exit(1);
}

// --- DB Helper Functions ---
async function readDb() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    // 파일이 없으면 빈 배열 반환
    return [];
  }
}

async function writeDb(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
// ---------------------------

const genAI = new GoogleGenerativeAI(API_KEY);

// (기존 pickUsableModel 함수 유지)
async function pickUsableModel() {
  let models = [];
  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models?key=' + API_KEY
    );
    const json = await res.json();
    if (json.models) models = json.models;
  } catch { /* ignore */ }

  const supportsGenerate = (m) =>
    m?.supportedGenerationMethods?.includes('generateContent');
  const available = models.filter(supportsGenerate).map((m) => m.name);
  const priority = [
    'models/gemini-2.0-flash',
    'models/gemini-1.5-flash-8b',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-flash-latest'
  ];
  return priority.find((p) => available.includes(p)) || available[0] || 'models/gemini-1.5-flash';
}

app.get('/api/models', async (_req, res) => {
  try {
    const chosen = await pickUsableModel();
    res.json({ ok: true, chosen });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// --- [NEW] 블로그 CRUD API ---

// 1. 글 목록 불러오기
app.get('/api/blogs', async (_req, res) => {
  const blogs = await readDb();
  res.json({ ok: true, blogs });
});

// 2. 글 저장하기
app.post('/api/blogs', async (req, res) => {
  try {
    const { repo, content } = req.body;
    const blogs = await readDb();
    const newBlog = {
      id: Date.now().toString(), // 간단한 ID 생성
      repo,
      content,
      createdAt: new Date().toISOString(),
    };
    blogs.unshift(newBlog); // 최신글을 위로
    await writeDb(blogs);
    res.json({ ok: true, blog: newBlog });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// 3. 글 수정하기
app.put('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const blogs = await readDb();
    const index = blogs.findIndex(b => b.id === id);
    
    if (index === -1) return res.status(404).json({ ok: false, error: 'Not found' });
    
    blogs[index].content = content; // 내용 업데이트
    await writeDb(blogs);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// 4. 글 삭제하기
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let blogs = await readDb();
    blogs = blogs.filter(b => b.id !== id);
    await writeDb(blogs);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});
// ---------------------------

const GenerateSchema = z.object({
  repo: z.string().min(3),
  itemType: z.enum(['commit', 'pull', 'all']),
  commit: z.object({
      sha: z.string().optional(),
      message: z.string().optional(),
      author: z.string().nullable().optional(),
      date: z.string().optional()
    }).optional(),
  pull: z.object({
      number: z.number().optional(),
      title: z.string().optional(),
      user: z.string().optional(),
      state: z.string().optional(),
      created_at: z.string().optional(),
      body: z.string().optional()
    }).optional(),
  commits: z.array(z.object({
      sha: z.string(),
      message: z.string(),
      author: z.string().nullable(),
      date: z.string()
    })).optional(),
  pulls: z.array(z.object({
      number: z.number(),
      title: z.string(),
      user: z.string(),
      state: z.string(),
      created_at: z.string(),
      body: z.string().optional()
    })).optional()
});

// (기존 generate API 유지)
app.post('/api/generate', async (req, res) => {
  const parsed = GenerateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() });
  }
  const { repo, itemType, commit, pull, commits, pulls } = parsed.data;

  const chosenModel = await pickUsableModel();

  const sys = [
    'You are a technical blog writer.',
    'Write concise, developer-friendly posts from GitHub activity.',
    'Use markdown with headers and bullet points.',
    'Include "What changed" and "Why it matters".',
    'Target ~500 words.'
  ].join(' ');

  const makeUserPrompt = () => {
     // (기존 로직 유지 - 생략하지 말고 그대로 두세요)
     if (itemType === 'commit' && commit) {
      return `Repository: ${repo}\nWrite a blog post about this commit.\n\nCommit:\n- SHA: ${commit.sha || 'n/a'}\n- Message: ${commit.message || ''}\n- Author: ${commit.author || 'Unknown'}\n- Date: ${commit.date || ''}`;
    }
    if (itemType === 'pull' && pull) {
      return `Repository: ${repo}\nWrite a blog post summarizing this Pull Request.\n\nPull Request:\n- #${pull.number ?? 'n/a'}: ${pull.title || ''}\n- Author: ${pull.user || 'Unknown'}\n- State: ${pull.state || ''}\n- Created At: ${pull.created_at || ''}\n- Description/Body: ${pull.body || '(no body provided)'}`;
    }
    const cLines = (commits || []).map((c) => `- ${c.sha.slice(0, 7)} | ${c.message} (${c.author ?? 'Unknown'}, ${c.date})`).join('\n');
    const pLines = (pulls || []).map((p) => `- #${p.number} ${p.title} by ${p.user} [${p.state}] at ${p.created_at}`).join('\n');
    return `Repository: ${repo}\nCreate a weekly-style blog post covering these recent activities.\n\nCommits:\n${cLines || '(none)'}\n\nPull Requests:\n${pLines || '(none)'}`;
  };

  try {
    const model = genAI.getGenerativeModel({
      model: chosenModel,
      systemInstruction: sys
    });
    const r = await model.generateContent(makeUserPrompt());
    const blogMd = r.response.text();
    res.json({ ok: true, model: chosenModel, blogMd });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`LLM server listening on http://localhost:${PORT}`);
});