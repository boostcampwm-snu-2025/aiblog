import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import { readPullCommits } from "~/api/github";
import Commit from "~/components/commit";
import { Alert, AlertDescription } from "~/components/ui/alert";

interface Props {
  owner: string;
  prNumber: number;
  repo: string;
}

function PrCommits({ owner, prNumber, repo }: Props) {
  const { data, status } = useSuspenseQuery(
    readPullCommits(owner, repo, prNumber),
  );

  return {
    error: (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertDescription>Failed to load commits</AlertDescription>
      </Alert>
    ),
    success: (
      <div className="space-y-4">
        {data.map((commit) => (
          <Commit commit={commit} key={commit.sha} owner={owner} repo={repo} />
        ))}
      </div>
    ),
  }[status];
}

export default PrCommits;
