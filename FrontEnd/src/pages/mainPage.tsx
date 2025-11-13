import { useRef, useState } from 'react'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import List from '@/components/List'
import SelectedContents from '@/components/SelectedContents'
import { useAuth } from '@/hooks/useAuth'
import { useRepository } from '@/hooks/useRepository'
import { useFetchData } from '@/hooks/useFetchData'
import { CommitData, PullRequestData } from '@/components/List'
import { generateSummary } from '@/services/geminiService'
import { summaryCache } from '@/utils/summaryCache'
import { AUTH_GITHUB_URL } from '@/utils/constants'

interface MainPageProps {
  onNavigateToPosts?: () => void
}

export default function MainPage({ onNavigateToPosts }: MainPageProps) {
  const resetSearchRef = useRef<(() => void) | null>(null)

  // Selected item state
  const [selectedType, setSelectedType] = useState<'commit' | 'pr' | null>(null)
  const [selectedData, setSelectedData] = useState<CommitData | PullRequestData | null>(null)

  // Summary state
  const [summary, setSummary] = useState<string>('')
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false)
  const [summaryError, setSummaryError] = useState<string>('')

  // Auth hook
  const { isAuthenticated, logout } = useAuth()

  // Repository hook
  const {
    selectedRepository,
    repositoryName,
    repositoryOwner,
    repositories,
    commits,
    pullRequests,
    loading,
    setRepositories,
    setCommits,
    setPullRequests,
    setLoading,
    selectRepository,
    resetRepository,
    clearRepositories,
  } = useRepository()

  // Fetch data hook
  useFetchData({
    isAuthenticated,
    repositoriesLength: repositories.length,
    selectedRepository,
    repositoryName,
    repositoryOwner,
    setRepositories,
    setCommits,
    setPullRequests,
    setLoading,
  })

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout()
      clearRepositories()
    } else {
      window.location.href = AUTH_GITHUB_URL
    }
  }

  const handleSearch = (repository: any) => {
    selectRepository(repository)
  }

  const handleReset = () => {
    resetRepository()
    setSelectedType(null)
    setSelectedData(null)
    if (resetSearchRef.current) {
      resetSearchRef.current()
    }
  }

  const handleItemSelect = (data: CommitData | PullRequestData, type: 'commit' | 'pr') => {
    setSelectedType(type)
    setSelectedData(data)
    // 새 항목 선택 시 이전 요약 초기화
    setSummary('')
    setSummaryError('')
  }

  const handleGenerateSummary = async (data?: CommitData | PullRequestData, type?: 'commit' | 'pr') => {
    // 파라미터가 있으면 그것을 사용, 없으면 현재 선택 상태 사용
    const targetData = data || selectedData
    const targetType = type || selectedType

    if (!targetData || !targetType) return

    setSummaryLoading(true)
    setSummaryError('')

    try {
      // 캐시 키 생성
      const cacheKey = summaryCache.generateCacheKey(targetType, targetData)

      // 캐시에서 조회
      const cachedSummary = summaryCache.getFromCache(cacheKey)
      if (cachedSummary) {
        setSummary(cachedSummary)
        setSummaryLoading(false)
        return
      }

      // 캐시에 없으면 API 호출
      const result = await generateSummary({
        type: targetType,
        data: targetData
      })

      // 결과를 캐시에 저장
      summaryCache.saveToCache(cacheKey, result)
      setSummary(result)
      setSummaryLoading(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '요약 생성 중 오류가 발생했습니다'
      setSummaryError(errorMessage)
      setSummaryLoading(false)
    }
  }

  return (
    <div className="flex w-full p-[45px] bg-primary-bg mx-auto min-h-screen">
      <div className="pb-[30px] w-full rounded-outer border-thick border-primary-line bg-primary-header" aria-label="main-page-body">
        <Header
          onLogoClick={handleReset}
          navigationButtonText="Saved Posts"
          navigationButtonOnClick={onNavigateToPosts}
          isAuthenticated={isAuthenticated}
          onAuthClick={handleAuthClick}
        />

        <main className="w-full h-full" aria-label="main">
          <div className="w-full h-full flex flex-col gap-[5px]">
            <SearchBar
              isAuthenticated={isAuthenticated}
              repositories={repositories}
              onSearch={handleSearch}
              onReset={handleReset}
              resetSearchRef={resetSearchRef}
            />
            {loading && selectedRepository ? (
              <div className="w-full h-[200px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-[20px]">
                  <div className="animate-spin">
                    <div className="w-[40px] h-[40px] border-4 border-primary-line border-t-primary-login rounded-full"></div>
                  </div>
                  <span className="text-contents text-primary-line">로딩 중...</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex gap-[5px]">
                <div className="flex flex-col gap-[5px]">
                  <List
                    type="commit"
                    isAuthenticated={isAuthenticated}
                    selectedRepository={selectedRepository}
                    repositoryName={repositoryName}
                    commits={commits}
                    onItemSelect={handleItemSelect}
                    onGenerateSummary={handleGenerateSummary}
                  />
                  <List
                    type="pr"
                    isAuthenticated={isAuthenticated}
                    selectedRepository={selectedRepository}
                    repositoryName={repositoryName}
                    pullRequests={pullRequests}
                    onItemSelect={handleItemSelect}
                    onGenerateSummary={handleGenerateSummary}
                  />
                </div>
                <SelectedContents
                  type={selectedType}
                  data={selectedData}
                  summary={summary}
                  summaryLoading={summaryLoading}
                  summaryError={summaryError}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
