import { GoogleGenAI } from '@google/genai';
import express from 'express';
import { Octokit } from 'octokit';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config({ path: '../.env' });




const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// GitHub token from .env
const githubToken = process.env.GITHUB_TOKEN;
const geminiAPIKey = process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: geminiAPIKey });

// Initialize Octokit
const octokit = new Octokit({
  auth: githubToken
});

// Path to store saved blogs
const dataDir = path.resolve('./data');
const blogsFile = path.join(dataDir, 'blogs.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    try {
      await fs.access(blogsFile);
    } catch (err) {
      await fs.writeFile(blogsFile, JSON.stringify([]));
    }
  } catch (err) {
    console.error('Error ensuring data file:', err);
  }
}

async function readBlogs() {
  await ensureDataFile();
  const raw = await fs.readFile(blogsFile, 'utf-8');
  try { return JSON.parse(raw || '[]'); } catch (e) { return []; }
}

async function writeBlogs(list) {
  await ensureDataFile();
  await fs.writeFile(blogsFile, JSON.stringify(list, null, 2), 'utf-8');
}

// API endpoint to get public repositories
app.get('/api/repos', async (req, res) => {
  try {
    const response = await octokit.request('GET /user/repos', {
      visibility: 'public',
      affiliation: 'owner',
      sort: 'updated',
      per_page: 100,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const repositories = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      owner: repo.owner && repo.owner.login ? repo.owner.login : null,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updated_at: repo.updated_at
    }));

    res.json(repositories);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

// Get commits for a repo (owner and repo name expected in path)
app.get('/api/repos/:owner/:repo/commits', async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner,
      repo,
      per_page: 100,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const commits = response.data.map(c => ({
      sha: c.sha,
      message: c.commit && c.commit.message ? c.commit.message : '',
      author: (c.commit && c.commit.author && c.commit.author.name) || (c.author && c.author.login) || null,
      date: c.commit && c.commit.author ? c.commit.author.date : null,
      url: c.html_url
    }));

    res.json(commits);
  } catch (error) {
    console.error('Error fetching commits for', owner, repo, error);
    res.status(500).json({ error: 'Failed to fetch commits' });
  }
});

// Get pull requests for a repo
app.get('/api/repos/:owner/:repo/pulls', async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner,
      repo,
      state: 'all',
      per_page: 100,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const pulls = response.data.map(p => ({
      id: p.id,
      number: p.number,
      title: p.title,
      user: p.user ? p.user.login : null,
      state: p.state,
      created_at: p.created_at,
      updated_at: p.updated_at,
      merged_at: p.merged_at,
      url: p.html_url
    }));

    res.json(pulls);
  } catch (error) {
    console.error('Error fetching pulls for', owner, repo, error);
    res.status(500).json({ error: 'Failed to fetch pull requests' });
  }
});



// Create blog from a commit or PR using Gemini (GEMINI_API_KEY in .env)
app.post('/api/create-blog', express.json(), async (req, res) => {
  const { source, item, repo } = req.body || {};

  if (!source || !item || !repo) {
    return res.status(400).json({ error: 'Missing source, item, or repo in request body' });
  }

  // Build a prompt depending on source
  let instruction = '';
  if (source === 'commit') {
    instruction = `나는 github commit 내역으로 간단한 블로그를 작성하려고 하는데, 너가 나의 commit을 분석해서 블로그를 작성해줘. 아래는 commit 정보이다.`;
  } else if (source === 'pr') {
    instruction = `나는 github pull request 내역으로 간단한 블로그를 작성하려고 하는데, 너가 PR 내용을 요약하고 블로그 형태로 작성해줘. 아래는 PR 정보이다.`;
  } else {
    instruction = `블로그 작성을 도와줘. 아래는 관련 정보이다.`;
  }

  const details = `Repository: ${repo.name}\nOwner: ${repo.owner}\n\nItem:\n${JSON.stringify(item, null, 2)}`;
  const promptText = `${instruction}\n\n${details}\n\n간결하고 읽기 쉬운 블로그 형태로 작성해줘.`;

  

  try {
    // Call Gemini/Generative API. Adjust endpoint/model as needed for your account.
    const data = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText,
    });

    res.json({ data: data.text });

    // // Try to extract text from possible response shapes
    // const generated = data?.candidates?.[0]?.output || data?.candidates?.[0]?.content || data?.output || JSON.stringify(data);

    // res.json({ result: generated, raw: data });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to generate blog content' });
  }
});

// Save a generated blog to server-side storage
app.post('/api/blogs', async (req, res) => {
  const { title, content, source, repo, item } = req.body || {};
  if (!title || !content) return res.status(400).json({ error: 'Missing title or content' });

  try {
    const blogs = await readBlogs();
    const id = Date.now().toString();
    const newBlog = {
      id,
      title,
      content,
      source: source || null,
      repo: repo || null,
      item: item || null,
      created_at: new Date().toISOString()
    };
    blogs.unshift(newBlog);
    await writeBlogs(blogs);
    res.status(201).json(newBlog);
  } catch (err) {
    console.error('Failed to save blog:', err);
    res.status(500).json({ error: 'Failed to save blog' });
  }
});

// List saved blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await readBlogs();
    res.json(blogs);
  } catch (err) {
    console.error('Failed to read blogs:', err);
    res.status(500).json({ error: 'Failed to read blogs' });
  }
});

// Get single blog
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blogs = await readBlogs();
    const blog = blogs.find(b => b.id === req.params.id);
    if (!blog) return res.status(404).json({ error: 'Not found' });
    res.json(blog);
  } catch (err) {
    console.error('Failed to read blog:', err);
    res.status(500).json({ error: 'Failed to read blog' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
