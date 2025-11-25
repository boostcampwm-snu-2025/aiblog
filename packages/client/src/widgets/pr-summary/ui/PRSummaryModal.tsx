import { Suspense } from "react";
import { Modal } from "@shared/Modal";
import { Button, LoadingSpinner, ErrorBoundary } from "@shared/index";
import { MODAL_MAX_HEIGHT_VH } from "@shared/lib/constants";
import { PRSummaryContent, BlogPostContent } from "@entities/pull-request/ui";
import {
  usePRSummarySuspense,
  useBlogPostGeneration,
  useBlogPostSave,
} from "@features/pr-summary";

type PRSummaryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  repoUrl: string | null;
  prNumber: number | null;
};

function PRSummaryModalContent({
  repoUrl,
  prNumber,
  onClose,
}: {
  repoUrl: string | null;
  prNumber: number | null;
  onClose: () => void;
}) {
  const { summary } = usePRSummarySuspense({ repoUrl, prNumber });
  const blogPostGeneration = useBlogPostGeneration();
  const blogPostSave = useBlogPostSave();

  const handleGenerateBlogPost = async () => {
    if (!repoUrl || !prNumber || !summary) return;
    await blogPostGeneration.generateBlogPost({
      url: repoUrl,
      pullNumber: prNumber,
      summary,
    });
  };

  const handleSaveBlogPost = async () => {
    if (!repoUrl || !prNumber || !blogPostGeneration.blogPost) return;
    await blogPostSave.saveBlogPost({
      url: repoUrl,
      pullNumber: prNumber,
      blogPost: blogPostGeneration.blogPost,
      summary: summary ?? undefined,
      title: blogPostGeneration.blogPostTitle ?? undefined,
    });
  };

  const handleClose = () => {
    onClose();
    blogPostGeneration.reset();
    blogPostSave.reset();
  };

  const { blogPost, blogPostTitle, isLoading: isGeneratingBlogPost, error: blogPostError } = blogPostGeneration;
  const { isSaving: isSavingBlogPost, savedId, error: saveError } = blogPostSave;

  const isShowingBlogPost = blogPost !== null;
  const modalTitle = isShowingBlogPost ? "블로그 글" : "PR 요약";
  const currentError = blogPostError || saveError;

  return (
    <>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">{modalTitle}</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {currentError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">
              {currentError.message || "오류가 발생했습니다."}
            </p>
          </div>
        )}

        {isShowingBlogPost ? (
          <BlogPostContent
            blogPost={blogPost}
            title={blogPostTitle ?? null}
          />
        ) : (
          <PRSummaryContent summary={summary} />
        )}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
        <Button variant="outline" onClick={handleClose}>
          닫기
        </Button>

        {summary && !blogPost && (
          <Button
            onClick={handleGenerateBlogPost}
            loading={isGeneratingBlogPost}
            disabled={isGeneratingBlogPost}
          >
            블로그 글 생성하기
          </Button>
        )}

        {blogPost && (
          <Button
            onClick={handleSaveBlogPost}
            loading={isSavingBlogPost}
            disabled={!!savedId}
          >
            {savedId ? "저장 완료" : "블로그 포스트로 저장하기"}
          </Button>
        )}
      </div>
    </>
  );
}

export function PRSummaryModal({
  isOpen,
  onClose,
  repoUrl,
  prNumber,
}: PRSummaryModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div
        className="flex flex-col h-full"
        style={{ maxHeight: `${MODAL_MAX_HEIGHT_VH}vh` }}
      >
        <ErrorBoundary
          fallback={
            <div className="flex flex-col h-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">PR 요약</h2>
              </div>
              <div className="flex-1 flex items-center justify-center px-6 py-4">
                <div className="text-center">
                  <p className="text-red-600 mb-4">PR 요약을 불러오는 중 오류가 발생했습니다.</p>
                  <Button variant="outline" onClick={onClose}>
                    닫기
                  </Button>
                </div>
              </div>
            </div>
          }
        >
          <Suspense
            fallback={
              <>
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">PR 요약</h2>
                </div>
                <div className="flex-1 flex items-center justify-center px-6 py-4">
                  <LoadingSpinner message="PR 요약을 불러오는 중..." />
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                  <Button variant="outline" onClick={onClose}>
                    닫기
                  </Button>
                </div>
              </>
            }
          >
            <PRSummaryModalContent
              repoUrl={repoUrl}
              prNumber={prNumber}
              onClose={onClose}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </Modal>
  );
}

