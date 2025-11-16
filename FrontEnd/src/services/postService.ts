import { CommitData, PullRequestData } from '@/components/List'
import api from './api'

interface BlogPost {
  id: string
  type: 'commit' | 'pr'
  typeLabel: string
  message?: string
  title?: string
  author: string
  date: string
  summary: string
  createdAt: string
  status?: string
  number?: number
}

interface PostResponse {
  message: string
  post?: BlogPost
  deletedPost?: BlogPost
}

interface PostsResponse {
  total: number
  posts: BlogPost[]
  page: number
  perPage: number
  totalPages: number
}

/**
 * 포스트 저장 (Commit/PR을 Blog Post로)
 */
export const saveBlogPost = async (
  type: 'commit' | 'pr',
  typeLabel: string,
  data: CommitData | PullRequestData,
  summary: string
): Promise<BlogPost> => {
  const payload = {
    type,
    typeLabel,
    author: data.author,
    date: data.date,
    summary
  }

  // type에 따라 추가 필드 설정
  if (type === 'commit') {
    const commitData = data as CommitData
    ;(payload as any).message = commitData.message
  } else {
    const prData = data as PullRequestData
    ;(payload as any).title = prData.title
    ;(payload as any).status = prData.status
    ;(payload as any).number = prData.number
  }

  const response = await api.post<PostResponse>('/posts', payload)
  return response.data.post!
}

/**
 * 포스트 조회 (페이지네이션)
 */
export const getBlogPosts = async (page: number = 1): Promise<PostsResponse> => {
  const response = await api.get<PostsResponse>(`/posts?page=${page}`)
  return response.data
}

/**
 * 특정 포스트 조회
 */
export const getBlogPostById = async (id: string): Promise<BlogPost> => {
  const response = await api.get<BlogPost>(`/posts/${id}`)
  return response.data
}

/**
 * 포스트 삭제
 */
export const deleteBlogPost = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`)
}
