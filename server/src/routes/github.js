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

/**
 * @swagger
 * /api/github/commits/{owner}/{repo}:
 *   get:
 *     summary: GitHub 레포지토리의 최근 커밋 목록 조회
 *     tags: [GitHub]
 *     parameters:
 *       - in: path
 *         name: owner
 *         required: true
 *         schema:
 *           type: string
 *         description: 레포지토리 소유자
 *         example: facebook
 *       - in: path
 *         name: repo
 *         required: true
 *         schema:
 *           type: string
 *         description: 레포지토리 이름
 *         example: react
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 30
 *         description: 페이지당 결과 수
 *     responses:
 *       200:
 *         description: 커밋 목록 조회 성공
 *       500:
 *         description: 서버 에러
 */
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

/**
 * @swagger
 * /api/github/pulls/{owner}/{repo}:
 *   get:
 *     summary: GitHub 레포지토리의 최근 PR 목록 조회
 *     tags: [GitHub]
 *     parameters:
 *       - in: path
 *         name: owner
 *         required: true
 *         schema:
 *           type: string
 *         description: 레포지토리 소유자
 *         example: facebook
 *       - in: path
 *         name: repo
 *         required: true
 *         schema:
 *           type: string
 *         description: 레포지토리 이름
 *         example: react
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [open, closed, all]
 *           default: all
 *         description: PR 상태
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 30
 *         description: 페이지당 결과 수
 *     responses:
 *       200:
 *         description: PR 목록 조회 성공
 *       500:
 *         description: 서버 에러
 */
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

/**
 * @swagger
 * /api/github/activity/{owner}/{repo}:
 *   get:
 *     summary: GitHub 레포지토리의 통합 활동 내역 조회 (커밋 + PR)
 *     description: 커밋과 PR을 합쳐서 날짜순으로 정렬하여 반환합니다
 *     tags: [GitHub]
 *     parameters:
 *       - in: path
 *         name: owner
 *         required: true
 *         schema:
 *           type: string
 *         description: 레포지토리 소유자
 *         example: facebook
 *       - in: path
 *         name: repo
 *         required: true
 *         schema:
 *           type: string
 *         description: 레포지토리 이름
 *         example: react
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 30
 *         description: 페이지당 결과 수
 *     responses:
 *       200:
 *         description: 활동 내역 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf:
 *                   - type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: commit
 *                       id:
 *                         type: string
 *                         example: abc123def456
 *                       message:
 *                         type: string
 *                         example: "Fix bug in component"
 *                       author:
 *                         type: string
 *                         example: "John Doe"
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-16T10:00:00Z"
 *                       url:
 *                         type: string
 *                         example: "https://github.com/facebook/react/commit/abc123"
 *                   - type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: pull_request
 *                       id:
 *                         type: integer
 *                         example: 12345
 *                       number:
 *                         type: integer
 *                         example: 100
 *                       title:
 *                         type: string
 *                         example: "Add new feature"
 *                       body:
 *                         type: string
 *                         example: "This PR adds a new feature"
 *                       author:
 *                         type: string
 *                         example: "Jane Smith"
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-15T15:30:00Z"
 *                       state:
 *                         type: string
 *                         enum: [open, closed]
 *                         example: open
 *                       url:
 *                         type: string
 *                         example: "https://github.com/facebook/react/pull/100"
 *       500:
 *         description: 서버 에러
 */
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
