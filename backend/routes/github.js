import express from "express";
import axios from "axios";

const router = express.Router();

// 커밋 목록 가져오기
router.get("/commits", async (req, res) => {
  const { owner, repo } = req.query;
  if (!owner || !repo) return res.status(400).json({ message: "owner/repo required" });

  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {
      headers: {
        Authorization: `Bearer ${process.env.VITE_GITHUB_TOKEN}`,
        "User-Agent": "SmartBlog-App",
      },
      params: { per_page: 10 },
    });
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "GitHub API error", detail: err.message });
  }
});

// PR 목록 가져오기 (GraphQL 버전)
router.get("/prs", async (req, res) => {
  const { owner, repo } = req.query;
  if (!owner || !repo) return res.status(400).json({ message: "owner/repo required" });

  const query = `
    query {
      repository(owner: "${owner}", name: "${repo}") {
        pullRequests(states: OPEN, first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            number
            title
            url
            createdAt
            author {
              login
              url
            }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      "https://api.github.com/graphql",
      { query },
      {
        headers: {
          Authorization: `Bearer ${process.env.VITE_GITHUB_TOKEN}`,
          "User-Agent": "SmartBlog-App",
          "Content-Type": "application/json",
        },
      }
    );

    const prs = response.data.data.repository.pullRequests.nodes;
    res.json(prs);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "GitHub GraphQL API error", detail: err.message });
  }
});

// 내 GitHub 저장소 목록 (로그인 계정 기준)
router.get("/repos", async (req, res) => {
  try {
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${process.env.VITE_GITHUB_TOKEN}`,
        "User-Agent": "SmartBlog-App",
      },
      params: { per_page: 30, sort: "updated" },
    });
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "GitHub API error", detail: err.message });
  }
});

export default router;