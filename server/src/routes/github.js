const express = require('express');
const axios = require('axios');

const router = express.Router();
const GITHUB_API_BASE = 'https://api.github.com';

// GitHub API 공통 헤더 설정
const getGitHubHeaders = () => ({
  'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
  'X-GitHub-Api-Version': '2022-11-28'
});

// 레포지토리의 최근 커밋 목록 가져오기
router.get('/commits/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { per_page = 30 } = req.query;

    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits`,
      {
        headers: getGitHubHeaders(),
        params: { per_page }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching commits:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch commits',
      message: error.response?.data?.message || error.message
    });
  }
});

// 레포지토리의 최근 PR 목록 가져오기
router.get('/pulls/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { state = 'all', per_page = 30 } = req.query;

    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls`,
      {
        headers: getGitHubHeaders(),
        params: { state, per_page }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching pull requests:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch pull requests',
      message: error.response?.data?.message || error.message
    });
  }
});

// 커밋과 PR을 합쳐서 반환 (통합 활동 내역)
router.get('/activity/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { per_page = 30 } = req.query;

    // 커밋과 PR을 동시에 요청
    const [commitsResponse, pullsResponse] = await Promise.all([
      axios.get(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits`,
        {
          headers: getGitHubHeaders(),
          params: { per_page }
        }
      ),
      axios.get(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls`,
        {
          headers: getGitHubHeaders(),
          params: { state: 'all', per_page }
        }
      )
    ]);

    // 데이터 형식 통일
    const commits = commitsResponse.data.map(commit => ({
      type: 'commit',
      id: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url
    }));

    const pulls = pullsResponse.data.map(pr => ({
      type: 'pull_request',
      id: pr.id,
      number: pr.number,
      title: pr.title,
      body: pr.body,
      author: pr.user.login,
      date: pr.created_at,
      state: pr.state,
      url: pr.html_url
    }));

    // 날짜순 정렬 (최신순)
    const activities = [...commits, ...pulls].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activity:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch activity',
      message: error.response?.data?.message || error.message
    });
  }
});

module.exports = router;
