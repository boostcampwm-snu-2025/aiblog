import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import { readCommitSummary } from "~/api/summaries";

import SummaryDetail from "./-summary-detail";

export const Route = createFileRoute("/summaries/$owner/$repo/$ref/")({
  component: SummaryPage,
  loader: ({ context: { queryClient }, params: { owner, ref, repo } }) => {
    void queryClient.prefetchQuery(readCommitSummary(owner, repo, ref));
  },
});

function SummaryPage() {
  const { owner, ref, repo } = Route.useParams();

  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link className="text-blue-600 hover:underline" to="/summaries">
            ← Back to Summaries
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <SummaryDetail owner={owner} ref={ref} repo={repo} />
        </Suspense>
      </div>
    </div>
  );
}
