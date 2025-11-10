import { Router } from 'express';
import { listPosts, savePost, removePost } from '../storage.js';

const r = Router();

r.get('/', async (_req, res) => {
  res.json(await listPosts());
});

r.post('/', async (req, res) => {
  const { title, body, sourceUrl, tags = [] } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title/body required' });
  const created = await savePost({ title, body, sourceUrl, tags });
  res.json(created);
});

r.delete('/:id', async (req, res) => {
  res.json(await removePost(req.params.id));
});

export default r;
