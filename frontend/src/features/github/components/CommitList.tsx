import type { Commit } from "../../../shared/api/github";
import SummaryButton from "../../../shared/ui/SummaryButton";

interface CommitListProps {
  commits: Commit[];
  onSummary: (title: string, summary: string) => void;
}

export default function CommitList({ commits, onSummary }: CommitListProps) {
  if (!commits || commits.length === 0)
    return <p className="text-center text-gray-400">데이터 없음</p>;

  return (
    <ul className="max-w-2xl mx-auto">
      {commits.map((c) => (
        <li key={c.sha} className="border-b py-4 relative">
          <div className="text-center">
            <div className="font-semibold">{c.commit.message}</div>
            <div className="text-sm text-gray-500">
              {c.commit.author.name} {" - "}
              {new Date(c.commit.author.date).toLocaleString()}
            </div>
            <a
              href={c.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 text-sm hover:underline block mt-1"
            >
              View on GitHub
            </a>
          </div>

          <div className="absolute right-0 top-2/3 -translate-y-1/2">
            <SummaryButton
              title={c.commit.message}
              content={
                c.commit.message + "\n\n" + (c.commit.author.name ?? "")
              }
              onSummary={onSummary}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
