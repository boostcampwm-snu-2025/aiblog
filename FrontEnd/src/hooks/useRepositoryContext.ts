import { useContext } from 'react'
import { RepositoryContext } from '@/contexts/RepositoryContext'

/**
 * Repository Context 사용 훅
 * @returns Repository 상태 및 메서드
 * @throws Error Context가 없을 때
 */
export const useRepositoryContext = () => {
  const context = useContext(RepositoryContext)

  if (!context) {
    throw new Error('useRepositoryContext must be used within RepositoryProvider')
  }

  return context
}
