import { useRef, useState, useEffect } from 'react'
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
import api from '@/services/api'

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
    // 새로운 레포지토리 선택 시 이전 선택 항목 초기화
    setSelectedType(null)
    setSelectedData(null)
    setSummary('')
  }

  const handleReset = () => {
    resetRepository()
    setSelectedType(null)
    setSelectedData(null)
    if (resetSearchRef.current) {
      resetSearchRef.current()
    }
  }

  const handleItemSelect = async (data: CommitData | PullRequestData, type: 'commit' | 'pr') => {
    setSelectedType(type)
    setSelectedData(data)

    // Commit인 경우 상세 정보(files) 로드
    if (type === 'commit') {
      const commitData = data as CommitData
      try {
        const requestUrl = `/github/commit/${repositoryOwner}/${repositoryName}/${commitData.sha}/details`
        console.log('=== Commit Details API 요청 ===')
        console.log('요청 URL:', requestUrl)
        console.log('Authorization 헤더:', localStorage.getItem('accessToken') ? '있음' : '없음')
        console.log('X-GitHub-Token 헤더:', localStorage.getItem('githubToken') ? '있음' : '없음')

        const response = await api.get(requestUrl)
        console.log('=== Commit Details 응답 수신 ===')
        console.log('응답 상태:', response.status)
        console.log('응답 데이터 keys:', Object.keys(response.data?.data || {}))
        if (response.data?.data) {
          const detailData = response.data.data
          console.log('- files 길이:', detailData.files ? detailData.files.length : 0)

          // 상세 정보를 데이터에 추가
          const updatedData = {
            ...data,
            files: detailData.files || '',
          }
          console.log('=== 업데이트된 selectedData (Commit) ===')
          console.log('keys:', Object.keys(updatedData))
          console.log('files:', updatedData.files ? `${updatedData.files.length}자` : '없음')

          setSelectedData(updatedData)
        }
      } catch (error) {
        console.error('=== Commit 상세 정보 로드 실패 ===')
        if (error instanceof Error) {
          console.error('에러 메시지:', error.message)
        }
        console.error('전체 에러:', error)
        // 오류가 나도 계속 진행
      }
    }

    // PR인 경우 상세 정보(comments, files, readme) 로드
    if (type === 'pr') {
      const prData = data as PullRequestData
      try {
        const requestUrl = `/github/pull/${repositoryOwner}/${repositoryName}/${prData.number}/details`
        console.log('=== PR Details API 요청 ===')
        console.log('요청 URL:', requestUrl)
        console.log('Authorization 헤더:', localStorage.getItem('accessToken') ? '있음' : '없음')
        console.log('X-GitHub-Token 헤더:', localStorage.getItem('githubToken') ? '있음' : '없음')

        const response = await api.get(requestUrl)
        console.log('=== PR Details 응답 수신 ===')
        console.log('응답 상태:', response.status)
        console.log('응답 데이터 keys:', Object.keys(response.data?.data || {}))
        if (response.data?.data) {
          const detailData = response.data.data
          console.log('- body 길이:', detailData.body ? detailData.body.length : 0)
          console.log('- files 길이:', detailData.files ? detailData.files.length : 0)
          console.log('- comments 길이:', detailData.comments ? detailData.comments.length : 0)
          console.log('- readme 길이:', detailData.readme ? detailData.readme.length : 0)

          // 상세 정보를 데이터에 추가
          const updatedData = {
            ...data,
            body: detailData.body || '',
            files: detailData.files || '',
            comments: detailData.comments || '',
            readme: detailData.readme || '',
          }
          console.log('=== 업데이트된 selectedData (PR) ===')
          console.log('keys:', Object.keys(updatedData))
          console.log('body:', updatedData.body ? `${updatedData.body.length}자` : '없음')
          console.log('files:', updatedData.files ? `${updatedData.files.length}자` : '없음')
          console.log('comments:', updatedData.comments ? `${updatedData.comments.length}자` : '없음')
          console.log('readme:', updatedData.readme ? `${updatedData.readme.length}자` : '없음')

          setSelectedData(updatedData)
        }
      } catch (error) {
        console.error('=== PR 상세 정보 로드 실패 ===')
        if (error instanceof Error) {
          console.error('에러 메시지:', error.message)
        }
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as any
          console.error('HTTP 상태:', axiosError.response?.status)
          console.error('응답 데이터:', axiosError.response?.data)
          console.error('응답 헤더:', axiosError.response?.headers)
        }
        console.error('전체 에러:', error)
        // 오류가 나도 계속 진행
      }
    }

    // 캐시된 요약이 있는지 확인
    const cacheKey = summaryCache.generateCacheKey(type, data)
    const cachedSummary = summaryCache.getFromCache(cacheKey)

    if (cachedSummary) {
      // 캐시된 요약이 있으면 자동으로 표시
      setSummary(cachedSummary)
    } else {
      // 캐시된 요약이 없으면 초기화
      setSummary('')
    }
    setSummaryError('')
  }

  const handleGenerateSummary = async (data?: CommitData | PullRequestData, type?: 'commit' | 'pr') => {
    // selectedData가 업데이트된 데이터이므로 항상 우선 사용
    const targetData = selectedData || data
    const targetType = selectedType || type

    if (!targetData || !targetType) return

    console.log('=== Generate Summary 버튼 클릭 ===')
    console.log('Type:', targetType)
    console.log('Data keys:', Object.keys(targetData))
    if (targetType === 'commit') {
      const commitData = targetData as CommitData
      console.log('Commit Data:')
      console.log('- Message:', commitData.message ? `${commitData.message.length}자` : '없음')
      console.log('- Files:', commitData.files ? `${commitData.files.length}자` : '없음')
    }
    if (targetType === 'pr') {
      const prData = targetData as PullRequestData
      console.log('PR Data:')
      console.log('- Title:', prData.title)
      console.log('- Body:', prData.body ? `${prData.body.length}자` : '없음')
      console.log('- Files:', prData.files ? `${prData.files.length}자` : '없음')
      console.log('- Comments:', prData.comments ? `${prData.comments.length}자` : '없음')
      console.log('- README:', prData.readme ? `${prData.readme.length}자` : '없음')
    }

    setSummaryLoading(true)
    setSummaryError('')

    try {
      // 캐시 키 생성
      const cacheKey = summaryCache.generateCacheKey(targetType, targetData)

      // Generate Summary 버튼 클릭 시 항상 새로운 요약 생성
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
                    selectedType={selectedType}
                    selectedData={selectedData}
                    onItemSelect={handleItemSelect}
                    onGenerateSummary={handleGenerateSummary}
                  />
                  <List
                    type="pr"
                    isAuthenticated={isAuthenticated}
                    selectedRepository={selectedRepository}
                    repositoryName={repositoryName}
                    pullRequests={pullRequests}
                    selectedType={selectedType}
                    selectedData={selectedData}
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
