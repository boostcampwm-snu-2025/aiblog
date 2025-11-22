import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";

import { readCommitSummaries } from "~/api/summaries";
import { Skeleton } from "~/components/ui/skeleton";

import SummariesList from "./-summaries-list";

export const Route = createFileRoute("/summaries/")({
  component: SummariesPage,
  loader: ({ context: { queryClient } }) => {
    void queryClient.prefetchQuery(readCommitSummaries());
  },
});

function SummariesPage() {
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
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <div className="mt-6 space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          }
        >
          <SummariesList />
        </Suspense>
      </div>
    </div>
  );
}
