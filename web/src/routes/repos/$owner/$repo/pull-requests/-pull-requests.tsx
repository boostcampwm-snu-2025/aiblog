import { useSuspenseQuery } from "@tanstack/react-query";
import { GitPullRequest } from "lucide-react";

import { readPulls } from "~/api/github";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import PullRequest from "./-pull-request";

interface Props {
  owner: string;
  repo: string;
}

function PullRequests({ owner, repo }: Props) {
  const { data } = useSuspenseQuery(readPulls(owner, repo));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitPullRequest className="h-5 w-5" />
          Pull Requests ({data.length || 0})
        </CardTitle>
        <CardDescription>
          Select a pull request to view its commits
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-2">
            {data.map((pr) => (
              <PullRequest key={pr.number} owner={owner} pr={pr} repo={repo} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No pull requests found for this repository.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default PullRequests;
