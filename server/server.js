//.env 파일 로드
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//미들웨어
app.use(cors());
app.use(express.json());

//몽고디비 연결
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

//기본 라우트
app.get("/", (req, res) => {
  res.send("Hello from Express Server!");
});

//라우트 연결
const githubRoutes = require("./routes/github");
app.use("/api/github", githubRoutes);

const blogRoutes = require("./routes/blog");
app.use("/api/blog", blogRoutes);

//서버 시작
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
