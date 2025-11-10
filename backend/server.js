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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
