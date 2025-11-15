import type { PullRequestInfo } from "../../../shared/api/types";
import { PullRequestCard } from "./PullRequestCard";

interface PullRequestListProps {
  pullRequests: PullRequestInfo[];
  onGenerateSummary: (prNumber: number) => void;
}

export function PullRequestList({
  pullRequests,
  onGenerateSummary,
}: PullRequestListProps) {
  if (pullRequests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No pull requests found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      {pullRequests.map((pr) => (
        <PullRequestCard
          key={pr.id}
          pullRequest={pr}
          onGenerateSummary={onGenerateSummary}
        />
      ))}
    </div>
  );
}
