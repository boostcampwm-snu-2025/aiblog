import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import { readPulls } from "~/api/github";
import { Alert, AlertDescription } from "~/components/ui/alert";

import PullRequests from "./-pull-requests";

export const Route = createFileRoute("/repos/$owner/$repo/pull-requests/")({
  component: PullRequestsPage,
  loader: ({ context: { queryClient }, params: { owner, repo } }) => {
    queryClient.prefetchQuery(readPulls(owner, repo)).catch(console.error);
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
              <Alert>
                <Loader2 className="animate-spin" />
                <AlertDescription>Loading pull requests...</AlertDescription>
              </Alert>
            }
          >
            <PullRequests owner={owner} repo={repo} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
