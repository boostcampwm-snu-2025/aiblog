import Header from '@/components/Header'
import { useAuth } from '@/hooks/useAuth'
import { AUTH_GITHUB_URL } from '@/utils/constants'

interface PostPageProps {
  onNavigateToMain?: () => void
}

export default function PostPage({ onNavigateToMain }: PostPageProps) {
  const { isAuthenticated, logout } = useAuth()

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout()
    } else {
      window.location.href = AUTH_GITHUB_URL
    }
  }

  return (
    <div className="flex w-full p-[45px] bg-primary-bg mx-auto min-h-screen">
      <div className="pb-[30px] w-full rounded-outer border-thick border-primary-line bg-primary-header">
        <Header
          onLogoClick={onNavigateToMain || (() => {})}
          navigationButtonText="Main Page"
          navigationButtonOnClick={onNavigateToMain}
          isAuthenticated={isAuthenticated}
          onAuthClick={handleAuthClick}
        />
        <main className="w-full h-full p-[45px]">
          <h1 className="text-header font-bold mb-[20px]">Saved Posts</h1>
          {/* 여기에 저장된 포스트 목록을 표시할 내용을 추가하세요 */}
        </main>
      </div>
    </div>
  )
}

