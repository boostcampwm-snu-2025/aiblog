import { Suspense } from "react";
import { Modal } from "@shared/Modal";
import { Button, LoadingSpinner, ErrorBoundary } from "@shared/index";
import { MODAL_MAX_HEIGHT_VH } from "@shared/lib/constants";
import { PRSummaryContent, BlogPostContent } from "@entities/pull-request/ui";
import {
  usePRSummary,
  useBlogPostGeneration,
  useBlogPostSave,
} from "@features/pr-summary";

type PRSummaryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  repoUrl: string | null;
  prNumber: number | null;
};

export function PRSummaryModal({
  isOpen,
  onClose,
  repoUrl,
  prNumber,
}: PRSummaryModalProps) {
  const prSummary = usePRSummary();
  const blogPostGeneration = useBlogPostGeneration();
  const blogPostSave = useBlogPostSave();

  const handleGenerateSummary = async () => {
    if (!repoUrl || !prNumber) return;
    await prSummary.generateSummary({ url: repoUrl, pullNumber: prNumber });
  };

  const handleGenerateBlogPost = async () => {
    if (!repoUrl || !prNumber || !prSummary.summary) return;
    await blogPostGeneration.generateBlogPost({
      url: repoUrl,
      pullNumber: prNumber,
      summary: prSummary.summary,
    });
  };

  const handleSaveBlogPost = async () => {
    if (!repoUrl || !prNumber || !blogPostGeneration.blogPost) return;
    await blogPostSave.saveBlogPost({
      url: repoUrl,
      pullNumber: prNumber,
      blogPost: blogPostGeneration.blogPost,
      summary: prSummary.summary ?? undefined,
      title: blogPostGeneration.blogPostTitle ?? undefined,
    });
  };

  const handleClose = () => {
    onClose();
    blogPostGeneration.reset();
    blogPostSave.reset();
  };

  if (isOpen && repoUrl && prNumber && !prSummary.summary && !prSummary.isLoading) {
    handleGenerateSummary();
  }

  const { summary } = prSummary;
  const { blogPost, blogPostTitle, isLoading: isGeneratingBlogPost } = blogPostGeneration;
  const { isSaving: isSavingBlogPost, savedId } = blogPostSave;

  const isShowingBlogPost = blogPost !== null;
  const modalTitle = isShowingBlogPost ? "블로그 글" : "PR 요약";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-4xl">
      <div
        className="flex flex-col h-full"
        style={{ maxHeight: `${MODAL_MAX_HEIGHT_VH}vh` }}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{modalTitle}</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <ErrorBoundary
            fallback={
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">오류가 발생했습니다.</p>
              </div>
            }
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner message="데이터를 불러오는 중..." />
                </div>
              }
            >
              {isShowingBlogPost ? (
                <BlogPostContent
                  blogPost={blogPost}
                  title={blogPostTitle ?? null}
                />
              ) : (
                <PRSummaryContent summary={summary} />
              )}
            </Suspense>
          </ErrorBoundary>
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
      </div>
    </Modal>
  );
}

