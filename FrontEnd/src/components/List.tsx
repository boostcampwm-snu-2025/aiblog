import Commit from "./Commit"
import PR from "./PullRequest"

// 임시 데이터 타입 (추후 API 연결 시 수정)
export interface CommitData {
  id: string
  message: string
  author: string
  date: string
  sha?: string
  files?: string // Commit 파일 변경사항 (diff)
}

export interface PullRequestData {
  id: string | number
  title: string
  author: string
  date: string
  status?: 'open' | 'closed' | 'merged'
  number?: number
  description?: string
  comments?: string // PR 코멘트들
  readme?: string
  body?: string // PR 본문 설명
  files?: string // PR 파일 변경사항 (diff)
}

interface ListProps {
  type: 'commit' | 'pr'
  isAuthenticated: boolean
  selectedRepository: boolean
  repositoryName?: string
  commits?: CommitData[]
  pullRequests?: PullRequestData[]
  selectedType?: 'commit' | 'pr' | null
  selectedData?: CommitData | PullRequestData | null
  onItemSelect?: (data: CommitData | PullRequestData, type: 'commit' | 'pr') => void
  onGenerateSummary?: (data?: CommitData | PullRequestData, type?: 'commit' | 'pr') => void
}

export default function List({
  type,
  isAuthenticated,
  selectedRepository,
  commits = [],
  pullRequests = [],
  selectedType,
  selectedData,
  onItemSelect,
  onGenerateSummary
}: ListProps) {
  const data = type === 'commit' ? commits : pullRequests
  const isEmpty = data.length === 0
  const emptyMessage = type === 'commit' ? "Commit doesn't exist." : "Pull Request doesn't exist."

  // 조건부 렌더링: 메시지 결정
  const getMainContent = () => {
    // 1. 로그인하지 않음
    if (!isAuthenticated) {
      return <div className="text-contents flex items-center justify-center text-primary-line">로그인 후 확인 가능합니다</div>
    }

    // 2. 로그인했지만 레포지토리 미선택
    if (!selectedRepository) {
      return <div className="text-contents flex items-center justify-center text-primary-line">Repository를 선택하세요</div>
    }

    // 3. 레포지토리 선택됨 - 데이터 표시
    if (isEmpty) {
      return <div className="text-contents flex items-center justify-center text-primary-line">{emptyMessage}</div>
    }

    // 4. 데이터 표시
    return (
      <div className="w-full flex flex-col gap-[15px]">
        {type === 'commit'
          ? (commits as CommitData[]).map((commit) => (
              <Commit
                key={commit.id}
                data={commit}
                isSelected={selectedType === 'commit' && selectedData?.id === commit.id}
                onSelect={() => onItemSelect?.(commit, 'commit')}
                onGenerateSummary={() => {
                  onItemSelect?.(commit, 'commit')
                  // selectedData가 업데이트될 때까지 기다린 후 호출하기 위해 데이터 파라미터 없이 호출
                  setTimeout(() => {
                    onGenerateSummary?.()
                  }, 100)
                }}
              />
            ))
          : (pullRequests as PullRequestData[]).map((pr) => (
              <PR
                key={pr.id}
                data={pr}
                isSelected={selectedType === 'pr' && selectedData?.id === pr.id}
                onSelect={() => onItemSelect?.(pr, 'pr')}
                onGenerateSummary={() => {
                  onItemSelect?.(pr, 'pr')
                  // selectedData가 업데이트될 때까지 기다린 후 호출하기 위해 데이터 파라미터 없이 호출
                  setTimeout(() => {
                    onGenerateSummary?.()
                  }, 100)
                }}
              />
            ))}
      </div>
    )
  }

  return (
    <div className="w-[600px] h-[540px] ml-[25px] flex flex-col border-t-thick border-b-thick border-primary-line">
      <header className="w-full h-[50px] flex items-center justify-start pl-[10px]">
        <div className="text-title font-bold">{type === 'commit' ? 'Recent Commits' : 'Recent Pull Requests'}</div>
      </header>
      <main className="w-full flex-1 flex flex-col overflow-y-auto">
        <div className="w-full h-full flex justify-center">
          {getMainContent()}
        </div>
      </main>
    </div>
  )
}