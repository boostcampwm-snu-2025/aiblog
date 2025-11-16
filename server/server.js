require('dotenv').config();

const express = require('express');
const cors = require('cors');

// 라우터 파일 불러오기
const githubRoutes = require('./routes/github');
const llmRoutes = require('./routes/llm'); // ⭐️ 1. LLM 라우터 불러오기

const app = express();
const PORT = 3001;

// 미들웨어 설정
app.use(cors());
app.use(express.json()); // ⭐️ POST 요청의 req.body를 파싱하기 위해 필수

// 라우터 연결
app.use('/api/github', githubRoutes);
app.use('/api/llm', llmRoutes); // ⭐️ 2. LLM 라우터 연결

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 프록시 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});