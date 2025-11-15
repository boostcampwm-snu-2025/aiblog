import { Card, CardTitle } from "../../../shared";
import { Badge } from "../../../shared";
import { Button } from "../../../shared";
import type { PullRequestInfo } from "../../../shared/api/types";

type PullRequestCardProps = {
  pullRequest: PullRequestInfo;
  onGenerateSummary: (prNumber: number) => void;
};

export function PullRequestCard({
  pullRequest,
  onGenerateSummary,
}: PullRequestCardProps) {
  const getStateBadgeVariant = (state: "open" | "closed") => {
    return state === "open" ? "success" : "default";
  };

  const getMergedBadgeVariant = () => {
    return pullRequest.merged ? "info" : "default";
  };

  return (
    <Card variant="default" padding="md" className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <CardTitle className="flex-1">{pullRequest.title}</CardTitle>
        <div className="flex gap-2 shrink-0">
          <Badge variant={getStateBadgeVariant(pullRequest.state)}>
            {pullRequest.state}
          </Badge>
          {pullRequest.merged && (
            <Badge variant={getMergedBadgeVariant()}>merged</Badge>
          )}
          {pullRequest.draft && <Badge variant="default">draft</Badge>}
        </div>
      </div>

      {pullRequest.body && (
        <p className="text-sm text-gray-600 line-clamp-2">{pullRequest.body}</p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          {pullRequest.authorLogin && (
            <div className="flex items-center gap-2">
              {pullRequest.authorAvatar && (
                <img
                  src={pullRequest.authorAvatar}
                  alt={pullRequest.authorLogin}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span>{pullRequest.authorLogin}</span>
            </div>
          )}
          <span>#{pullRequest.number}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs">
            {new Date(pullRequest.createdAt).toLocaleDateString()}
          </span>
          <a
            href={pullRequest.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-xs"
          >
            View on GitHub
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t">
        <span>
          <span className="font-medium">Head:</span> {pullRequest.headRef} (
          {pullRequest.headSha.slice(0, 7)})
        </span>
        <span>
          <span className="font-medium">Base:</span> {pullRequest.baseRef} (
          {pullRequest.baseSha.slice(0, 7)})
        </span>
      </div>

      <div className="pt-2">
        <Button size="sm" onClick={() => onGenerateSummary(pullRequest.number)}>
          Generate Summary
        </Button>
      </div>
    </Card>
  );
}
