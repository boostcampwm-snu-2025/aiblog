import type { Endpoints } from "@octokit/types";

import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";

interface Props {
  owner: string;
  pr: Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"]["data"][number];
  repo: string;
}

function PullRequest({ owner, pr, repo }: Props) {
  return (
    <Link
      className="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
      params={{
        owner,
        prNumber: pr.number.toString(),
        repo,
      }}
      to="/repos/$owner/$repo/pull-requests/$prNumber"
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 font-medium">
            #{pr.number} - {pr.title}
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-semibold">{pr.user?.login || "Unknown"}</span>
            {" · "}
            {dayjs(pr.created_at).fromNow()}
          </div>
        </div>
        <div
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            pr.state === "open"
              ? "bg-green-100 text-green-800"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          {pr.state}
        </div>
      </div>
    </Link>
  );
}

export default PullRequest;
