import type { Endpoints } from "@octokit/types";

import dayjs from "dayjs";

interface Props {
  pr: Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"]["data"][number];
}

function PrCard({ pr }: Props) {
  return (
    <div className="border-l-2 border-green-500 py-2 pl-4">
      <div className="mb-1 text-sm font-medium">
        #{pr.number} {pr.title}
      </div>
      <div className="text-xs text-gray-600">
        <span className="font-semibold">{pr.user?.login || "Unknown"}</span>
        {" · "}
        {dayjs(pr.created_at).fromNow()}
      </div>
      <div className="mt-2 flex gap-2">
        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
          {pr.state}
        </span>
        {pr.draft && (
          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-800">
            draft
          </span>
        )}
      </div>
    </div>
  );
}

export default PrCard;
