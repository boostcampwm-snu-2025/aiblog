import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { getRecentActivities } from './github.js';
import { summarizeMarkdown } from './summarize.js';
import { PostsRepo } from './posts.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*'}));

app.get('/api/health', (_,res)=>res.json({ ok:true }));

app.get('/api/github/:owner/:repo/recent', async (req,res) => {
  try {
    const { owner, repo } = req.params;
    const sinceDays = +(req.query.sinceDays ?? 14);
    const page = +(req.query.page ?? 1);
    const perPage = +(req.query.perPage ?? 20);
    const items = await getRecentActivities(owner, repo, sinceDays, page, perPage, process.env.GITHUB_TOKEN);
    res.json({ items });
  } catch (e:any) { res.status(400).json({ error: e.message }); }
});

app.post('/api/summarize', async (req,res) => {
  try {
    const { items, language='ko', tone='blog' } = req.body || {};
    const markdown = await summarizeMarkdown(items || [], process.env.OPENAI_API_KEY, language, tone);
    res.json({ markdown });
  } catch (e:any) { res.status(400).json({ error: e.message }); }
});

// Posts CRUD
app.get('/api/posts', async (_,res)=> res.json(await PostsRepo.list()));
app.get('/api/posts/:id', async (req,res)=> {
  const p = await PostsRepo.get(req.params.id); if(!p) return res.status(404).end(); res.json(p);
});
app.post('/api/posts', async (req,res)=> {
  const { title, markdown, tags } = req.body; if(!title||!markdown) return res.status(400).json({error:'title, markdown required'});
  const p = await PostsRepo.create({ title, markdown, tags }); res.status(201).json(p);
});
app.put('/api/posts/:id', async (req,res)=> {
  const p = await PostsRepo.update(req.params.id, req.body||{}); if(!p) return res.status(404).end(); res.json(p);
});
app.delete('/api/posts/:id', async (req,res)=> {
  const ok = await PostsRepo.remove(req.params.id); res.json({ ok });
});

const port = +(process.env.PORT || 8080);
app.listen(port, () => console.log(`API on :${port}`));