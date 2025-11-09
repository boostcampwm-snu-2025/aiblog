import { Router } from 'express';

const router = Router();

// RESTful API routers
// POST /api/posts
router.post('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Post creation endpoint (to be implemented in week 3)',
  });
});

// GET /api/posts
router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Get posts endpoint (to be implemented in week 3)',
    data: [],
  });
});

// GET /api/posts/:id
router.get('/:id', (_req, res) => {
  res.json({
    success: true,
    message: 'Get post by ID endpoint (to be implemented in week 3)',
  });
});

export default router;
