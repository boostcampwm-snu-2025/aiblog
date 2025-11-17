const express = require("express");
const router = express.Router();

router.get("/activities", async (req, res) => {
  const { owner, repo } = req.query;

  if (!owner || !repo) {
    return res
      .status(400)
      .json({ error: "owner and repo query parameters are required." });
  }

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits`; // ★ 오타 수정

    //디버깅
    console.log("debug url:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "node-app",
        Accept: "application/vnd.github.v3+json",
      },
    });

    //디버깅
    console.log("debug status:", response.status);

    if (!response.ok) {
      //디버깅
      const errorData = await response.text();
      console.log("debug error data:", errorData);

      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching GitHub activities:", error);
    console.log("TOKEN:", process.env.GITHUB_TOKEN);
    res.status(500).json({ error: "Failed to fetch data from GitHub API." });
  }
});

module.exports = router;
