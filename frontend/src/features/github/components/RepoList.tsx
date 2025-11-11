import type { Repo } from "../../../shared/api/github";

interface RepoListProps {
  repos: Repo[];
  onSelect: (owner: string, repo: string) => void;
}

export default function RepoList({ repos, onSelect }: RepoListProps) {
  if (!repos || repos.length === 0)
    return <p className="text-gray-400 text-center">저장소 없음</p>;

  return (
    <ul className="max-w-2xl mx-auto border rounded-md divide-y bg-white shadow-sm">
      {repos.map((r) => (
        <li
          key={r.id}
          onClick={() => onSelect(r.owner.login, r.name)}
          className="p-3 text-left cursor-pointer hover:bg-gray-100 transition"
        >
          <div className="font-semibold text-blue-600">{r.full_name}</div>
          <div className="text-sm text-gray-500">
            ⭐ {r.stargazers_count} —{" "}
            <a
              href={r.html_url}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              View on GitHub
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}