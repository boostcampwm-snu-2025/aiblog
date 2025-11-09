import { Router } from 'express';
import { getCommits, getPullRequests } from '../controllers/github.controller';

const router = Router();

// GET /api/github/repos/:owner/:repo/commits
router.get('/repos/:owner/:repo/commits', getCommits);

// GET /api/github/repos/:owner/:repo/pulls
router.get('/repos/:owner/:repo/pulls', getPullRequests);

export default router;
