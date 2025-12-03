import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { useAuth } from '@/hooks/useAuth'
import { AUTH_GITHUB_URL } from '@/utils/constants'
import { getBlogPosts, deleteBlogPost } from '@/services/postService'

interface BlogPost {
  id: string
  type: 'commit' | 'pr'
  typeLabel: string
  message?: string
  title?: string
  author: string
  date: string
  summary: string
  createdAt: string
  status?: string
  number?: number
}

interface PostPageProps {
  onNavigateToMain?: () => void
}

export default function PostPage({ onNavigateToMain }: PostPageProps) {
  const { isAuthenticated, logout } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadPosts(currentPage)
  }, [currentPage])

  const loadPosts = async (page: number) => {
    try {
      setLoading(true)
      const response = await getBlogPosts(page)

      setPosts(response.posts)
      setTotalPages(response.totalPages || 1) // 안전장치: 기본값 1
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout()
    } else {
      window.location.href = AUTH_GITHUB_URL
    }
  }

  const handleDeletePost = async () => {
    if (!selectedPost) return

    setDeleting(true)
    try {
      await deleteBlogPost(selectedPost.id)
      setSelectedPost(null)
      setDeleteConfirm(false)
      // 현재 페이지 새로 로드
      loadPosts(currentPage)
    } catch (error) {
    } finally {
      setDeleting(false)
    }
  }

  const getTypeColor = (status?: string) => {
    switch (status) {
      case 'open':
        return 'text-green-600'
      case 'closed':
        return 'text-red-600'
      case 'merged':
        return 'text-purple-600'
      default:
        return 'text-primary-line'
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
        <main className="w-full h-full p-[15px]">
          {/* 포스트 카드 목록 */}
          <div className="flex flex-col gap-[5px]">
            <h2 className="text-title font-bold ml-[10px] mb-[10px]">Saved Posts</h2>

            {loading ? (
              <div className="w-full h-[200px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-[20px]">
                  <div className="animate-spin">
                    <div className="w-[40px] h-[40px] border-4 border-primary-line border-t-primary-login rounded-full"></div>
                  </div>
                  <span className="text-contents text-primary-line">로딩 중...</span>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="w-full h-[200px] flex items-center justify-center">
                <div className="text-contents text-primary-line">저장된 포스트가 없습니다.</div>
              </div>
            ) : (
              <>
                <div className="w-full flex flex-col gap-[5px]">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className={`w-full h-auto p-[15px] rounded-inner border-t-thin border-b-thin border-primary-line flex items-center justify-between gap-[8px] cursor-pointer transition-colors ${
                        selectedPost?.id === post.id ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className="flex justify-center items-start flex-col gap-[8px] pl-[10px] flex-1">
                        <div className="flex justify-between items-start gap-[10px]">
                          <div className="text-title font-bold text-primary-login">
                            {post.type === 'commit' ? post.message : `#${post.number} ${post.title}`}
                          </div>
                        </div>
                        <div className="flex justify-between items-center gap-[8px]">
                          <div className="text-contents text-primary-line">
                            {post.author} • {post.date}
                          </div>
                          {post.status && (
                            <div className={`text-contents font-semibold ${getTypeColor(post.status)}`}>
                              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                            </div>
                          )}
                          <div className="text-contents text-primary-line">
                            {post.typeLabel}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 페이지네이션 컨트롤 */}
                <div className="w-full flex items-center justify-center gap-[15px] mt-[20px]">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-[12px] py-[8px] rounded-inner border-thin border-primary-line bg-transparent text-primary-line text-contents font-semibold hover:bg-primary-line hover:text-primary-bg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← 이전
                  </button>
                  <div className="text-contents font-semibold text-primary-line">
                    {currentPage} / {totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-[12px] py-[8px] rounded-inner border-thin border-primary-line bg-transparent text-primary-line text-contents font-semibold hover:bg-primary-line hover:text-primary-bg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음 →
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 하단 모달 (선택된 포스트 상세 정보) */}
          {selectedPost && (
            <>
              {/* 배경 오버레이 */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setSelectedPost(null)}
              />
              {/* 하단 슬라이드 모달 */}
              <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary-header border-t-thick border-primary-line max-h-[90vh] overflow-y-auto transform transition-transform duration-300">
                <div className="p-[20px] flex flex-col gap-[15px]">
                  {/* 헤더 */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-title font-bold">Post Details</h3>
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="text-primary-line hover:text-primary-login transition-colors text-[24px]"
                    >
                      ×
                    </button>
                  </div>

                  {/* 포스트 정보 */}
                  <div className="flex flex-col gap-[15px]">
                    {/* Type */}
                    <div className="flex flex-col gap-[8px]">
                      <div className="text-contents text-primary-line font-semibold">Type</div>
                      <div className="text-title font-bold text-primary-login">{selectedPost.typeLabel}</div>
                    </div>

                    {/* 메시지 또는 제목 */}
                    {selectedPost.type === 'commit' ? (
                      <div className="flex flex-col gap-[8px]">
                        <div className="text-contents text-primary-line font-semibold">Message</div>
                        <div className="text-title font-bold text-primary-login">{selectedPost.message}</div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-[8px]">
                          <div className="text-contents text-primary-line font-semibold">Title</div>
                          <div className="text-title font-bold text-primary-login">{selectedPost.title}</div>
                        </div>
                        {selectedPost.number && (
                          <div className="flex flex-col gap-[8px]">
                            <div className="text-contents text-primary-line font-semibold">PR Number</div>
                            <div className="text-contents text-primary-login">#{selectedPost.number}</div>
                          </div>
                        )}
                        {selectedPost.status && (
                          <div className="flex flex-col gap-[8px]">
                            <div className="text-contents text-primary-line font-semibold">Status</div>
                            <div className="text-contents text-primary-login">
                              {selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Author, Date */}
                    <div className="flex gap-[20px]">
                      <div className="flex flex-col gap-[8px] flex-1">
                        <div className="text-contents text-primary-line font-semibold">Author</div>
                        <div className="text-contents text-primary-login">{selectedPost.author}</div>
                      </div>
                      <div className="flex flex-col gap-[8px] flex-1">
                        <div className="text-contents text-primary-line font-semibold">Date</div>
                        <div className="text-contents text-primary-login">{selectedPost.date}</div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col gap-[8px]">
                      <div className="text-contents text-primary-line font-semibold">Summary</div>
                      <div className="text-contents text-primary-login whitespace-pre-wrap break-words bg-primary-bg p-[10px] rounded">
                        {selectedPost.summary}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <div className="flex gap-[8px]">
                      {!deleteConfirm ? (
                        <button
                          onClick={() => setDeleteConfirm(true)}
                          className="flex-1 px-[12px] py-[8px] rounded-inner border-thin border-red-600 bg-transparent text-red-600 text-contents font-semibold hover:bg-red-50 transition-all"
                        >
                          Delete
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={handleDeletePost}
                            disabled={deleting}
                            className="flex-1 px-[12px] py-[8px] rounded-inner border-thin border-red-600 bg-red-600 text-white text-contents font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
                          >
                            {deleting ? '삭제 중...' : '확인'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(false)}
                            className="flex-1 px-[12px] py-[8px] rounded-inner border-thin border-primary-line bg-transparent text-primary-line text-contents font-semibold hover:bg-primary-line hover:text-primary-bg transition-all"
                          >
                            취소
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

