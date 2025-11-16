import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import { readBranchCommits } from "~/api/github";
import Commit from "~/components/commit";
import { Alert, AlertDescription } from "~/components/ui/alert";

interface Props {
  branch: string;
  owner: string;
  repo: string;
}

function BranchCommits({ branch, owner, repo }: Props) {
  const { data, status } = useSuspenseQuery(
    readBranchCommits(owner, repo, branch),
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

export default BranchCommits;
