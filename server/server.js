import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors()); // allow frontend to call backend locally

const PORT = process.env.PORT || 3000;

// Example route: Get repos
app.get("/api/repos", async (req, res) => {
  try {
    const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=5", {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch repos" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
