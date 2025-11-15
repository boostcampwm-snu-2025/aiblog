import { LoadingSpinner, MarkdownContent } from "../../../shared";

type BlogPostContentProps = {
  blogPost: string | null;
  isLoading: boolean;
  error: string | null;
};

export function BlogPostContent({
  blogPost,
  isLoading,
  error,
}: BlogPostContentProps) {
  if (isLoading) {
    return <LoadingSpinner message="블로그 글을 생성하는 중..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-2">블로그 글 생성에 실패했습니다.</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  if (blogPost) {
    return <MarkdownContent content={blogPost} />;
  }

  return null;
}
