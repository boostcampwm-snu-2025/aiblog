// 1. dotenv config는 가장 위에 위치해야 합니다.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
// Node.js 18.x 이상에서는 'fetch'가 기본 내장되어 있습니다. 
// (하위 버전인 경우 'node-fetch'를 npm install하고 require해야 합니다.)

const app = express();
const PORT = 3001; // React 앱과 다른 포트 사용 (예: 3001)

// 2. 미들웨어 설정
app.use(cors()); // CORS 허용 (모든 출처 허용 - 개발용)
app.use(express.json()); // JSON 파싱

// 3. GitHub 토큰 환경 변수에서 가져오기
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('❌ GitHub 토큰이 .env 파일에 설정되지 않았습니다.');
  process.exit(1); // 서버 비정상 종료
}

const GITHUB_API_URL = 'https://api.github.com';

/**
 * 4. 커밋 목록을 가져오는 프록시 API 엔드포인트
 * GET /api/github/owner/repo/commits
 */
app.get('/api/github/:owner/:repo/commits', async (req, res) => {
  const { owner, repo } = req.params;
  const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/commits?per_page=10`;

  try {
    const apiResponse = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    if (!apiResponse.ok) {
      throw new Error(`GitHub API Error: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    res.json(data); // 5. 클라이언트(React)에 데이터 전송

  } catch (error) {
    console.error('Error fetching commits:', error);
    res.status(500).json({ message: 'Failed to fetch commits' });
  }
});

/**
 * 6. PR 목록을 가져오는 프록시 API 엔드포인트
 * GET /api/github/owner/repo/pulls
 */
app.get('/api/github/:owner/:repo/pulls', async (req, res) => {
  const { owner, repo } = req.params;
  const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/pulls?per_page=10&state=all`;

  try {
    const apiResponse = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    if (!apiResponse.ok) {
      throw new Error(`GitHub API Error: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    res.json(data); // 5. 클라이언트(React)에 데이터 전송

  } catch (error) {
    console.error('Error fetching PRs:', error);
    res.status(500).json({ message: 'Failed to fetch PRs' });
  }
});

// 7. 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 프록시 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});