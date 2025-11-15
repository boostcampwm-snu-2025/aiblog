import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { AlertCircle, GitPullRequest } from "lucide-react";

import { readPullCommits } from "~/api/github";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export const Route = createFileRoute(
  "/repos/$owner/$repo/pull-requests/$pullNumber/",
)({
  component: PullRequestDetail,
});

function PullRequestDetail() {
  const { owner, pullNumber, repo } = Route.useParams();
  const prNumber = Number(pullNumber);

  const { data: commits, status: commitsStatus } = useQuery({
    queryFn: () => readPullCommits(owner, repo, prNumber),
    queryKey: ["pull-commits", owner, repo, prNumber],
  });

  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            className="text-blue-600 hover:underline"
            params={{ owner, repo }}
            to="/repos/$owner/$repo/pull-requests"
          >
            ← Back to Pull Requests
          </Link>
        </div>

        <h1 className="mb-6 text-3xl font-bold">
          {owner}/{repo} - PR #{prNumber}
        </h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitPullRequest className="h-5 w-5" />
              Commits in PR #{prNumber}
            </CardTitle>
            <CardDescription>Click on a commit to view details</CardDescription>
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
                {commits && commits.length > 0 ? (
                  commits.map((commit) => (
                    <Link
                      className="block border-l-2 border-green-500 py-2 pl-4 transition-colors hover:bg-gray-50"
                      key={commit.sha}
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
                        {dayjs(commit.commit.author?.date).fromNow()}
                      </div>
                      <div className="mt-1 font-mono text-xs text-gray-500">
                        {commit.sha.substring(0, 7)}
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No commits found in this pull request.
                  </p>
                )}
              </div>
            )}

            {commitsStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertDescription>Failed to load commits</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
