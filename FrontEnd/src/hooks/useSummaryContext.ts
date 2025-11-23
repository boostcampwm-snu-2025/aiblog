import { useContext } from 'react'
import { SummaryContext } from '@/contexts/SummaryContext'

/**
 * Summary Context 사용 훅
 * @returns Summary 상태 및 메서드
 * @throws Error Context가 없을 때
 */
export const useSummaryContext = () => {
  const context = useContext(SummaryContext)

  if (!context) {
    throw new Error('useSummaryContext must be used within SummaryProvider')
  }

  return context
}
