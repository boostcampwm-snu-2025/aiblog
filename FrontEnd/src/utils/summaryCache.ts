import { CommitData, PullRequestData } from '@/components/List'

interface CacheEntry {
  summary: string
  timestamp: number
}

type CacheKey = string

const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24시간

// 캐시 키 생성
const generateCacheKey = (type: 'commit' | 'pr', data: CommitData | PullRequestData): CacheKey => {
  if (type === 'commit') {
    const commitData = data as CommitData
    return `commit_${commitData.id}_${commitData.sha || ''}`
  } else {
    const prData = data as PullRequestData
    return `pr_${prData.id}_${prData.number || ''}`
  }
}

// 캐시에서 조회
const getFromCache = (key: CacheKey): string | null => {
  try {
    const cached = localStorage.getItem(`summary_cache_${key}`)
    if (!cached) return null

    const entry: CacheEntry = JSON.parse(cached)
    const now = Date.now()

    // 캐시 유효 기간 확인
    if (now - entry.timestamp > CACHE_DURATION) {
      localStorage.removeItem(`summary_cache_${key}`)
      return null
    }

    return entry.summary
  } catch (error) {
    return null
  }
}

// 캐시에 저장
const saveToCache = (key: CacheKey, summary: string): void => {
  try {
    const entry: CacheEntry = {
      summary,
      timestamp: Date.now()
    }
    localStorage.setItem(`summary_cache_${key}`, JSON.stringify(entry))
  } catch (error) {
    // 캐시 저장 실패 시 무시
  }
}

// 캐시 초기화
const clearCache = (key?: CacheKey): void => {
  try {
    if (key) {
      localStorage.removeItem(`summary_cache_${key}`)
    } else {
      // 모든 summary 캐시 삭제
      const keys = Object.keys(localStorage)
      keys.forEach(k => {
        if (k.startsWith('summary_cache_')) {
          localStorage.removeItem(k)
        }
      })
    }
  } catch (error) {
    // 캐시 초기화 실패 시 무시
  }
}

export const summaryCache = {
  generateCacheKey,
  getFromCache,
  saveToCache,
  clearCache
}
