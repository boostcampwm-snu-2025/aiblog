import { useSuspenseQuery } from "@tanstack/react-query";

import { readPullCommits } from "~/api/github";
import Commit from "~/components/commit";

interface Props {
  owner: string;
  prNumber: number;
  repo: string;
}

function PrCommits({ owner, prNumber, repo }: Props) {
  const { data } = useSuspenseQuery(readPullCommits(owner, repo, prNumber));

  return (
    <div className="space-y-4">
      {data.map((commit) => (
        <Commit commit={commit} key={commit.sha} owner={owner} repo={repo} />
      ))}
    </div>
  );
}

export default PrCommits;
