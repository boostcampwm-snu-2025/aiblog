import { LoadingSpinner, MarkdownContent } from "@shared";

type PRSummaryContentProps = {
  summary: string | null;
  isLoading: boolean;
  error: string | null;
};

export function PRSummaryContent({
  summary,
  isLoading,
  error,
}: PRSummaryContentProps) {
  if (isLoading) {
    return <LoadingSpinner message="요약을 생성하는 중..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-2">요약 생성에 실패했습니다.</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  if (summary) {
    return <MarkdownContent content={summary} />;
  }

  return (
    <div className="text-center py-12 text-gray-500">
      <p>요약을 불러올 수 없습니다.</p>
    </div>
  );
}
