import { useState, useEffect, useRef } from 'react'
import LoginButton from '@/components/LoginButton'
import SearchBar from '@/components/SearchBar'
import List from '@/components/List'
import type { CommitData, PullRequestData } from '@/components/List'
import { getRepositories, getCommits, getPullRequests, getCurrentUser } from '@/services/githubApi'

interface Repository {
  id: string
  name: string
  owner: string
  private?: boolean
}

export default function MainPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedRepository, setSelectedRepository] = useState(false)
  const [repositoryName, setRepositoryName] = useState<string>('')
  const [repositoryOwner, setRepositoryOwner] = useState<string>('')
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [commits, setCommits] = useState<CommitData[]>([])
  const [pullRequests, setPullRequests] = useState<PullRequestData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<{ login: string } | null>(null)
  const resetSearchRef = useRef<(() => void) | null>(null)

  // GitHub OAuth 콜백 처리
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')
    const githubAccessToken = params.get('githubAccessToken')

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      if (githubAccessToken) {
        localStorage.setItem('githubToken', githubAccessToken)
      }
      setIsAuthenticated(true)
      window.history.replaceState({}, document.title, window.location.pathname)
    } else {
      const savedToken = localStorage.getItem('accessToken')
      const savedGithubToken = localStorage.getItem('githubToken')
      if (savedToken && savedGithubToken) {
        setIsAuthenticated(true)
      }
    }
  }, [])

  // 레포지토리 목록 조회
  useEffect(() => {
    if (isAuthenticated && repositories.length === 0) {
      fetchRepositories()
    }
  }, [isAuthenticated])


  // 레포지토리 선택 시 커밋과 PR 조회
  useEffect(() => {
    if (isAuthenticated && selectedRepository && repositoryName && repositoryOwner) {
      fetchCommitsAndPRs()
    }
  }, [selectedRepository, repositoryName, repositoryOwner, isAuthenticated])

  const fetchRepositories = async () => {
    try {
      setLoading(true)
      setError(null)
      const user = await getCurrentUser()
      if (user) {
        setCurrentUser(user)
      }
      const data = await getRepositories()
      setRepositories(data)
    } catch (err) {
      console.error('Failed to fetch repositories:', err)
      setError('저장소를 불러올 수 없습니다')
    } finally {
      setLoading(false)
    }
  }

  const fetchCommitsAndPRs = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!repositoryName || !repositoryOwner) {
        return
      }

      const commitsData = await getCommits(repositoryOwner, repositoryName)
      const prsData = await getPullRequests(repositoryOwner, repositoryName)

      setCommits(commitsData)
      setPullRequests(prsData)
    } catch (err) {
      console.error('Failed to fetch commits and PRs:', err)
      setError('데이터를 불러올 수 없습니다')
    } finally {
      setLoading(false)
    }
  }


  const handleAuthClick = () => {
    if (isAuthenticated) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('githubToken')
      setIsAuthenticated(false)
      setRepositories([])
      setCommits([])
      setPullRequests([])
      setSelectedRepository(false)
      setRepositoryName('')
      setRepositoryOwner('')
    } else {
      window.location.href = 'http://localhost:8000/api/auth/github'
    }
  }

  const handleSearch = (repository: Repository) => {
    setRepositoryName(repository.name)
    setRepositoryOwner(repository.owner)
    setSelectedRepository(true)
  }

  const handleReset = () => {
    setCommits([])
    setPullRequests([])
    setSelectedRepository(false)
    setRepositoryName('')
    setRepositoryOwner('')
    // 검색어도 초기화
    if (resetSearchRef.current) {
      resetSearchRef.current()
    }
  }

  return (
    <div className="flex w-full p-[45px] bg-primary-bg mx-auto min-h-screen">
      <div className="pb-[30px] w-full rounded-outer border-thick border-primary-line bg-primary-header" aria-label="main-page-body">
        <header className="w-full h-[100px] flex border-b border-primary-line" aria-label="header">
          <div className="w-full h-full flex gap-[8px] pl-[45px] cursor-pointer" onClick={handleReset}>
            <div className="w-[150px] font-bold text-header flex items-center">Smart Blog</div>
            <div className="font-regular text-caption flex mt-[35px]">with</div>
            <img src={'/assets/GitHub_Logo.png'} alt="logo" className="w-[56px] h-[23px] mt-[32px] -translate-x-[8px]" />
          </div>
          <div className="w-full h-full flex justify-end mr-[30px] items-center gap-[8px]">
            <LoginButton isAuthenticated={isAuthenticated} onClick={handleAuthClick} />
          </div>
        </header>

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
              <>
                <List
                  type="commit"
                  isAuthenticated={isAuthenticated}
                  selectedRepository={selectedRepository}
                  repositoryName={repositoryName}
                  commits={commits}
                />
                <List
                  type="pr"
                  isAuthenticated={isAuthenticated}
                  selectedRepository={selectedRepository}
                  repositoryName={repositoryName}
                  pullRequests={pullRequests}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
