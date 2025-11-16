import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Create axios instance with GitHub token
 */
const createGitHubClient = () => {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.warn('⚠️  GITHUB_TOKEN not found in environment variables');
  }
  
  return axios.create({
    baseURL: GITHUB_API_BASE,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      ...(token && { 'Authorization': `token ${token}` })
    }
  });
};

/**
 * Get repository information
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise} Repository data
 */
export const getRepositoryInfo = async (owner, repo) => {
  try {
    const client = createGitHubClient();
    const response = await client.get(`/repos/${owner}/${repo}`);
    
    // Return only essential information
    return {
      id: response.data.id,
      name: response.data.name,
      full_name: response.data.full_name,
      description: response.data.description,
      owner: {
        login: response.data.owner.login,
        avatar_url: response.data.owner.avatar_url
      },
      html_url: response.data.html_url,
      created_at: response.data.created_at,
      updated_at: response.data.updated_at,
      stargazers_count: response.data.stargazers_count,
      language: response.data.language,
      default_branch: response.data.default_branch
    };
  } catch (error) {
    throw new Error(`Failed to fetch repository: ${error.message}`);
  }
};

/**
 * Get commits for a repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {Object} options - Query options (per_page, page, sha, path, author, since, until)
 * @returns {Promise} Array of commits
 */
export const getCommits = async (owner, repo, options = {}) => {
  try {
    const client = createGitHubClient();
    const response = await client.get(`/repos/${owner}/${repo}/commits`, {
      params: options
    });
    
    // Transform and return commit data
    return response.data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: {
        name: commit.commit.author.name,
        email: commit.commit.author.email,
        date: commit.commit.author.date,
        avatar_url: commit.author?.avatar_url,
        login: commit.author?.login
      },
      committer: {
        name: commit.commit.committer.name,
        date: commit.commit.committer.date
      },
      html_url: commit.html_url,
      stats: {
        additions: commit.stats?.additions,
        deletions: commit.stats?.deletions,
        total: commit.stats?.total
      },
      files_count: commit.files?.length || 0
    }));
  } catch (error) {
    throw new Error(`Failed to fetch commits: ${error.message}`);
  }
};

/**
 * Get pull requests for a repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {Object} options - Query options (state, per_page, page, sort, direction)
 * @returns {Promise} Array of pull requests
 */
export const getPullRequests = async (owner, repo, options = {}) => {
  try {
    const client = createGitHubClient();
    const response = await client.get(`/repos/${owner}/${repo}/pulls`, {
      params: options
    });
    
    // Transform and return PR data
    return response.data.map(pr => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      state: pr.state,
      user: {
        login: pr.user.login,
        avatar_url: pr.user.avatar_url
      },
      body: pr.body,
      created_at: pr.created_at,
      updated_at: pr.updated_at,
      closed_at: pr.closed_at,
      merged_at: pr.merged_at,
      html_url: pr.html_url,
      head: {
        ref: pr.head.ref,
        sha: pr.head.sha
      },
      base: {
        ref: pr.base.ref,
        sha: pr.base.sha
      },
      labels: pr.labels.map(label => ({
        name: label.name,
        color: label.color
      })),
      assignees: pr.assignees.map(assignee => ({
        login: assignee.login,
        avatar_url: assignee.avatar_url
      })),
      requested_reviewers: pr.requested_reviewers?.map(reviewer => ({
        login: reviewer.login,
        avatar_url: reviewer.avatar_url
      }))
    }));
  } catch (error) {
    throw new Error(`Failed to fetch pull requests: ${error.message}`);
  }
};

/**
 * Get detailed commit information including files and diff
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} sha - Commit SHA
 * @returns {Promise} Detailed commit data
 */
export const getCommitDetail = async (owner, repo, sha) => {
  try {
    const client = createGitHubClient();
    const response = await client.get(`/repos/${owner}/${repo}/commits/${sha}`);
    
    return {
      sha: response.data.sha,
      message: response.data.commit.message,
      author: {
        name: response.data.commit.author.name,
        email: response.data.commit.author.email,
        date: response.data.commit.author.date,
        avatar_url: response.data.author?.avatar_url,
        login: response.data.author?.login
      },
      html_url: response.data.html_url,
      stats: {
        additions: response.data.stats?.additions || 0,
        deletions: response.data.stats?.deletions || 0,
        total: response.data.stats?.total || 0
      },
      files: response.data.files?.map(file => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch
      })) || []
    };
  } catch (error) {
    throw new Error(`Failed to fetch commit detail: ${error.message}`);
  }
};

/**
 * Get detailed pull request information including files and comments
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} pullNumber - Pull request number
 * @returns {Promise} Detailed PR data
 */
export const getPullRequestDetail = async (owner, repo, pullNumber) => {
  try {
    const client = createGitHubClient();
    
    // Get PR details
    const prResponse = await client.get(`/repos/${owner}/${repo}/pulls/${pullNumber}`);
    
    // Get PR files
    const filesResponse = await client.get(`/repos/${owner}/${repo}/pulls/${pullNumber}/files`);
    
    // Get PR comments (optional - can be rate-limited)
    let comments = [];
    try {
      const commentsResponse = await client.get(`/repos/${owner}/${repo}/pulls/${pullNumber}/comments`);
      comments = commentsResponse.data.map(comment => ({
        user: comment.user.login,
        body: comment.body,
        created_at: comment.created_at,
        path: comment.path,
        line: comment.line
      }));
    } catch (err) {
      console.warn('Could not fetch PR comments:', err.message);
    }
    
    return {
      number: prResponse.data.number,
      title: prResponse.data.title,
      body: prResponse.data.body,
      state: prResponse.data.state,
      user: {
        login: prResponse.data.user.login,
        avatar_url: prResponse.data.user.avatar_url
      },
      created_at: prResponse.data.created_at,
      merged_at: prResponse.data.merged_at,
      html_url: prResponse.data.html_url,
      head: {
        ref: prResponse.data.head.ref,
        sha: prResponse.data.head.sha
      },
      base: {
        ref: prResponse.data.base.ref,
        sha: prResponse.data.base.sha
      },
      stats: {
        additions: prResponse.data.additions || 0,
        deletions: prResponse.data.deletions || 0,
        changed_files: prResponse.data.changed_files || 0
      },
      files: filesResponse.data.map(file => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch
      })),
      comments: comments
    };
  } catch (error) {
    throw new Error(`Failed to fetch pull request detail: ${error.message}`);
  }
};
