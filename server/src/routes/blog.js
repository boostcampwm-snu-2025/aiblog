import express from 'express';
import { getCommitDetail, getPullRequestDetail } from '../services/githubService.js';
import { generateBlogFromCommit, generateBlogFromPR } from '../services/openaiService.js';
import { saveBlog, getBlogById, getAllBlogs } from '../services/blogService.js';

const router = express.Router();

/**
 * POST /api/blog/generate/commit
 * Generate blog from commit
 * Body: { owner, repo, sha }
 */
router.post('/generate/commit', async (req, res) => {
  try {
    const { owner, repo, sha } = req.body;
    
    if (!owner || !repo || !sha) {
      return res.status(400).json({ 
        error: 'Missing required fields: owner, repo, sha' 
      });
    }
    
    console.log(`📝 Generating blog for commit: ${owner}/${repo}@${sha}`);
    
    // 1. Fetch detailed commit information from GitHub
    const commitData = await getCommitDetail(owner, repo, sha);
    
    // 2. Generate blog content using OpenAI
    const blogContent = await generateBlogFromCommit(commitData, `${owner}/${repo}`);
    
    // 3. Save blog to storage
    const blog = await saveBlog({
      type: 'commit',
      title: commitData.message.split('\n')[0], // First line of commit message
      content: blogContent,
      repoName: `${owner}/${repo}`,
      sourceData: {
        owner,
        repo,
        sha: commitData.sha,
        author: commitData.author,
        date: commitData.author.date,
        html_url: commitData.html_url
      }
    });
    
    res.json({
      success: true,
      blog: blog
    });
  } catch (error) {
    console.error('Error generating blog from commit:', error);
    res.status(500).json({ 
      error: 'Failed to generate blog from commit',
      message: error.message 
    });
  }
});

/**
 * POST /api/blog/generate/pr
 * Generate blog from pull request
 * Body: { owner, repo, pullNumber }
 */
router.post('/generate/pr', async (req, res) => {
  try {
    const { owner, repo, pullNumber } = req.body;
    
    if (!owner || !repo || !pullNumber) {
      return res.status(400).json({ 
        error: 'Missing required fields: owner, repo, pullNumber' 
      });
    }
    
    console.log(`📝 Generating blog for PR: ${owner}/${repo}#${pullNumber}`);
    
    // 1. Fetch detailed PR information from GitHub
    const prData = await getPullRequestDetail(owner, repo, pullNumber);
    
    // 2. Generate blog content using OpenAI
    const blogContent = await generateBlogFromPR(prData, `${owner}/${repo}`);
    
    // 3. Save blog to storage
    const blog = await saveBlog({
      type: 'pull_request',
      title: prData.title,
      content: blogContent,
      repoName: `${owner}/${repo}`,
      sourceData: {
        owner,
        repo,
        number: prData.number,
        user: prData.user,
        state: prData.state,
        created_at: prData.created_at,
        merged_at: prData.merged_at,
        html_url: prData.html_url
      }
    });
    
    res.json({
      success: true,
      blog: blog
    });
  } catch (error) {
    console.error('Error generating blog from PR:', error);
    res.status(500).json({ 
      error: 'Failed to generate blog from PR',
      message: error.message 
    });
  }
});

/**
 * GET /api/blog/:id
 * Get blog by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await getBlogById(id);
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    if (error.message === 'Blog not found') {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(500).json({ 
      error: 'Failed to fetch blog',
      message: error.message 
    });
  }
});

/**
 * GET /api/blog
 * Get all blogs (limited to most recent)
 */
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const blogs = await getAllBlogs(limit);
    res.json({ blogs, count: blogs.length });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch blogs',
      message: error.message 
    });
  }
});

export default router;
