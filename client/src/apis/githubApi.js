import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

// axios 인스턴스 생성 (나중에 interceptor 추가 가능)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

/**
 * GitHub 레포지토리의 활동(커밋, PR) 조회
 * @param {string} owner - 레포지토리 소유자
 * @param {string} repo - 레포지토리 이름
 * @returns {Promise<Array>} 활동 목록
 */
export const fetchGitHubActivity = async (owner, repo) => {
  const response = await apiClient.get(`/api/github/activity/${owner}/${repo}`);
  return response.data;
};
