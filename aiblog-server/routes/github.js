import express from 'express';
import { getGraphQLQuery, parseRepoName } from '../helpers/githubHelpers.js';

const githubRouter = express.Router();

const GITHUB_API_URL = 'https://api.github.com/graphql';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('ERROR: GITHUB_TOKEN is not defined in .env file.');
}

githubRouter.get('/data', async (req, res) => {
  const { repoName, filterType = 'all' } = req.query;
  const repoDetails = parseRepoName(repoName);
  if (!repoDetails) {
    return res.status(400).json({
      message:
        'Invalid repository format. Please use "owner/repo" or a GitHub URL.',
    });
  }
  const query = getGraphQLQuery(filterType);
  const variables = {
    owner: repoDetails.owner,
    name: repoDetails.name,
  };
  try {
    const githubResponse = await fetch(GITHUB_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!githubResponse.ok) {
      const errorData = await githubResponse.json().catch(() => ({}));
      return res.status(githubResponse.status).json({
        message: `GitHub API Error: ${
          errorData.message || githubResponse.statusText
        }`,
        details: errorData,
      });
    }
    const data = await githubResponse.json();
    if (data.errors) {
      const isNotFound = data.errors.some((err) => err.type === 'NOT_FOUND');
      if (isNotFound) {
        return res.status(404).json({
          message: `Repository "${repoDetails.owner}/${repoDetails.name}" not found.`,
          details: data.errors,
        });
      }
      console.error(
        '!!! GitHub GraphQL Error:',
        JSON.stringify(data.errors, null, 2)
      );
      return res.status(500).json({
        message: 'Error fetching data from GitHub.',
        details: data.errors,
      });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error('Server fetch error:', error);
    res.status(500).json({
      message: 'Failed to connect to GitHub API.',
      details: error.message,
    });
  }
});

export default githubRouter;