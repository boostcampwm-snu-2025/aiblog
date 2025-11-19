import apiClient from './github';

/**
 * Blog API Service
 * 
 * Functions to interact with blog generation endpoints
 */

/**
 * Generate blog from commit
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} sha - Commit SHA
 * @returns {Promise} Generated blog data
 */
export const generateBlogFromCommit = async (owner, repo, sha) => {
  const response = await apiClient.post('/blog/generate/commit', {
    owner,
    repo,
    sha
  });
  return response.data;
};

/**
 * Generate blog from pull request
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} pullNumber - Pull request number
 * @returns {Promise} Generated blog data
 */
export const generateBlogFromPR = async (owner, repo, pullNumber) => {
  const response = await apiClient.post('/blog/generate/pr', {
    owner,
    repo,
    pullNumber
  });
  return response.data;
};

/**
 * Get blog by ID
 * @param {string} blogId - Blog ID
 * @returns {Promise} Blog data
 */
export const getBlog = async (blogId) => {
  const response = await apiClient.get(`/blog/${blogId}`);
  return response.data;
};

/**
 * Get all blogs
 * @param {number} limit - Maximum number of blogs to fetch
 * @returns {Promise} Array of blogs
 */
export const getAllBlogs = async (limit = 50) => {
  const response = await apiClient.get('/blog', {
    params: { limit }
  });
  return response.data;
};
