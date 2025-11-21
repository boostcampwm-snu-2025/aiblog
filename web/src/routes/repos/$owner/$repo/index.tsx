import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import { readBranches, readPulls, readRepository } from "~/api/github";
import { Alert, AlertDescription } from "~/components/ui/alert";

import RepositoryContent from "./-repository-content";

export const Route = createFileRoute("/repos/$owner/$repo/")({
  component: RepositoryDetailPage,
  loader: ({ context: { queryClient }, params: { owner, repo } }) => {
    queryClient.prefetchQuery(readRepository(owner, repo)).catch(console.error);
    queryClient.prefetchQuery(readBranches(owner, repo)).catch(console.error);
    queryClient.prefetchQuery(readPulls(owner, repo)).catch(console.error);
  },
});

function RepositoryDetailPage() {
  const { owner, repo } = Route.useParams();

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link className="text-blue-600 hover:underline" to="/">
            ← Back to Search
          </Link>
        </div>

        <h1 className="mb-6 text-3xl font-bold">
          {owner}/{repo}
        </h1>

        <Suspense
          fallback={
            <Alert>
              <Loader2 className="animate-spin" />
              <AlertDescription>Loading repository...</AlertDescription>
            </Alert>
          }
        >
          <RepositoryContent owner={owner} repo={repo} />
        </Suspense>
      </div>
    </div>
  );
}
