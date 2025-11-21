// aiblog/server/index.mjs
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 8787;
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.error('Missing GOOGLE_API_KEY in server/.env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

/** List models and pick one that supports generateContent */
async function pickUsableModel() {
  let models = [];
  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models?key=' + API_KEY
    );
    const json = await res.json();
    if (json.models) models = json.models;
  } catch {
    /* ignore: fall back to defaults */
  }

  const supportsGenerate = (m) =>
    m?.supportedGenerationMethods?.includes('generateContent');

  const available = models.filter(supportsGenerate).map((m) => m.name);

  const priority = [
    'models/gemini-2.0-flash',
    'models/gemini-1.5-flash-8b',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-flash-latest'
  ];

  return (
    priority.find((p) => available.includes(p)) ||
    available[0] ||
    'models/gemini-1.5-flash'
  );
}

app.get('/api/models', async (_req, res) => {
  try {
    const chosen = await pickUsableModel();
    res.json({ ok: true, chosen });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

const GenerateSchema = z.object({
  repo: z.string().min(3),
  itemType: z.enum(['commit', 'pull', 'all']),
  commit: z
    .object({
      sha: z.string().optional(),
      message: z.string().optional(),
      author: z.string().nullable().optional(),
      date: z.string().optional()
    })
    .optional(),
  pull: z
    .object({
      number: z.number().optional(),
      title: z.string().optional(),
      user: z.string().optional(),
      state: z.string().optional(),
      created_at: z.string().optional(),
      body: z.string().optional()
    })
    .optional(),
  commits: z
    .array(
      z.object({
        sha: z.string(),
        message: z.string(),
        author: z.string().nullable(),
        date: z.string()
      })
    )
    .optional(),
  pulls: z
    .array(
      z.object({
        number: z.number(),
        title: z.string(),
        user: z.string(),
        state: z.string(),
        created_at: z.string(),
        body: z.string().optional()
      })
    )
    .optional()
});

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
    if (itemType === 'commit' && commit) {
      return `Repository: ${repo}
Write a blog post about this commit.

Commit:
- SHA: ${commit.sha || 'n/a'}
- Message: ${commit.message || ''}
- Author: ${commit.author || 'Unknown'}
- Date: ${commit.date || ''}`;
    }
    if (itemType === 'pull' && pull) {
      return `Repository: ${repo}
Write a blog post summarizing this Pull Request.

Pull Request:
- #${pull.number ?? 'n/a'}: ${pull.title || ''}
- Author: ${pull.user || 'Unknown'}
- State: ${pull.state || ''}
- Created At: ${pull.created_at || ''}
- Description/Body: ${pull.body || '(no body provided)'}`;
    }
    const cLines = (commits || [])
      .map(
        (c) =>
          `- ${c.sha.slice(0, 7)} | ${c.message} (${c.author ?? 'Unknown'}, ${c.date})`
      )
      .join('\n');
    const pLines = (pulls || [])
      .map(
        (p) =>
          `- #${p.number} ${p.title} by ${p.user} [${p.state}] at ${p.created_at}`
      )
      .join('\n');

    return `Repository: ${repo}
Create a weekly-style blog post covering these recent activities.

Commits:
${cLines || '(none)'}

Pull Requests:
${pLines || '(none)'}`;
  };

  try {
    // ✅ Use systemInstruction here, and pass a simple string to generateContent
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
