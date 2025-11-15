import type { Endpoints } from "@octokit/types";

import dayjs from "dayjs";

interface Props {
  commit: Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"][number];
}

function CommitCard({ commit }: Props) {
  return (
    <div className="border-l-2 border-blue-500 py-2 pl-4">
      <div className="mb-1 text-sm font-medium">
        {commit.commit.message.split("\n")[0]}
      </div>
      <div className="text-xs text-gray-600">
        <span className="font-semibold">
          {commit.commit.author?.name || "Unknown"}
        </span>
        {" · "}
        {dayjs(commit.commit.author?.date).fromNow()}
      </div>
      <div className="mt-1 font-mono text-xs text-gray-500">
        {commit.sha.substring(0, 7)}
      </div>
    </div>
  );
}

export default CommitCard;
