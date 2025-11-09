import { Router } from 'express';
import githubRouter from './github.routes';
import postsRouter from './posts.routes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/github', githubRouter);
router.use('/posts', postsRouter);

export default router;
