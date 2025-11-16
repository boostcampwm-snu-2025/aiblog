import { useState } from 'react'
import { CommitData } from './List'
import { PullRequestData } from './List'
import { saveBlogPost } from '@/services/postService'

interface SelectedContentsProps {
  type: 'commit' | 'pr' | null
  data: CommitData | PullRequestData | null
  summary?: string
  summaryLoading?: boolean
  summaryError?: string
}

export default function SelectedContents({
  type,
  data,
  summary,
  summaryLoading = false,
  summaryError
}: SelectedContentsProps) {
  const [savingPost, setSavingPost] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string>('')

  const handleSaveBlogPost = async () => {
    if (!type || !data || !summary) {
      setSaveError('먼저 요약을 생성해주세요.')
      return
    }

    setSavingPost(true)
    setSaveError('')
    setSaveSuccess(false)

    try {
      const typeLabel = type === 'commit' ? 'Commit' : 'Pull Request'
      await saveBlogPost(type, typeLabel, data, summary)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000) // 3초 후 메시지 숨김
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '포스트 저장에 실패했습니다.'
      setSaveError(errorMessage)
    } finally {
      setSavingPost(false)
    }
  }
  const getTypeLabel = () => {
    switch (type) {
      case 'commit':
        return 'Commit'
      case 'pr':
        return 'Pull Request'
      default:
        return null
    }
  }

  const renderContent = () => {
    if (!type || !data) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-contents text-primary-line">항목을 선택해주세요</div>
        </div>
      )
    }

    // 디버깅용 로그
    if (type === 'pr') {
      console.log('PR 데이터:', data)
    }

    const typeLabel = getTypeLabel()

    return (
      <div className="w-full h-full flex flex-col gap-[15px] p-[15px]">
        {/* Type */}
        <div className="flex flex-col gap-[8px]">
          <div className="text-contents text-primary-line font-semibold">Type</div>
          <div className="text-title font-bold text-primary-login">{typeLabel}</div>
        </div>

        {/* Main Content */}
        {type === 'commit' && (
          <div className="flex flex-col gap-[8px]">
            <div className="text-contents text-primary-line font-semibold">Message</div>
            <div className="text-title font-bold text-primary-login">{(data as CommitData).message}</div>
          </div>
        )}

        {type === 'pr' && (
          <>
            <div className="flex flex-col gap-[8px]">
              <div className="text-contents text-primary-line font-semibold">Title</div>
              <div className="text-title font-bold text-primary-login">{(data as PullRequestData).title}</div>
            </div>
            {(data as PullRequestData).number && (
              <div className="flex flex-col gap-[8px]">
                <div className="text-contents text-primary-line font-semibold">PR Number</div>
                <div className="text-contents text-primary-login">#{(data as PullRequestData).number}</div>
              </div>
            )}
            {(data as PullRequestData).status && (
              <div className="flex flex-col gap-[8px]">
                <div className="text-contents text-primary-line font-semibold">Status</div>
                <div className="text-contents text-primary-login">{(data as PullRequestData).status}</div>
              </div>
            )}
          </>
        )}

        {/* Common Fields */}
        <div className="flex flex-col gap-[8px]">
          <div className="text-contents text-primary-line font-semibold">Author</div>
          <div className="text-contents text-primary-login">{data.author}</div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <div className="text-contents text-primary-line font-semibold">Date</div>
          <div className="text-contents text-primary-login">{data.date}</div>
        </div>

        {/* Save Button */}
        {summary && (
          <div className="flex gap-[8px]">
            <button
              onClick={handleSaveBlogPost}
              disabled={savingPost}
              className="flex-1 px-[12px] py-[8px] rounded-inner border-thin border-primary-line bg-primary-login text-primary-bg text-contents font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingPost ? '저장 중...' : 'Save as Blog Post'}
            </button>
          </div>
        )}

        {/* Save Status Messages */}
        {saveSuccess && (
          <div className="p-[8px] rounded bg-green-50 text-green-600 text-contents">
            ✓ 블로그 포스트로 저장되었습니다.
          </div>
        )}
        {saveError && (
          <div className="p-[8px] rounded bg-red-50 text-red-600 text-contents">
            ✗ {saveError}
          </div>
        )}

        {/* Summary Section */}
        <div className="border-t border-primary-line pt-[15px] mt-[15px]">
          <div className="flex items-center justify-between mb-[8px]">
            <div className="text-contents text-primary-line font-semibold">Summary</div>
          </div>

          {summaryLoading ? (
            <div className="flex items-center justify-center py-[20px]">
              <div className="flex flex-col items-center gap-[10px]">
                <div className="animate-spin">
                  <div className="w-[24px] h-[24px] border-2 border-primary-line border-t-primary-login rounded-full"></div>
                </div>
                <span className="text-contents text-primary-line text-sm">요약 생성 중...</span>
              </div>
            </div>
          ) : summaryError ? (
            <div className="text-contents text-red-600 bg-red-50 rounded p-[8px]">
              {summaryError}
            </div>
          ) : summary ? (
            <div className="text-contents text-primary-login whitespace-pre-wrap break-words">
              {summary}
            </div>
          ) : (
            <div className="text-contents text-primary-line italic">
              Generate Summary 버튼을 클릭해서 요약을 생성해보세요.
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-[600px] h-[1085px] ml-[25px] flex flex-col border-t-thick border-b-thick border-primary-line">
      <header className="w-full h-[50px] flex items-center justify-start pl-[10px]">
        <div className="text-title font-bold">Selected Contents</div>
      </header>
      <main className="w-full flex-1 flex flex-col overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  )
}
