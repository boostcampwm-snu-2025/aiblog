/**
 * 전역 상태 관리를 위한 타입 정의
 */

// 비동기 상태 패턴
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

// Repository 타입
export interface Repository {
  id: number
  name: string
  owner: string
  url: string
  description: string
  language: string | null
}

export interface CommitData {
  sha: string
  message: string
  author: string
  date: string
  files?: string
}

export interface PullRequestData {
  number: number
  title: string
  author: string
  date: string
  status: 'open' | 'closed' | 'merged'
  body?: string
  files?: string
  comments?: string
  readme?: string
}

// Repository 상태
export interface RepositoryState {
  status: AsyncStatus
  error: string | null
  data: {
    selectedRepository: Repository | null
    repositories: Repository[]
    commits: CommitData[]
    pullRequests: PullRequestData[]
  }
}

export type RepositoryAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { repositories: Repository[] } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SELECT_REPOSITORY'; payload: Repository }
  | { type: 'LOAD_COMMITS'; payload: CommitData[] }
  | { type: 'LOAD_PULL_REQUESTS'; payload: PullRequestData[] }
  | { type: 'RESET_REPOSITORY' }
  | { type: 'CLEAR_REPOSITORIES' }

// Summary 상태
export interface SummaryState {
  status: AsyncStatus
  error: string | null
  data: {
    summary: string
    selectedType: 'commit' | 'pr' | null
    selectedData: CommitData | PullRequestData | null
  }
}

export type SummaryAction =
  | { type: 'GENERATE_START' }
  | { type: 'GENERATE_SUCCESS'; payload: string }
  | { type: 'GENERATE_ERROR'; payload: string }
  | { type: 'SET_SELECTED_ITEM'; payload: { type: 'commit' | 'pr'; data: CommitData | PullRequestData } }
  | { type: 'CLEAR_SUMMARY' }

// Selected Item 상태
export interface SelectedItemState {
  type: 'commit' | 'pr' | null
  data: CommitData | PullRequestData | null
}
