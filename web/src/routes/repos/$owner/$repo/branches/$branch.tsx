import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GitCommit, Loader2 } from "lucide-react";
import { Suspense } from "react";

import { readBranchCommits, readBranches } from "~/api/github";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

import BranchCommits from "./-branch-commits";
import BranchSelector from "./-branch-selector";

export const Route = createFileRoute("/repos/$owner/$repo/branches/$branch")({
  component: BranchesPage,
  loader: ({ context: { queryClient }, params: { branch, owner, repo } }) => {
    void Promise.all([
      queryClient.prefetchQuery(readBranches(owner, repo)),
      queryClient.prefetchQuery(readBranchCommits(owner, repo, branch)),
    ]);
  },
});

function BranchesPage() {
  const { branch, owner, repo } = Route.useParams();
  const navigate = useNavigate();

  const handleBranchChange = (branch: string) => {
    void navigate({
      params: { branch, owner, repo },
      to: "/repos/$owner/$repo/branches/$branch",
    });
  };

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
          {owner}/{repo} - Branches
        </h1>

        <Suspense
          fallback={
            <Alert>
              <Loader2 className="animate-spin" />
              <AlertDescription>Loading branches...</AlertDescription>
            </Alert>
          }
        >
          <BranchSelector
            branch={branch}
            onBranchChange={handleBranchChange}
            owner={owner}
            repo={repo}
          />
        </Suspense>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCommit className="h-5 w-5" />
              Commits on {branch}
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
              <BranchCommits branch={branch} owner={owner} repo={repo} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
