import { Modal } from "../../../shared/Modal";
import { Button } from "../../../shared";
import { MODAL_MAX_HEIGHT_VH } from "../../../shared/lib/constants";
import { PRSummaryContent } from "./PRSummaryContent";
import { BlogPostContent } from "./BlogPostContent";

type PRSummaryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  summary: string | null;
  blogPost: string | null;
  blogPostTitle?: string | null;
  isLoading: boolean;
  isLoadingBlogPost: boolean;
  isSavingBlogPost?: boolean;
  error?: string | null;
  blogPostError?: string | null;
  saveBlogPostError?: string | null;
  onGenerateBlogPost?: () => void;
  onSaveBlogPost?: () => void;
};

export function PRSummaryModal({
  isOpen,
  onClose,
  summary,
  blogPost,
  blogPostTitle,
  isLoading,
  isLoadingBlogPost,
  isSavingBlogPost = false,
  error,
  blogPostError,
  saveBlogPostError,
  onGenerateBlogPost,
  onSaveBlogPost,
}: PRSummaryModalProps) {
  const isShowingBlogPost = blogPost !== null || isLoadingBlogPost;
  const modalTitle = isShowingBlogPost ? "블로그 글" : "PR 요약";
  const canShowBlogPostButton =
    summary !== null && blogPost === null && !isLoadingBlogPost;
  const canShowSaveBlogPostButton = blogPost !== null && !!onSaveBlogPost;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div
        className="flex flex-col h-full"
        style={{ maxHeight: `${MODAL_MAX_HEIGHT_VH}vh` }}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{modalTitle}</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isShowingBlogPost ? (
            <BlogPostContent
              blogPost={blogPost}
              isLoading={isLoadingBlogPost}
              error={blogPostError ?? null}
              title={blogPostTitle ?? null}
            />
          ) : (
            <PRSummaryContent
              summary={summary}
              isLoading={isLoading}
              error={error ?? null}
            />
          )}
          {saveBlogPostError && (
            <div className="mt-3 text-sm text-red-600">{saveBlogPostError}</div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          {canShowBlogPostButton && onGenerateBlogPost && (
            <Button onClick={onGenerateBlogPost} disabled={isLoadingBlogPost}>
              블로그 글 생성하기
            </Button>
          )}
          {canShowSaveBlogPostButton && (
            <Button onClick={onSaveBlogPost} disabled={isSavingBlogPost}>
              {isSavingBlogPost ? "저장 중..." : "블로그 포스트로 저장하기"}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
