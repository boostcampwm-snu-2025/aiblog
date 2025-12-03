import { CommitData, PullRequestData } from '@/components/List'
import { storage } from '@/utils/storage'

interface SummaryRequest {
  type: 'commit' | 'pr'
  data: CommitData | PullRequestData
}

interface SummaryResponse {
  summary: string
}

export const generateSummary = async (request: SummaryRequest): Promise<string> => {
  try {
    const accessToken = storage.getAccessToken()
    if (!accessToken) {
      throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.')
    }

    const response = await fetch('/api/gemini/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(request),
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`API 오류: ${response.statusText}`)
    }

    const data: SummaryResponse = await response.json()
    return data.summary
  } catch (error) {
    throw error
  }
}
