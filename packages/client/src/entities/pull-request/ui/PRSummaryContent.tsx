import { MarkdownContent } from "@shared/index";

type PRSummaryContentProps = {
  summary: string | null;
};

export function PRSummaryContent({ summary }: PRSummaryContentProps) {
  if (!summary) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>요약을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return <MarkdownContent content={summary} />;
}
