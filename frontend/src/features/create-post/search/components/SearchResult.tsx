import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { PRStatus, PullRequest } from "@/types";
import { customConsole } from "@/utils/console";
import { formatDate } from "@/utils/format";

type SearchResultProps = {
  repositoryName: string;
  pullRequests: PullRequest[];
};

export default function SearchResult({ repositoryName, pullRequests }: SearchResultProps) {
  return (
    <section>
      <Badge bgColor="bg-gray-200">{repositoryName}</Badge>
      <ul className="mt-5 space-y-4">
        {pullRequests.map((pr) => (
          <SearchResultItem key={pr.id} pullRequest={pr} />
        ))}
      </ul>
    </section>
  );
}

type SearchResultItemProps = {
  pullRequest: PullRequest;
};

function SearchResultItem({ pullRequest }: SearchResultItemProps) {
  const handleButtonClick = () => {
    customConsole.log(`PR #${pullRequest.id}로 글쓰기 버튼 클릭됨`);
  };

  return (
    <li className="flex justify-between rounded-lg border border-gray-200 p-6">
      <div className="flex-1">
        <div className="mb-3 flex items-center gap-3">
          <PRStatusBadge status={pullRequest.state} />
          <span className="text-sm font-medium text-gray-500">#{pullRequest.id}</span>
        </div>
        <h3 className="mb-3 text-lg font-semibold text-gray-900">{pullRequest.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>{pullRequest.user.login}</span>
          </div>
          <span className="text-gray-400">•</span>
          <div className="flex items-center gap-2">
            <span>{formatDate(pullRequest.createdAt)}</span>
          </div>
        </div>
      </div>
      <Button text="이 PR로 글쓰기" onClick={handleButtonClick} />
    </li>
  );
}

const BADGE_COLORS: Record<PRStatus, { bg: string; text: string }> = {
  open: { bg: "bg-green-100", text: "text-green-800" },
  closed: { bg: "bg-red-100", text: "text-red-800" },
  merged: { bg: "bg-purple-100", text: "text-purple-800" },
  draft: { bg: "bg-gray-100", text: "text-gray-800" },
};

type PRStatusBadgeProps = {
  status: PRStatus;
};

function PRStatusBadge({ status }: PRStatusBadgeProps) {
  return (
    <Badge bgColor={BADGE_COLORS[status].bg}>
      <span className={`flex items-center justify-center font-semibold ${BADGE_COLORS[status].text}`}>{status}</span>
    </Badge>
  );
}
