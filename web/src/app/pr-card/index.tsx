import type { Endpoints } from "@octokit/types";

import dayjs from "dayjs";

interface Props {
  pr: Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"]["data"][number];
}

function PrCard({ pr }: Props) {
  return (
    <div className="border-l-2 border-green-500 pl-4 py-2">
      <div className="font-medium text-sm mb-1">
        #{pr.number} {pr.title}
      </div>
      <div className="text-xs text-gray-600">
        <span className="font-semibold">{pr.user?.login || "Unknown"}</span>
        {" · "}
        {dayjs(pr.created_at).fromNow()}
      </div>
      <div className="flex gap-2 mt-2">
        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
          {pr.state}
        </span>
        {pr.draft && (
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
            draft
          </span>
        )}
      </div>
    </div>
  );
}

export default PrCard;
