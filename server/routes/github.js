const express = require('express');
const router = express.Router(); // 1. Express의 Router 기능을 불러옵니다.

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API_URL = 'https://api.github.com';

/**
 * 2. API 경로가 '/:owner/:repo/commits'로 간단해졌습니다.
 * (앞부분 '/api/github'는 server.js에서 처리)
 * * GET /api/github/:owner/:repo/commits
 */
router.get('/:owner/:repo/commits', async (req, res) => {
  const { owner, repo } = req.params;
  const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/commits?per_page=10`;

  try {
    const apiResponse = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });
    if (!apiResponse.ok) throw new Error(`GitHub API Error: ${apiResponse.status}`);
    const data = await apiResponse.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching commits:', error);
    res.status(500).json({ message: 'Failed to fetch commits' });
  }
});

/**
 * GET /api/github/:owner/:repo/pulls
 */
router.get('/:owner/:repo/pulls', async (req, res) => {
  const { owner, repo } = req.params;
  const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/pulls?per_page=10&state=all`;

  try {
    const apiResponse = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });
    if (!apiResponse.ok) throw new Error(`GitHub API Error: ${apiResponse.status}`);
    const data = await apiResponse.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching PRs:', error);
    res.status(500).json({ message: 'Failed to fetch PRs' });
  }
});

// 3. 이 라우터 파일을 다른 곳에서 쓸 수 있도록 export합니다.
module.exports = router;