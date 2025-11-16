import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 블로그 생성은 시간이 걸릴 수 있으므로 30초
});

/**
 * 활동 정보를 기반으로 AI 블로그 글 생성
 * @param {Object} activityData - 활동 정보 (커밋 or PR)
 * @returns {Promise<Object>} 생성된 블로그 { title, content, createdAt }
 */
export const generateBlog = async (activityData) => {
  const response = await apiClient.post('/api/blog/generate', activityData);
  return response.data.data; // { success: true, data: {...} }
};
