import React, { createContext, useReducer, useCallback, ReactNode } from 'react'
import {
  Repository,
  CommitData,
  PullRequestData,
  RepositoryState,
  RepositoryAction,
  AsyncStatus,
} from './types'

// Context 생성
export const RepositoryContext = createContext<{
  state: RepositoryState
  dispatch: React.Dispatch<RepositoryAction>
  // 편의 메서드
  selectRepository: (repo: Repository) => void
  loadCommits: (commits: CommitData[]) => void
  loadPullRequests: (prs: PullRequestData[]) => void
  startFetch: () => void
  setFetchError: (error: string) => void
  resetRepository: () => void
  clearRepositories: () => void
} | null>(null)

// 초기 상태
const initialState: RepositoryState = {
  status: 'idle',
  error: null,
  data: {
    selectedRepository: null,
    repositories: [],
    commits: [],
    pullRequests: [],
  },
}

// Reducer 함수
const repositoryReducer = (state: RepositoryState, action: RepositoryAction): RepositoryState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        status: 'loading',
        error: null,
      }

    case 'FETCH_SUCCESS':
      return {
        ...state,
        status: 'success',
        error: null,
        data: {
          ...state.data,
          repositories: action.payload.repositories,
        },
      }

    case 'FETCH_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      }

    case 'SELECT_REPOSITORY':
      return {
        ...state,
        data: {
          ...state.data,
          selectedRepository: action.payload,
          commits: [], // 새 레포 선택 시 초기화
          pullRequests: [],
        },
      }

    case 'LOAD_COMMITS':
      return {
        ...state,
        data: {
          ...state.data,
          commits: action.payload,
        },
      }

    case 'LOAD_PULL_REQUESTS':
      return {
        ...state,
        data: {
          ...state.data,
          pullRequests: action.payload,
        },
      }

    case 'RESET_REPOSITORY':
      return {
        ...state,
        data: {
          ...state.data,
          selectedRepository: null,
          commits: [],
          pullRequests: [],
        },
      }

    case 'CLEAR_REPOSITORIES':
      return initialState

    default:
      return state
  }
}

// Provider 컴포넌트
export const RepositoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(repositoryReducer, initialState)

  // 편의 메서드
  const selectRepository = useCallback((repo: Repository) => {
    dispatch({ type: 'SELECT_REPOSITORY', payload: repo })
  }, [])

  const loadCommits = useCallback((commits: CommitData[]) => {
    dispatch({ type: 'LOAD_COMMITS', payload: commits })
  }, [])

  const loadPullRequests = useCallback((prs: PullRequestData[]) => {
    dispatch({ type: 'LOAD_PULL_REQUESTS', payload: prs })
  }, [])

  const startFetch = useCallback(() => {
    dispatch({ type: 'FETCH_START' })
  }, [])

  const setFetchError = useCallback((error: string) => {
    dispatch({ type: 'FETCH_ERROR', payload: error })
  }, [])

  const resetRepository = useCallback(() => {
    dispatch({ type: 'RESET_REPOSITORY' })
  }, [])

  const clearRepositories = useCallback(() => {
    dispatch({ type: 'CLEAR_REPOSITORIES' })
  }, [])

  const value = {
    state,
    dispatch,
    selectRepository,
    loadCommits,
    loadPullRequests,
    startFetch,
    setFetchError,
    resetRepository,
    clearRepositories,
  }

  return (
    <RepositoryContext.Provider value={value}>
      {children}
    </RepositoryContext.Provider>
  )
}
