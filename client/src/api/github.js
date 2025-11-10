import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Axios instance for GitHub API calls
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API Service for GitHub Data
 * 
 * These functions are used by TanStack Query hooks
 * They handle the actual HTTP requests to our Express server
 */

/**
 * Fetch repository information
 */
export const fetchRepository = async (owner, repo) => {
  const response = await apiClient.get(`/github/repo/${owner}/${repo}`);
  return response.data;
};

/**
 * Fetch commits for a repository
 */
export const fetchCommits = async (owner, repo, options = {}) => {
  const { per_page = 30, page = 1 } = options;
  const response = await apiClient.get(`/github/commits/${owner}/${repo}`, {
    params: { per_page, page }
  });
  return response.data;
};

/**
 * Fetch pull requests for a repository
 */
export const fetchPullRequests = async (owner, repo, options = {}) => {
  const { state = 'all', per_page = 30, page = 1 } = options;
  const response = await apiClient.get(`/github/pulls/${owner}/${repo}`, {
    params: { state, per_page, page }
  });
  return response.data;
};

export default apiClient;
