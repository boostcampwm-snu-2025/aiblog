import type { Endpoints } from "@octokit/types";

import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";

interface Props {
  commit: Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"][number];
  owner: string;
  repo: string;
}

function Commit({ commit, owner, repo }: Props) {
  return (
    <Link
      className="block border-l-2 border-blue-500 py-2 pl-4 transition-colors hover:bg-gray-50"
      params={{ owner, ref: commit.sha, repo }}
      to="/repos/$owner/$repo/commits/$ref"
    >
      <div className="mb-1 text-sm font-medium">
        {commit.commit.message.split("\n")[0]}
      </div>
      <div className="text-xs text-gray-600">
        <span className="font-semibold">
          {commit.commit.author?.name || "Unknown"}
        </span>
        {" · "}
        {commit.commit.author
          ? dayjs(commit.commit.author.date).fromNow()
          : "Unknown Date"}
      </div>
      <div className="mt-1 font-mono text-xs text-gray-500">
        {commit.sha.substring(0, 7)}
      </div>
    </Link>
  );
}

export default Commit;
