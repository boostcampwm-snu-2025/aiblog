import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import githubRouter from './routes/github.js';
import postsRouter from './routes/posts.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/github', githubRouter);
app.use('/api/posts', postsRouter);

const PORT = process.env.PORT || 5179;
app.listen(PORT, () => console.log(`[server] listening on ${PORT}`));
