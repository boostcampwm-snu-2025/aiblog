import express from 'express';
import { 
  getCommits, 
  getPullRequests, 
  getRepositoryInfo 
} from '../services/githubService.js';

const router = express.Router();

/**
 * GET /api/github/repo/:owner/:repo
 * Get basic repository information
 */
router.get('/repo/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const repoInfo = await getRepositoryInfo(owner, repo);
    res.json(repoInfo);
  } catch (error) {
    console.error('Error fetching repository info:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch repository information',
      message: error.message 
    });
  }
});

/**
 * GET /api/github/commits/:owner/:repo
 * Get commits for a repository
 * Query params: per_page (default: 30), page (default: 1)
 */
router.get('/commits/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { per_page = 30, page = 1 } = req.query;
    
    const commits = await getCommits(owner, repo, {
      per_page: parseInt(per_page),
      page: parseInt(page)
    });
    
    res.json(commits);
  } catch (error) {
    console.error('Error fetching commits:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch commits',
      message: error.message 
    });
  }
});

/**
 * GET /api/github/pulls/:owner/:repo
 * Get pull requests for a repository
 * Query params: state (all/open/closed), per_page (default: 30), page (default: 1)
 */
router.get('/pulls/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { state = 'all', per_page = 30, page = 1 } = req.query;
    
    const pullRequests = await getPullRequests(owner, repo, {
      state,
      per_page: parseInt(per_page),
      page: parseInt(page)
    });
    
    res.json(pullRequests);
  } catch (error) {
    console.error('Error fetching pull requests:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch pull requests',
      message: error.message 
    });
  }
});

export default router;
