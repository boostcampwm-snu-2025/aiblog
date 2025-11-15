import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { GitPullRequest, Loader2 } from "lucide-react";

import { readPulls } from "~/api/github";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const Route = createFileRoute("/repos/$owner/$repo/pull-requests/")({
  component: PullRequestsPage,
});

function PullRequestsPage() {
  const { owner, repo } = Route.useParams();

  const { data: pulls, status: pullsStatus } = useQuery({
    queryFn: () => readPulls(owner, repo),
    queryKey: ["pulls", owner, repo],
  });

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
          {pullsStatus === "pending" && (
            <Alert>
              <Loader2 className="animate-spin" />
              <AlertDescription>Loading pull requests...</AlertDescription>
            </Alert>
          )}

          {pullsStatus === "success" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitPullRequest className="h-5 w-5" />
                    Pull Requests ({pulls?.length || 0})
                  </CardTitle>
                  <CardDescription>
                    Select a pull request to view its commits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pulls && pulls.length > 0 ? (
                    <div className="space-y-2">
                      {pulls.map((pr) => (
                        <Link
                          className="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                          key={pr.number}
                          params={{
                            owner,
                            pullNumber: pr.number.toString(),
                            repo,
                          }}
                          to="/repos/$owner/$repo/pull-requests/$pullNumber"
                        >
                          <div className="mb-2 flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-1 font-medium">
                                #{pr.number} - {pr.title}
                              </div>
                              <div className="text-xs text-gray-600">
                                <span className="font-semibold">
                                  {pr.user?.login || "Unknown"}
                                </span>
                                {" · "}
                                {dayjs(pr.created_at).fromNow()}
                              </div>
                            </div>
                            <div
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                pr.state === "open"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {pr.state}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No pull requests found for this repository.
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
