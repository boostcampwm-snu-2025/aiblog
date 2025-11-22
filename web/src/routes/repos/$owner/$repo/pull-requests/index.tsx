import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";

import { readPulls } from "~/api/github";
import { Skeleton } from "~/components/ui/skeleton";

import PullRequests from "./-pull-requests";

export const Route = createFileRoute("/repos/$owner/$repo/pull-requests/")({
  component: PullRequestsPage,
  loader: ({ context: { queryClient }, params: { owner, repo } }) => {
    void queryClient.prefetchQuery(readPulls(owner, repo));
  },
});

function PullRequestsPage() {
  const { owner, repo } = Route.useParams();

  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            className="text-blue-600 hover:underline"
            params={{ owner, repo }}
            to="/repos/$owner/$repo"
          >
            ← Back to Repository
          </Link>
        </div>

        <h1 className="mb-6 text-3xl font-bold">
          {owner}/{repo} - Pull Requests
        </h1>

        <div>
          <Suspense
            fallback={
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div className="rounded-lg border bg-card p-4" key={i}>
                    <Skeleton className="mb-2 h-5 w-3/4" />
                    <Skeleton className="mb-2 h-4 w-1/2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
            }
          >
            <PullRequests owner={owner} repo={repo} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
