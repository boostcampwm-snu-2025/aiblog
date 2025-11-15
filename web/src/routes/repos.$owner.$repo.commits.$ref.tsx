import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";

import { summarizeCommit } from "~/api/gemini";
import { readCommit } from "~/api/github";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export const Route = createFileRoute("/repos/$owner/$repo/commits/$ref")({
  component: CommitDetailPage,
});

function CommitDetailPage() {
  const { owner, ref, repo } = Route.useParams();
  const [summary, setSummary] = useState<string>("");

  // Fetch commit detail
  const { data: commit, status: commitStatus } = useQuery({
    queryFn: () => readCommit(owner, repo, ref),
    queryKey: ["commit", owner, repo, ref],
  });

  // Summarize commit mutation
  const summarizeMutation = useMutation({
    mutationFn: () => summarizeCommit(owner, repo, ref),
    onSuccess: (data) => {
      setSummary(data);
    },
  });

  const handleGenerateSummary = () => {
    summarizeMutation.mutate();
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link className="text-blue-600 hover:underline" to="/">
            ← Back to Search
          </Link>
        </div>

        {commitStatus === "pending" && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
        )}

        {commitStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>Failed to load commit details</AlertDescription>
          </Alert>
        )}

        {commitStatus === "success" && commit && (
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold">
                {commit.commit.message.split("\n")[0]}
              </h1>
              <div className="text-gray-600">
                <span className="font-semibold">
                  {commit.commit.author?.name || "Unknown"}
                </span>
                {" committed "}
                {dayjs(commit.commit.author?.date).format("MMM D, YYYY h:mm A")}
                {" · "}
                <span className="font-mono text-sm">
                  {commit.sha.substring(0, 7)}
                </span>
              </div>
            </div>

            {/* Commit Message */}
            <Card>
              <CardHeader>
                <CardTitle>Commit Message</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm whitespace-pre-wrap">
                  {commit.commit.message}
                </pre>
              </CardContent>
            </Card>

            {/* AI Summary */}
            <Card>
              <CardHeader>
                <CardTitle>AI Summary</CardTitle>
                <CardDescription>
                  Generate a summary of this commit using AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  disabled={summarizeMutation.isPending}
                  onClick={handleGenerateSummary}
                >
                  {summarizeMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Generate Summary
                </Button>

                {summarizeMutation.isError && (
                  <Alert className="mt-4" variant="destructive">
                    <AlertCircle />
                    <AlertDescription>
                      Failed to generate summary
                    </AlertDescription>
                  </Alert>
                )}

                {summary && (
                  <Alert className="mt-4">
                    <AlertDescription className="whitespace-pre-wrap">
                      {summary}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* File Changes */}
            <Card>
              <CardHeader>
                <CardTitle>File Changes</CardTitle>
                <CardDescription>
                  {commit.files?.length || 0} file(s) changed,{" "}
                  <span className="text-green-600">
                    +{commit.stats?.additions || 0}
                  </span>{" "}
                  insertions,{" "}
                  <span className="text-red-600">
                    -{commit.stats?.deletions || 0}
                  </span>{" "}
                  deletions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commit.files?.map((file) => (
                    <div
                      className="rounded-md border border-gray-200"
                      key={file.filename}
                    >
                      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-medium">
                            {file.filename}
                          </span>
                          <span className="text-xs text-gray-600">
                            <span className="text-green-600">
                              +{file.additions}
                            </span>
                            {" / "}
                            <span className="text-red-600">
                              -{file.deletions}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="overflow-x-auto p-4">
                        <pre className="text-xs">
                          <code>{file.patch}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
