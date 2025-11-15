import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { GitPullRequest } from "lucide-react";
import { useState } from "react";

import { readPullCommits, readPulls } from "~/api/github";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export const Route = createFileRoute("/$owner/$repo/pull-requests")({
  component: PullRequestsPage,
});

function PullRequestsPage() {
  const { owner, repo } = Route.useParams();
  const [selectedPullNumber, setSelectedPullNumber] = useState<null | number>(
    null,
  );

  // Fetch pull requests
  const { data: pulls, status: pullsStatus } = useQuery({
    queryFn: () => readPulls(owner, repo),
    queryKey: ["pulls", owner, repo],
  });

  // Fetch commits for selected PR
  const { data: commits, status: commitsStatus } = useQuery({
    enabled: selectedPullNumber !== null,
    queryFn: () => readPullCommits(owner, repo, selectedPullNumber!),
    queryKey: ["pull-commits", owner, repo, selectedPullNumber],
  });

  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link className="text-blue-600 hover:underline" to="/">
            ← Back to Search
          </Link>
        </div>

        <h1 className="mb-6 text-3xl font-bold">
          {owner}/{repo} - Pull Requests
        </h1>

        <div className="mb-6">
          <label
            className="mb-2 block text-sm font-medium"
            htmlFor="pull-request"
          >
            Select Pull Request
          </label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            id="pull-request"
            onChange={(e) =>
              setSelectedPullNumber(
                e.target.value ? Number(e.target.value) : null,
              )
            }
            value={selectedPullNumber ?? ""}
          >
            <option value="">-- Select a pull request --</option>
            {pullsStatus === "success" &&
              pulls?.map((pr) => (
                <option key={pr.number} value={pr.number}>
                  #{pr.number} - {pr.title}
                </option>
              ))}
          </select>
        </div>

        {pullsStatus === "pending" && (
          <div className="text-gray-600">Loading pull requests...</div>
        )}

        {selectedPullNumber !== null && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitPullRequest className="h-5 w-5" />
                Commits in PR #{selectedPullNumber}
              </CardTitle>
              <CardDescription>
                Click on a commit to view details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {commitsStatus === "pending" && (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      className="border-l-2 border-green-200 py-2 pl-4"
                      key={i}
                    >
                      <Skeleton className="mb-2 h-4 w-3/4" />
                      <Skeleton className="mb-1 h-3 w-1/2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>
              )}
              {commitsStatus === "success" && (
                <div className="space-y-4">
                  {commits?.map((commit) => (
                    <Link
                      className="block border-l-2 border-green-500 py-2 pl-4 transition-colors hover:bg-gray-50"
                      key={commit.sha}
                      params={{ owner, ref: commit.sha, repo }}
                      to="/$owner/$repo/commits/$ref"
                    >
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
                    </Link>
                  ))}
                </div>
              )}
              {commitsStatus === "error" && (
                <div className="text-sm text-red-600">
                  Failed to load commits
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
