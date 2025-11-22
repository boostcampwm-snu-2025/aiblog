import { useSuspenseQuery } from "@tanstack/react-query";

import { readBranchCommits } from "~/api/github";
import Commit from "~/components/commit";

interface Props {
  branch: string;
  owner: string;
  repo: string;
}

function BranchCommits({ branch, owner, repo }: Props) {
  const { data } = useSuspenseQuery(readBranchCommits(owner, repo, branch));

  return (
    <div className="space-y-4">
      {data.map((commit) => (
        <Commit commit={commit} key={commit.sha} owner={owner} repo={repo} />
      ))}
    </div>
  );
}

export default BranchCommits;
