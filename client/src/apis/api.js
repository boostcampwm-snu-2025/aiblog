import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 블로그 생성은 시간이 걸릴 수 있으므로 30초
});

/**
 * GitHub API
 */
export const githubApi = {
  /**
   * GitHub 레포지토리의 활동(커밋, PR) 조회
   * @param {string} owner - 레포지토리 소유자
   * @param {string} repo - 레포지토리 이름
   * @returns {Promise<Array>} 활동 목록
   */
  getActivity: async (owner, repo) => {
    const response = await apiClient.get(`/api/github/activity/${owner}/${repo}`);
    return response.data;
  },

  /**
   * GitHub 레포지토리의 커밋 목록 조회
   * @param {string} owner - 레포지토리 소유자
   * @param {string} repo - 레포지토리 이름
   * @returns {Promise<Array>} 커밋 목록
   */
  getCommits: async (owner, repo) => {
    const response = await apiClient.get(`/api/github/commits/${owner}/${repo}`);
    return response.data;
  },

  /**
   * GitHub 레포지토리의 PR 목록 조회
   * @param {string} owner - 레포지토리 소유자
   * @param {string} repo - 레포지토리 이름
   * @param {string} state - PR 상태 (open, closed, all)
   * @returns {Promise<Array>} PR 목록
   */
  getPullRequests: async (owner, repo, state = 'all') => {
    const response = await apiClient.get(`/api/github/pulls/${owner}/${repo}`, {
      params: { state }
    });
    return response.data;
  },
};

/**
 * Blog API
 */
export const blogApi = {
  /**
   * 활동 정보를 기반으로 AI 블로그 글 생성
   * @param {Object} activityData - 활동 정보 (커밋 or PR)
   * @param {string} activityData.type - 활동 타입 ('commit' | 'pull_request')
   * @param {string} activityData.message - 커밋 메시지 (커밋일 때)
   * @param {string} activityData.title - PR 제목 (PR일 때)
   * @param {string} activityData.author - 작성자
   * @param {string} activityData.date - 작성 날짜
   * @returns {Promise<Object>} 생성된 블로그 { title, content, createdAt }
   */
  generate: async (activityData) => {
    const response = await apiClient.post('/api/blog/generate', activityData);
    return response.data.data; // { success: true, data: {...} }
  },
};

/**
 * 통합 API 객체 (선택적으로 사용)
 */
const api = {
  github: githubApi,
  blog: blogApi,
};

export default api;
