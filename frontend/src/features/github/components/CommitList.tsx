import type { Commit } from "../../../shared/api/github";

interface CommitListProps {
  commits: Commit[];
}

export default function CommitList({ commits }: CommitListProps) {
  if (!commits || commits.length === 0)
    return <p className="text-center text-gray-400">데이터 없음</p>;

  return (
    <ul className="max-w-2xl mx-auto">
      {commits.map((c) => (
        <li key={c.sha} className="border-b py-2">
          <div className="font-semibold">{c.commit.message}</div>
          <div className="text-sm text-gray-500">
            {c.commit.author.name} —{" "}
            {new Date(c.commit.author.date).toLocaleString()}
          </div>
          <a
            href={c.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 text-sm hover:underline"
          >
            View on GitHub
          </a>
        </li>
      ))}
    </ul>
  );
}
