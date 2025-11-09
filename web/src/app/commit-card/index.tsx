import type { Endpoints } from "@octokit/types";

import dayjs from "dayjs";

interface Props {
  commit: Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"][number];
}

function CommitCard({ commit }: Props) {
  return (
    <div className="border-l-2 border-blue-500 pl-4 py-2">
      <div className="font-medium text-sm mb-1">
        {commit.commit.message.split("\n")[0]}
      </div>
      <div className="text-xs text-gray-600">
        <span className="font-semibold">
          {commit.commit.author?.name || "Unknown"}
        </span>
        {" · "}
        {dayjs(commit.commit.author?.date).fromNow()}
      </div>
      <div className="text-xs text-gray-500 font-mono mt-1">
        {commit.sha.substring(0, 7)}
      </div>
    </div>
  );
}

export default CommitCard;
