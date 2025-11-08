import express from "express";

const router = express.Router();

// PR 목록 조회 (최신 10개)
router.get("/repos/:owner/:repo/pulls", async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { state = "all" } = req.query;

    // TODO: 페이지네이션 처리
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=${state}&per_page=10`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching PRs:", error);
    res.status(500).json({ error: "Failed to fetch pull requests" });
  }
});

// PR 상세 정보 조회
router.get("/repos/:owner/:repo/pulls/:pull_number", async (req, res) => {
  try {
    const { owner, repo, pull_number } = req.params;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching PR detail:", error);
    res.status(500).json({ error: "Failed to fetch PR detail" });
  }
});

// PR 커밋 로그 조회
router.get(
  "/repos/:owner/:repo/pulls/:pull_number/commits",
  async (req, res) => {
    try {
      const { owner, repo, pull_number } = req.params;

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/commits`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching commits:", error);
      res.status(500).json({ error: "Failed to fetch commits" });
    }
  }
);

export default router;
