import express from "express";
import axios from "axios";

const router = express.Router();

// 커밋 목록 가져오기
router.get("/commits", async (req, res) => {
  const { owner, repo, per_page = 10, page = 1 } = req.query;
  if (!owner || !repo) return res.status(400).json({ message: "owner/repo required" });

  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {
      headers: {
        Authorization: `Bearer ${process.env.VITE_GITHUB_TOKEN}`,
        "User-Agent": "SmartBlog-App",
      },
      params: { per_page, page },
    });
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "GitHub API error", detail: err.message });
  }
});

// PR 목록 가져오기
router.get("/prs", async (req, res) => {
  const { owner, repo, per_page = 10, page = 1, state = "open" } = req.query;
  if (!owner || !repo) return res.status(400).json({ message: "owner/repo required" });

  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "SmartBlog-App",
      },
      params: { per_page, page, state },
    });
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "GitHub API error", detail: err.message });
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

// ✅ PR 본문(Description)만 가져오기
router.get("/pr-detail/:number", async (req, res) => {
  const { owner, repo } = req.query;
  const { number } = req.params;

  if (!owner || !repo || !number) {
    return res.status(400).json({ message: "owner, repo, number are required" });
  }

  try {
    const headers = {
      Authorization: `Bearer ${process.env.VITE_GITHUB_TOKEN}`,
      "User-Agent": "SmartBlog-App",
    };

    // GitHub REST API
    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`,
      { headers }
    );

    res.json({
      number: data.number,
      title: data.title,
      body: data.body,
      author: data.user?.login,
      html_url: data.html_url,
      created_at: data.created_at,
      merged: data.merged,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "GitHub API error", detail: err.message });
  }
});

export default router;