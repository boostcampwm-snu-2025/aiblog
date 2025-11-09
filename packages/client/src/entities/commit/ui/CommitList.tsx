import type { CommitInfo } from "../../../shared/api/types";
import { CommitCard } from "./CommitCard";

interface CommitListProps {
  commits: CommitInfo[];
  onGenerateSummary: (sha: string) => void;
}

export function CommitList({ commits, onGenerateSummary }: CommitListProps) {
  return (
    <div className="space-y-4 py-4">
      {commits.map((commit) => (
        <CommitCard
          key={commit.sha}
          commit={commit}
          onGenerateSummary={onGenerateSummary}
        />
      ))}
    </div>
  );
}
