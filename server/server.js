const express = require("express");
const dotenv = require("dotenv");
// .env 파일 로드
dotenv.config();

const app = express();
//환경 변수에 설정된 PORT 사용, 없으면 5000번 포트 사용
const PORT = process.env.PORT || 5000;

// 기본 API 라우트 설정
app.get("/", (req, res) => {
  res.send("Hello from Express Server!");
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
