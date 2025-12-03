import { useReducer, useCallback } from 'react'

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

interface AsyncState<T> {
  status: AsyncStatus
  data: T | null
  error: Error | null
}

type AsyncAction<T> =
  | { type: 'PENDING' }
  | { type: 'SUCCESS'; payload: T }
  | { type: 'ERROR'; payload: Error }
  | { type: 'RESET' }

const initialState: AsyncState<unknown> = {
  status: 'idle',
  data: null,
  error: null,
}

/**
 * 비동기 작업 상태 관리 훅
 * @template T 비동기 작업의 반환 타입
 * @param asyncFunction 실행할 비동기 함수
 * @returns { status, data, error, execute }
 * @example
 * const { status, data, error, execute } = useAsync(fetchUsers)
 * await execute(params)
 */
export const useAsync = <T,>(
  asyncFunction: (...args: unknown[]) => Promise<T>,
  immediate = false
) => {
  const [state, dispatch] = useReducer(
    (state: AsyncState<T>, action: AsyncAction<T>): AsyncState<T> => {
      switch (action.type) {
        case 'PENDING':
          return { ...state, status: 'loading', error: null }
        case 'SUCCESS':
          return { ...state, status: 'success', data: action.payload, error: null }
        case 'ERROR':
          return { ...state, status: 'error', error: action.payload, data: null }
        case 'RESET':
          return initialState as AsyncState<T>
        default:
          return state
      }
    },
    initialState as AsyncState<T>
  )

  // 비동기 함수 실행
  const execute = useCallback(
    async (...args: unknown[]) => {
      dispatch({ type: 'PENDING' })
      try {
        const response = await asyncFunction(...args)
        dispatch({ type: 'SUCCESS', payload: response as T })
        return response
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        dispatch({ type: 'ERROR', payload: err })
        throw err
      }
    },
    [asyncFunction]
  )

  // 리셋
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
