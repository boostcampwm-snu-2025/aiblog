import express from "express";

const router = express.Router();

// PR 상태 상수
const PR_STATUS = {
  DRAFT: "draft",
  OPEN: "open",
  MERGED: "merged",
  CLOSED: "closed",
} as const;

// PR 상태 판별 함수
const getPRStatus = (
  state: string,
  draft: boolean,
  mergedAt: string | null
) => {
  if (draft) return PR_STATUS.DRAFT;
  if (state === "open") return PR_STATUS.OPEN;
  if (mergedAt) return PR_STATUS.MERGED;
  return PR_STATUS.CLOSED;
};

// PR 목록 조회 (간소화된 데이터)
router.get("/repos/:owner/:repo/pulls", async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { state = "all" } = req.query;

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

    const simplified = data.map((pr: any) => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      state: pr.state,
      prStatus: getPRStatus(pr.state, pr.draft, pr.merged_at),
      user: {
        login: pr.user.login,
      },
      createdAt: pr.created_at,
      mergedAt: pr.merged_at,
      draft: pr.draft,
    }));

    res.json(simplified);
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

    const pr = await response.json();

    const simplified = {
      id: pr.id,
      number: pr.number,
      title: pr.title,
      state: pr.state,
      prStatus: getPRStatus(pr.state, pr.draft, pr.merged_at),
      body: pr.body,
      user: {
        login: pr.user.login,
      },
      createdAt: pr.created_at,
      mergedAt: pr.merged_at,
      draft: pr.draft,
      htmlUrl: pr.html_url,
    };

    res.json(simplified);
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

      const simplified = data.map((commit: any) => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: {
          name: commit.commit.author.name,
          date: commit.commit.author.date,
        },
      }));

      res.json(simplified);
    } catch (error) {
      console.error("Error fetching commits:", error);
      res.status(500).json({ error: "Failed to fetch commits" });
    }
  }
);

export default router;
