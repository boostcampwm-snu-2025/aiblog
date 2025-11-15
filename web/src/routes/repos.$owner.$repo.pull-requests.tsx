import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { AlertCircle, GitPullRequest, Loader2 } from "lucide-react";

import { readPullCommits, readPulls } from "~/api/github";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";

type PullRequestsSearch = {
  pullNumber?: number;
};

export const Route = createFileRoute("/repos/$owner/$repo/pull-requests")({
  component: PullRequestsPage,
  validateSearch: (search: Record<string, unknown>): PullRequestsSearch => {
    return {
      pullNumber: search.pullNumber ? Number(search.pullNumber) : undefined,
    };
  },
});

function PullRequestsPage() {
  const { owner, repo } = Route.useParams();
  const { pullNumber } = Route.useSearch();
  const navigate = useNavigate();

  // Fetch pull requests
  const { data: pulls, status: pullsStatus } = useQuery({
    queryFn: () => readPulls(owner, repo),
    queryKey: ["pulls", owner, repo],
  });

  // Fetch commits for selected PR
  const { data: commits, status: commitsStatus } = useQuery({
    enabled: pullNumber !== undefined,
    queryFn: () => readPullCommits(owner, repo, pullNumber!),
    queryKey: ["pull-commits", owner, repo, pullNumber],
  });

  const handlePullRequestChange = (selectedPullNumber: string) => {
    if (selectedPullNumber) {
      navigate({
        params: { owner, repo },
        search: { pullNumber: Number(selectedPullNumber) },
        to: "/repos/$owner/$repo/pull-requests",
      }).catch(console.error);
    } else {
      navigate({
        params: { owner, repo },
        search: {},
        to: "/repos/$owner/$repo/pull-requests",
      }).catch(console.error);
    }
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
          {owner}/{repo} - Pull Requests
        </h1>

        <div className="mb-6 space-y-2">
          <label className="text-sm font-medium">Select Pull Request</label>
          <Select
            name="pull-request"
            onValueChange={(value) => handlePullRequestChange(value)}
            value={pullNumber?.toString() ?? ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Select a pull request --" />
            </SelectTrigger>
            <SelectContent>
              {pullsStatus === "success" &&
                pulls?.map((pr) => (
                  <SelectItem key={pr.number} value={pr.number.toString()}>
                    #{pr.number} - {pr.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {pullsStatus === "pending" && (
          <Alert>
            <Loader2 className="animate-spin" />
            <AlertDescription>Loading pull requests...</AlertDescription>
          </Alert>
        )}

        {pullNumber !== undefined && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitPullRequest className="h-5 w-5" />
                Commits in PR #{pullNumber}
              </CardTitle>
              <CardDescription>
                Click on a commit to view details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {commitsStatus === "pending" && (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      className="border-l-2 border-green-200 py-2 pl-4"
                      key={i}
                    >
                      <Skeleton className="mb-2 h-4 w-3/4" />
                      <Skeleton className="mb-1 h-3 w-1/2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>
              )}
              {commitsStatus === "success" && (
                <div className="space-y-4">
                  {commits?.map((commit) => (
                    <Link
                      className="block border-l-2 border-green-500 py-2 pl-4 transition-colors hover:bg-gray-50"
                      key={commit.sha}
                      params={{ owner, ref: commit.sha, repo }}
                      to="/repos/$owner/$repo/commits/$ref"
                    >
                      <div className="mb-1 text-sm font-medium">
                        {commit.commit.message.split("\n")[0]}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">
                          {commit.commit.author?.name || "Unknown"}
                        </span>
                        {" · "}
                        {dayjs(commit.commit.author?.date).fromNow()}
                      </div>
                      <div className="mt-1 font-mono text-xs text-gray-500">
                        {commit.sha.substring(0, 7)}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {commitsStatus === "error" && (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertDescription>Failed to load commits</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
