import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { readBranches, readPulls } from "~/api/github";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const Route = createFileRoute("/repos/$owner/$repo")({
  component: RepositoryDetailPage,
});

function RepositoryDetailPage() {
  const { owner, repo } = Route.useParams();

  // Fetch branches
  const { data: branches, status: branchesStatus } = useQuery({
    queryFn: () => readBranches(owner, repo),
    queryKey: ["branches", owner, repo],
  });

  // Fetch pull requests
  const { data: pulls, status: pullsStatus } = useQuery({
    queryFn: () => readPulls(owner, repo),
    queryKey: ["pulls", owner, repo],
  });

  const isLoading = branchesStatus === "pending" || pullsStatus === "pending";
  const isError = branchesStatus === "error" || pullsStatus === "error";

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

        {isLoading && (
          <div className="text-center text-gray-600">Loading repository...</div>
        )}

        {isError && (
          <div className="text-center text-red-600">
            Failed to load repository. Please check the repository name.
          </div>
        )}

        {branchesStatus === "success" && pullsStatus === "success" && (
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
                    params={{ owner, repo }}
                    to="/repos/$owner/$repo/branches"
                  >
                    View Branches ({branches?.length || 0})
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
                    View Pull Requests ({pulls?.length || 0})
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
