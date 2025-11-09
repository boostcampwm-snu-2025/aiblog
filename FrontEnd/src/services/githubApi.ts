import apiClient from './api'

interface User {
  id: number
  login: string
  email?: string
  avatar_url?: string
}

interface Repository {
  id: string
  name: string
  owner: string
  private?: boolean
}

interface Commit {
  id: string
  message: string
  author: string
  date: string
  sha?: string
}

interface PullRequest {
  id: string
  title: string
  author: string
  date: string
  number?: number
  status?: 'open' | 'closed' | 'merged'
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

/**
 * 현재 로그인한 사용자 정보 조회
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me')
    return response.data.data || null
  } catch (error) {
    console.error('Failed to fetch current user:', error)
    return null
  }
}

/**
 * 사용자의 GitHub 저장소 목록 조회
 */
export const getRepositories = async (): Promise<Repository[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Repository[]>>('/github/repositories')
    return response.data.data || []
  } catch (error) {
    console.error('Failed to fetch repositories:', error)
    throw error
  }
}

/**
 * 저장소의 커밋 목록 조회
 */
export const getCommits = async (owner: string, repo: string): Promise<Commit[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Commit[]>>('/github/commits', {
      params: {
        owner,
        repo,
      },
    })
    return response.data.data || []
  } catch (error) {
    console.error('Failed to fetch commits:', error)
    throw error
  }
}

/**
 * 저장소의 Pull Requests 목록 조회
 */
export const getPullRequests = async (owner: string, repo: string): Promise<PullRequest[]> => {
  try {
    const response = await apiClient.get<ApiResponse<PullRequest[]>>('/github/pulls', {
      params: {
        owner,
        repo,
      },
    })
    return response.data.data || []
  } catch (error) {
    console.error('Failed to fetch pull requests:', error)
    throw error
  }
}
