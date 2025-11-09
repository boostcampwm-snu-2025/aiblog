import { useMemo, useEffect, useState } from 'react'

interface Repository {
  id: string
  name: string
  owner: string
  private?: boolean
}

interface RepositoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (repository: Repository) => void
  searchQuery: string
  repositories: Repository[]
  inputRef: React.RefObject<HTMLInputElement>
}

export default function RepositoryModal({
  isOpen,
  onClose,
  onSelect,
  searchQuery,
  repositories,
  inputRef
}: RepositoryModalProps) {
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0, width: 0 })

  // input 위치 계산
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setModalPosition({
        top: rect.bottom + 8, // input 아래 8px 간격
        left: rect.left,
        width: rect.width
      })
    }
  }, [isOpen, inputRef])

  // 검색어로 레포지토리 필터링
  const filteredRepositories = useMemo(() => {
    if (!searchQuery.trim()) {
      return repositories
    }
    const query = searchQuery.toLowerCase()
    return repositories.filter((repo) =>
      repo.name && repo.name.toLowerCase().includes(query)
    )
  }, [searchQuery, repositories])

  if (!isOpen) {
    return null
  }

  const handleRepositorySelect = (repository: Repository) => {
    onSelect(repository)
    onClose()
  }

  return (
    <div
      className="fixed z-50"
      style={{
        top: `${modalPosition.top}px`,
        left: `${modalPosition.left}px`,
        width: `${modalPosition.width}px`
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-inner border-thin border-primary-line w-full max-h-[300px] overflow-y-auto shadow-lg">
        {filteredRepositories.length === 0 ? (
          <div className="p-[20px] text-center text-primary-line">
            <div className="text-contents">No repositories found</div>
          </div>
        ) : (
          <ul className="divide-y divide-primary-line">
            {filteredRepositories.map((repo) => (
              <li
                key={repo.id}
                onClick={() => handleRepositorySelect(repo)}
                className="p-[15px] hover:bg-primary-contents cursor-pointer transition-colors flex items-center justify-between"
              >
                <span className="text-contents font-medium text-primary-login">
                  {repo.owner}/{repo.name}
                </span>
                <span className={`text-xs font-semibold ${repo.private ? 'text-red-600' : 'text-green-600'}`}>
                  {repo.private ? 'Private' : 'Public'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
