// 1. .env 파일에서 환경 변수를 불러옵니다. (코드 최상단에 위치해야 합니다)
require('dotenv').config();

// 2. 필요한 라이브러리를 불러옵니다.
const express = require('express');
const cors = require('cors');

// 3. Express 앱을 생성하고 포트를 설정합니다.
const app = express();
const port = process.env.PORT || 4000; // .env 파일에 PORT가 없으면 4000번 사용

// 4. CORS 미들웨어를 설정합니다.
// React 앱(클라이언트)이 http://localhost:5173 (Vite 기본 포트)에서 실행되므로,
// 해당 주소의 요청을 허용해줘야 합니다.
app.use(cors({
  origin: 'http://localhost:5173'
}));

// 5. JSON 요청 본문을 파싱하기 위한 미들웨어 (나중에 POST 요청 시 필요할 수 있음)
app.use(express.json());

// --- API 엔드포인트 ---

// 6. 1주차 체크포인트 1.5번: 클라이언트/서버 연결 확인용 테스트 API
app.get('/api/test', (req, res) => {
  console.log("✅ /api/test 요청 수신");
  res.json({ message: '👋 Express 서버에서 보낸 메시지입니다!' });
});

// 7. (1주차 핵심 기능) GitHub API 프록시 엔드포인트
// TODO: 1주차 체크포인트 2번 항목
app.get('/api/github/data', (req, res) => {
  // 체크포인트 2.3: 쿼리 파라미터 받기
  const { repoName, filterType } = req.query;

  console.log('클라이언트에서 받은 저장소명:', repoName);
  console.log('클라이언트에서 받은 필터타입:', filterType);

  // TODO:
  // 1. GitHub API 토큰 불러오기 (process.env.GITHUB_TOKEN)
  // 2. filterType에 따라 다른 GraphQL 쿼리 문자열 생성
  // 3. fetch를 사용해 GitHub API 호출 (Node.js 18+ 부터는 fetch 내장)
  // 4. GitHub로부터 받은 응답을 res.json()으로 클라이언트에 전송

  // 임시 응답 (구현 전)
  res.status(501).json({ message: '아직 구현되지 않은 엔드포인트입니다.' });
});


// --- 서버 실행 ---

// 8. 설정한 포트에서 서버를 실행합니다.
app.listen(port, () => {
  console.log(`✅ Express 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});