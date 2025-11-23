import express from 'express';
import { readBlogs, writeBlogs } from '../lib.js';

const router = express.Router();

// Save a generated blog
router.post('/', async (req, res) => {
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
router.get('/', async (req, res) => {
  try {
    const blogs = await readBlogs();
    res.json(blogs);
  } catch (err) {
    console.error('Failed to read blogs:', err);
    res.status(500).json({ error: 'Failed to read blogs' });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
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

export default router;
