import { useState, useRef, useEffect } from 'react'
import RepositoryModal from './RepositoryModal'

interface Repository {
  id: string
  name: string
  owner: string
  private?: boolean
}

interface SearchBarProps {
  isAuthenticated?: boolean
  repositories?: Repository[]
  onSearch?: (repository: Repository) => void
  onReset?: () => void
  resetSearchRef?: React.MutableRefObject<(() => void) | null>
}

export default function SearchBar({
  isAuthenticated = false,
  repositories = [],
  onSearch,
  onReset,
  resetSearchRef
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 검색어 초기화 함수를 ref로 노출
  useEffect(() => {
    if (resetSearchRef) {
      resetSearchRef.current = () => {
        setSearchQuery('')
      }
    }
  }, [resetSearchRef])

  const handleSearch = () => {
    // Find the repository that matches the current search query
    const selectedRepo = repositories.find(repo => repo.name === searchQuery)
    if (selectedRepo && onSearch) {
      onSearch(selectedRepo)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleInputClick = () => {
    if (isAuthenticated) {
      setIsModalOpen(true)
    }
  }

  const handleRepositorySelect = (repository: Repository) => {
    setSearchQuery(repository.name)
    if (onSearch) {
      onSearch(repository)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleLogoClick = () => {
    setSearchQuery('')
    if (onReset) {
      onReset()
    }
  }

  return (
    <>
      <div className="relative w-full">
        <div className="w-full h-[100px] flex items-center">
          <div className="w-[100px] h-[100px] ml-[5px] flex items-center justify-center cursor-pointer" onClick={handleLogoClick}>
            <img src={'/assets/github-mark.svg'} alt="search" className="w-[50px] h-[50px]" />
          </div>
          <div className="w-[525px] h-[100px] flex items-center justify-center relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Repository"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={handleInputClick}
              className="w-[600px] h-[60px] pl-[20px] pr-[66px] bg-primary-contents rounded-inner text-black text-title border-thin border-primary-line cursor-pointer"
            />
            <button onClick={handleSearch} className="absolute right-0 w-[66px] h-[60px] flex items-center justify-center">
              <img src={'/assets/search.svg'} alt="search" className="w-[24px] h-[24px]" />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleModalClose}
        />
      )}

      <RepositoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSelect={handleRepositorySelect}
        searchQuery={searchQuery}
        repositories={repositories}
        inputRef={inputRef}
      />
    </>
  );
}