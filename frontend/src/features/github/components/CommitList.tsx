import type { Commit } from "../../../shared/api/github";
import { getCommitDetail } from "../../../shared/api/github";
import SummaryButton from "../../../shared/ui/SummaryButton";

interface CommitListProps {
  commits: Commit[];
  owner: string;
  repo: string;
  onSummary: (title: string, summary: string) => void;
}

export default function CommitList({
  commits,
  owner,
  repo,
  onSummary,
}: CommitListProps) {
  if (!commits || commits.length === 0)
    return <p className="text-center text-gray-400">데이터 없음</p>;

  return (
    <ul className="max-w-2xl mx-auto">
      {commits.map((c) => (
        <li key={c.sha} className="border-b py-4 relative">
          <div className="text-center pr-32">
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

          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <SummaryButton
              title={c.commit.message}
              getContent={async () => {
                const detail = await getCommitDetail(owner, repo, c.sha);

                const content = `
[Commit Message]
${detail.message}

[Commit Body]
${detail.body ?? ""}

[Changed Files]
${detail.files
  .map((f) => `- ${f.filename} (${f.status})`)
  .join("\n")}

[Diff]
${detail.files
  .map(
    (f) => `File: ${f.filename}
${f.patch ?? ""}`
  )
  .join("\n\n")}
`.trim();

                return content;
              }}
              onSummary={onSummary}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}