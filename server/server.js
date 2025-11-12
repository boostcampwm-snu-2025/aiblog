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

app.get("/api/github/activities", async (req, res) => {
  const { owner, repo } = req.query;

  if (!owner || !repo) {
    return res
      .status(400)
      .json({ error: "owner and repo query parameters are required." });
  }

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits`;
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching GitHub activities:", error);
    res.status(500).json({ error: "Failed to fetch data from GitHub API." });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
