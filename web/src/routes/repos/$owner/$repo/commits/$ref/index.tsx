import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";

import { readCommit } from "~/api/github";
import { Skeleton } from "~/components/ui/skeleton";

import Commit from "./-commit";

export const Route = createFileRoute("/repos/$owner/$repo/commits/$ref/")({
  component: CommitDetailPage,
  loader: ({ context: { queryClient }, params: { owner, ref, repo } }) => {
    queryClient
      .prefetchQuery(readCommit(owner, repo, ref))
      .catch(console.error);
  },
});

function CommitDetailPage() {
  const { owner, ref, repo } = Route.useParams();

  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link className="text-blue-600 hover:underline" to="/">
            ← Back to Search
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full" />
            </div>
          }
        >
          <Commit owner={owner} ref={ref} repo={repo} />
        </Suspense>
      </div>
    </div>
  );
}
