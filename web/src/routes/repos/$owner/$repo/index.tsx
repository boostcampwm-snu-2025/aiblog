import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, Loader2 } from "lucide-react";

import { readBranches, readPulls, readRepository } from "~/api/github";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

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

  const { data: repository, status: repositoryStatus } = useQuery(
    readRepository(owner, repo),
  );
  const { data: branches, status: branchesStatus } = useQuery(
    readBranches(owner, repo),
  );
  const { data: pulls, status: pullsStatus } = useQuery(readPulls(owner, repo));

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

        {repositoryStatus === "pending" && (
          <Alert>
            <Loader2 className="animate-spin" />
            <AlertDescription>Loading repository...</AlertDescription>
          </Alert>
        )}

        {repositoryStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>
              Failed to load repository. Please check the repository name.
            </AlertDescription>
          </Alert>
        )}

        {repositoryStatus === "success" &&
          branchesStatus === "success" &&
          pullsStatus === "success" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Branches</CardTitle>
                    <CardDescription>View commits by branch</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      className="text-blue-600 hover:underline"
                      params={{
                        branch: repository.default_branch,
                        owner,
                        repo,
                      }}
                      to="/repos/$owner/$repo/branches/$branch"
                    >
                      View Branches ({branches.length})
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pull Requests</CardTitle>
                    <CardDescription>
                      View commits by pull request
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      className="text-blue-600 hover:underline"
                      params={{ owner, repo }}
                      to="/repos/$owner/$repo/pull-requests"
                    >
                      View Pull Requests ({pulls.length})
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
