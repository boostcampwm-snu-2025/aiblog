//.env 파일 로드
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello from Express Server!");
});

const githubRoutes = require("./routes/github");
app.use("/api/github", githubRoutes);

const blogRoutes = require("./routes/blog");
app.use("/api/blog", blogRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
