import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;


if (!GITHUB_TOKEN) {
  console.error("❌ Missing GITHUB_TOKEN in .env");
  process.exit(1);
}
if (!GOOGLE_API_KEY) {
  console.error("❌ Missing GOOGLE_API_KEY in .env");
  process.exit(1);
}

const GH_HEADERS = {
  Authorization: `token ${GITHUB_TOKEN}`,
  "User-Agent": "GitHub-Explorer-App",
};
const ai = new GoogleGenAI({
  // auth via API key
//  authClient: null,
  apiKey: GOOGLE_API_KEY,
});
/* -----------------------------------------------------------
   GET /api/repos
----------------------------------------------------------- */
app.get("/api/repos", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.github.com/user/repos?sort=updated&per_page=100",
      { headers: GH_HEADERS }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "GitHub API error" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Repos error:", error);
    res.status(500).json({ error: "Failed to fetch repos" });
  }
});

/* -----------------------------------------------------------
   GET commits for a repo
   /api/repos/:username/:repoName/commits
----------------------------------------------------------- */
app.get("/api/repos/:username/:repoName/commits", async (req, res) => {
  const { username, repoName } = req.params;

  try {
    const url = `https://api.github.com/repos/${username}/${repoName}/commits?per_page=50`;

    const response = await fetch(url, { headers: GH_HEADERS });

    if (!response.ok) {
      return res.status(response.status).json({ error: "GitHub API error" });
    }

    const data = await response.json();

    const formatted = data.map((c) => ({
      sha: c.sha,
      message: c.commit.message,
      date: c.commit.author?.date,
      author: c.commit.author?.name,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Commits error:", error);
    res.status(500).json({ error: "Failed to fetch commits" });
  }
});

/* -----------------------------------------------------------
   GET README.md as raw markdown
   /api/repos/:username/:repoName/readme
----------------------------------------------------------- */
app.get("/api/repos/:username/:repoName/readme", async (req, res) => {
  const { username, repoName } = req.params;

  try {
    const url = `https://api.github.com/repos/${username}/${repoName}/readme`;

    const response = await fetch(url, { headers: GH_HEADERS });

    if (response.status === 404) {
      return res.json({ content: "# No README.md found" });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: "GitHub API error" });
    }

    const data = await response.json();

    const markdown = Buffer.from(data.content, "base64").toString("utf-8");

    res.json({ content: markdown });
  } catch (error) {
    console.error("README error:", error);
    res.status(500).json({ error: "Failed to fetch README" });
  }
});

/* -----------------------------------------------------------
   SEARCH repos: /api/search?query=...
----------------------------------------------------------- */
app.get("/api/search", async (req, res) => {
  const query = (req.query.query || "").toLowerCase();

  try {
    const response = await fetch(
      "https://api.github.com/user/repos?per_page=200",
      { headers: GH_HEADERS }
    );

    const repos = await response.json();

    const filtered = repos.filter((r) =>
      r.name.toLowerCase().includes(query)
    );

    res.json(filtered);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search repos" });
  }
});

/**
 * POST /api/generate-blog
 * Body: { username: string, repo: string, commits: Array<{sha, message, author, date}> (optional) }
 */


app.post("/api/generate-blog", async (req, res) => {
  const { username, repo, commits } = req.body;

  if (!username || !repo) {
    return res.status(400).json({ error: "username and repo are required" });
  }

  try {
    // Fetch recent commits if not passed in
    let commitList = commits;
    if (!commitList) {
      const commitRes = await fetch(
        `https://api.github.com/repos/${username}/${repo}/commits?per_page=10`,
        { headers: GH_HEADERS }
      );
      const commitData = await commitRes.json();
      commitList = commitData.map((c) => ({
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author?.name,
        date: c.commit.author?.date,
      }));
    }

    // Build a prompt for the LLM
    const promptText = `
You are a technical blogger. Write a **detailed blog post** (in Markdown) about recent GitHub work in the repository "${repo}" owned by "${username}".
Here are the last few commits:
${commitList
  .map(
    (c) =>
      `- **${c.sha.substring(0, 7)}** (${c.author} - ${c.date}): ${c.message}`
  )
  .join("\n")}

Write the blog as if for a developer audience. Include:
- A title  
- Introduction  
- Sections describing the changes  
- Why the changes matter  
- A conclusion  

Make the blog friendly, professional, and informative.
`;

    // Call GoogleGenAI
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // you can change to the model you want to use
      contents: promptText,
      temperature: 0.7, // controls creativity
      maxOutputTokens: 1024,
    });

    const generated = response.text;
    if (!generated) {
      return res
        .status(500)
        .json({ error: "No text returned from Gemini model." });
    }

    res.json({ blog: generated });
  } catch (err) {
    console.error("Error in /generate-blog:", err);
    res.status(500).json({ error: "Failed to generate blog." });
  }
});

/* -----------------------------------------------------------
   Start server
----------------------------------------------------------- */
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
