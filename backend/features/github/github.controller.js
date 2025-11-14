import {
  fetchCommits,
  fetchPRs,
  fetchMyRepos,
  fetchPRDetail,
} from "./github.service.js";

// ----------------------
// Commits
// ----------------------
export const getCommits = async (req, res) => {
  const { owner, repo, per_page = 10, page = 1 } = req.query;

  if (!owner || !repo) {
    return res.status(400).json({ message: "owner/repo required" });
  }

  try {
    const data = await fetchCommits({ owner, repo, per_page, page });
    res.json(data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "GitHub API error", detail: err.message });
  }
};

// ----------------------
// Pull Requests
// ----------------------
export const getPRs = async (req, res) => {
  const { owner, repo, per_page = 10, page = 1, state = "open" } = req.query;

  if (!owner || !repo) {
    return res.status(400).json({ message: "owner/repo required" });
  }

  try {
    const data = await fetchPRs({ owner, repo, per_page, page, state });
    res.json(data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "GitHub API error", detail: err.message });
  }
};

// ----------------------
// My repos
// ----------------------
export const getMyRepos = async (req, res) => {
  try {
    const data = await fetchMyRepos();
    res.json(data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "GitHub API error", detail: err.message });
  }
};

// ----------------------
// PR Detail
// ----------------------
export const getPRDetail = async (req, res) => {
  const { owner, repo } = req.query;
  const { number } = req.params;

  if (!owner || !repo || !number) {
    return res.status(400).json({ message: "owner, repo, number required" });
  }

  try {
    const data = await fetchPRDetail({ owner, repo, number });
    res.json(data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "GitHub API error", detail: err.message });
  }
};