import type { PullRequest } from "../../../shared/api/github";

interface PRListProps {
  prs: PullRequest[];
}

export default function PRList({ prs }: PRListProps) {
  if (!prs || prs.length === 0)
    return <p className="text-center text-gray-400">데이터 없음</p>;

  return (
    <ul className="max-w-2xl mx-auto">
      {prs.map((pr) => (
        <li key={pr.number} className="border-b py-2">
          <div className="font-semibold">{pr.title}</div>
          <div className="text-sm text-gray-500">
            #{pr.number} — {new Date(pr.createdAt).toLocaleString()}
          </div>
          <a
            href={pr.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 text-sm hover:underline"
          >
            View PR on GitHub
          </a>
        </li>
      ))}
    </ul>
  );
}
