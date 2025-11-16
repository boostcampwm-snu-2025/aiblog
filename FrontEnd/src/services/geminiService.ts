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

    console.log('=== Gemini Summary 요청 데이터 ===')
    console.log('Type:', request.type)
    console.log('Data keys:', Object.keys(request.data))
    if (request.type === 'commit') {
      const commitData = request.data as any
      console.log('Commit Message:', commitData.message ? `${commitData.message.length}자` : '없음')
      console.log('Commit Files:', commitData.files ? `${commitData.files.length}자` : '없음')
    }
    if (request.type === 'pr') {
      const prData = request.data as any
      console.log('PR Title:', prData.title)
      console.log('PR Comments:', prData.comments ? `${prData.comments.length}자` : '없음')
      console.log('PR README:', prData.readme ? `${prData.readme.length}자` : '없음')
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
    console.error('Summary 생성 오류:', error)
    throw error
  }
}
