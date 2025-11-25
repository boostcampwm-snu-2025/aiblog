const express = require("express");
const router = express.Router();

router.get("/activities", async (req, res) => {
  const { owner, repo, branch } = req.query;

  try {
    const listURL = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}`;
    const listResponse = await fetch(listURL, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const commits = await listResponse.json();

    // 각 커밋마다 diff 가져오기
    const detailedCommits = await Promise.all(
      commits.map(async (commit) => {
        const detailURL = `https://api.github.com/repos/${owner}/${repo}/commits/${commit.sha}`;
        const detailResponse = await fetch(detailURL, {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        const detail = await detailResponse.json();

        // 모든 파일의 patch(diff)를 합치기
        const diff = detail.files
          ?.filter((f) => f.patch)
          ?.map((f) => f.patch)
          ?.join("\n\n");

        return {
          message: commit.commit.message,
          sha: commit.sha,
          diff: diff || "No diff available",
          authorName: commit.commit?.author?.name ?? "Unknown",
          authorLogin: commit.author?.login ?? "unknown",
          date: commit.commmit?.author?.date ?? null,
        };
      })
    );

    res.json(detailedCommits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "GitHub API failed" });
  }
});

module.exports = router;
