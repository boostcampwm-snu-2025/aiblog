import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Use dotenv/config for top-level import
import { parseRepoName, getGraphQLQuery  } from './utils';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Allow client requests
app.use(express.json()); // Allow parsing JSON (though not needed for GET)

const GITHUB_API_URL = 'https://api.github.com/graphql';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('ERROR: GITHUB_TOKEN is not defined in .env file.');
  process.exit(1);
}

// --- Endpoints ---

// 1. Test endpoint (from previous setup)
app.get('/api/test', (req, res) => {
  res.json({ message: '👋 Express 서버에서 보낸 메시지입니다!' });
});

// 2. Main GitHub data endpoint
app.get('/api/github/data', async (req, res) => {
  const { repoName, filterType = 'all' } = req.query;

  // Step 1: Parse repoName
  const repoDetails = parseRepoName(repoName);
  if (!repoDetails) {
    return res.status(400).json({
      message:
        'Invalid repository format. Please use "owner/repo" or a GitHub URL.',
    });
  }

  // Step 2: Get the correct query
  const query = getGraphQLQuery(filterType);
  const variables = {
    owner: repoDetails.owner,
    name: repoDetails.name,
  };

  // Step 3: Fetch from GitHub GraphQL API
  try {
    const githubResponse = await fetch(GITHUB_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    // Check if the fetch response itself is OK (e.g., 200-299)
    if (!githubResponse.ok) {
      const errorData = await githubResponse.json().catch(() => ({})); // Try to parse error
      return res.status(githubResponse.status).json({
        message: `GitHub API Error: ${
          errorData.message || githubResponse.statusText
        }`,
        details: errorData,
      });
    }

    const data = await githubResponse.json();

    // Step 4: Handle GitHub API errors (e.g., Repo Not Found)
    if (data.errors) {
      // Check for a 'NOT_FOUND' error
      const isNotFound = data.errors.some((err) => err.type === 'NOT_FOUND');
      if (isNotFound) {
        return res.status(404).json({
          message: `Repository "${repoDetails.owner}/${repoDetails.name}" not found.`,
          details: data.errors,
        });
      }
      // Other GitHub errors
      console.error(
        '!!! GitHub GraphQL Error:',
        JSON.stringify(data.errors, null, 2)
      );
      return res.status(500).json({
        message: 'Error fetching data from GitHub.',
        details: data.errors,
      });
    }

    // Step 5: Success - return the data to the client
    res.status(200).json(data);
    
  } catch (error) {
    // Step 6: Handle network or other fetch errors
    console.error('Server fetch error:', error);
    res.status(500).json({
      message: 'Failed to connect to GitHub API.',
      details: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Express server is running on http://localhost:${PORT}.`);
});