import type { PullRequest } from "../../../shared/api/github";
import SummaryButton from "../../../shared/ui/SummaryButton";

interface PRListProps {
  prs: PullRequest[];
  onOpenDetail?: (number: number) => void; 
  onSummary: (title: string, summary: string) => void;
}

export default function PRList({ prs, onOpenDetail, onSummary }: PRListProps) {
  if (!prs || prs.length === 0)
    return <p className="text-center text-gray-400">데이터 없음</p>;

  return (
    <ul className="max-w-2xl mx-auto">
      {prs.map((pr) => (
        <li key={pr.number} className="border-b py-4 relative">
          <div className="text-center">
            <div className="font-semibold">{pr.title}</div>
            <div className="text-sm text-gray-500">
              #{pr.number} — {new Date(pr.created_at).toLocaleString()}
            </div>
            <div className="flex justify-center gap-3 mt-1">
              <a
                href={pr.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 text-sm hover:underline"
              >
                View on GitHub
              </a>
              {onOpenDetail && (
                <button
                  onClick={() => onOpenDetail(pr.number)}
                  className="text-sm px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                >
                  상세 보기
                </button>
              )}
            </div>
          </div>

          <div className="absolute right-0 top-2/3 -translate-y-1/2">
            <SummaryButton
              title={pr.title}
              content={pr.title + "\n\n" + (pr.body ?? "No body provided")}
              onSummary={onSummary}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}