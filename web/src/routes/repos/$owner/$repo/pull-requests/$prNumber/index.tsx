import { createFileRoute, Link } from "@tanstack/react-router";
import { GitPullRequest } from "lucide-react";
import { Suspense } from "react";

import { readPullCommits } from "~/api/github";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

import PrCommits from "./-pr-commits";

export const Route = createFileRoute(
  "/repos/$owner/$repo/pull-requests/$prNumber/",
)({
  component: PullRequestDetail,
  loader: ({ context: { queryClient }, params: { owner, prNumber, repo } }) => {
    void queryClient.prefetchQuery(
      readPullCommits(owner, repo, Number(prNumber)),
    );
  },
});

function PullRequestDetail() {
  const { owner, prNumber, repo } = Route.useParams();

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
            <Suspense
              fallback={
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      className="border-l-2 border-blue-200 py-2 pl-4"
                      key={i}
                    >
                      <Skeleton className="mb-2 h-4 w-3/4" />
                      <Skeleton className="mb-1 h-3 w-1/2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>
              }
            >
              <PrCommits
                owner={owner}
                prNumber={Number(prNumber)}
                repo={repo}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
