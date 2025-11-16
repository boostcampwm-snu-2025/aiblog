const express = require('express');
const { Octokit } = require('octokit');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// GitHub token from .env
const githubToken = process.env.GITHUB_TOKEN;

// Initialize Octokit
const octokit = new Octokit({
  auth: githubToken
});

// API endpoint to get public repositories
app.get('/api/repos', async (req, res) => {
  try {
    const response = await octokit.request('GET /user/repos', {
      visibility: 'public',
      affiliation: 'owner',
      sort: 'updated',
      per_page: 100,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const repositories = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      owner: repo.owner && repo.owner.login ? repo.owner.login : null,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updated_at: repo.updated_at
    }));

    res.json(repositories);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

// Get commits for a repo (owner and repo name expected in path)
app.get('/api/repos/:owner/:repo/commits', async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner,
      repo,
      per_page: 100,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const commits = response.data.map(c => ({
      sha: c.sha,
      message: c.commit && c.commit.message ? c.commit.message : '',
      author: (c.commit && c.commit.author && c.commit.author.name) || (c.author && c.author.login) || null,
      date: c.commit && c.commit.author ? c.commit.author.date : null,
      url: c.html_url
    }));

    res.json(commits);
  } catch (error) {
    console.error('Error fetching commits for', owner, repo, error);
    res.status(500).json({ error: 'Failed to fetch commits' });
  }
});

// Get pull requests for a repo
app.get('/api/repos/:owner/:repo/pulls', async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner,
      repo,
      state: 'all',
      per_page: 100,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const pulls = response.data.map(p => ({
      id: p.id,
      number: p.number,
      title: p.title,
      user: p.user ? p.user.login : null,
      state: p.state,
      created_at: p.created_at,
      updated_at: p.updated_at,
      merged_at: p.merged_at,
      url: p.html_url
    }));

    res.json(pulls);
  } catch (error) {
    console.error('Error fetching pulls for', owner, repo, error);
    res.status(500).json({ error: 'Failed to fetch pull requests' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
