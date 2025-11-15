import { Link } from "react-router";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PATHS } from "@/constants/path";
import type { PRStatus, PullRequest } from "@/types/pullrequest";
import { formatDate } from "@/utils/format";

type SearchResultItemProps = {
  owner: string;
  repository: string;
  pullRequest: PullRequest;
};

const CREATE_POST_HREF = PATHS.post.create.getHref();

export default function SearchResultItem({ owner, repository, pullRequest }: SearchResultItemProps) {
  return (
    <li className="flex justify-between rounded-lg border border-gray-200 p-6">
      <div className="flex-1">
        <div className="mb-3 flex items-center gap-3">
          <PRStatusBadge status={pullRequest.prStatus} />
          <span className="text-sm font-medium text-gray-500">#{pullRequest.number}</span>
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
      <Button>
        <Link
          to={`${CREATE_POST_HREF}?owner=${owner}&repository=${repository}&pullRequestNumber=${pullRequest.number}`}
        >
          이 PR로 글쓰기
        </Link>
      </Button>
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
