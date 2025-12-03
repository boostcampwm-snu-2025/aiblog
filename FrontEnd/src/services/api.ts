import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터: 모든 요청에 Authorization 헤더 추가
apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  // GitHub API 요청인 경우 X-GitHub-Token 헤더 추가
  const githubToken = localStorage.getItem('githubToken')
  if (githubToken) {
    config.headers['X-GitHub-Token'] = githubToken
  }

  return config
})

// 응답 인터셉터: 401 에러 처리 (토큰 만료 시)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 액세스 토큰 만료, 로그인 페이지로 리다이렉트
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('githubToken')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default apiClient
