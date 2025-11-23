import React, { createContext, useReducer, useCallback, ReactNode } from 'react'
import { CommitData, PullRequestData, SummaryState, SummaryAction } from './types'

// Context 생성
export const SummaryContext = createContext<{
  state: SummaryState
  dispatch: React.Dispatch<SummaryAction>
  // 편의 메서드
  startGenerate: () => void
  setSummary: (summary: string) => void
  setGenerateError: (error: string) => void
  setSelectedItem: (type: 'commit' | 'pr', data: CommitData | PullRequestData) => void
  clearSummary: () => void
} | null>(null)

// 초기 상태
const initialState: SummaryState = {
  status: 'idle',
  error: null,
  data: {
    summary: '',
    selectedType: null,
    selectedData: null,
  },
}

// Reducer 함수
const summaryReducer = (state: SummaryState, action: SummaryAction): SummaryState => {
  switch (action.type) {
    case 'GENERATE_START':
      return {
        ...state,
        status: 'loading',
        error: null,
      }

    case 'GENERATE_SUCCESS':
      return {
        ...state,
        status: 'success',
        error: null,
        data: {
          ...state.data,
          summary: action.payload,
        },
      }

    case 'GENERATE_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      }

    case 'SET_SELECTED_ITEM':
      return {
        ...state,
        data: {
          ...state.data,
          selectedType: action.payload.type,
          selectedData: action.payload.data,
          summary: '', // 새 아이템 선택 시 요약 초기화
        },
      }

    case 'CLEAR_SUMMARY':
      return initialState

    default:
      return state
  }
}

// Provider 컴포넌트
export const SummaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(summaryReducer, initialState)

  // 편의 메서드
  const startGenerate = useCallback(() => {
    dispatch({ type: 'GENERATE_START' })
  }, [])

  const setSummary = useCallback((summary: string) => {
    dispatch({ type: 'GENERATE_SUCCESS', payload: summary })
  }, [])

  const setGenerateError = useCallback((error: string) => {
    dispatch({ type: 'GENERATE_ERROR', payload: error })
  }, [])

  const setSelectedItem = useCallback((type: 'commit' | 'pr', data: CommitData | PullRequestData) => {
    dispatch({ type: 'SET_SELECTED_ITEM', payload: { type, data } })
  }, [])

  const clearSummary = useCallback(() => {
    dispatch({ type: 'CLEAR_SUMMARY' })
  }, [])

  const value = {
    state,
    dispatch,
    startGenerate,
    setSummary,
    setGenerateError,
    setSelectedItem,
    clearSummary,
  }

  return (
    <SummaryContext.Provider value={value}>
      {children}
    </SummaryContext.Provider>
  )
}
