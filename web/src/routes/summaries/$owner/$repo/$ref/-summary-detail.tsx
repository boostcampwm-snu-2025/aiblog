import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, GitCommit, Loader2, Trash2 } from "lucide-react";

import { deleteCommitSummary, readCommitSummary } from "~/api/gemini";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface Props {
  owner: string;
  ref: string;
  repo: string;
}

function SummaryDetail({ owner, ref, repo }: Props) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: summary } = useSuspenseQuery(
    readCommitSummary(owner, repo, ref),
  );

  const deleteMutation = useMutation({
    ...deleteCommitSummary(queryClient),
    onSuccess: () => {
      void navigate({ to: "/summaries" });
    },
  });

  const handleDeleteSummary = () => {
    deleteMutation.mutate({ owner, ref, repo });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {owner}/{repo}
        </h1>
        <div className="mt-2 flex items-center gap-2 text-muted-foreground">
          <GitCommit className="h-4 w-4" />
          <code className="rounded bg-muted px-2 py-1 text-xs">{ref}</code>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Summary</CardTitle>
          <CardDescription>AI-generated summary of this commit</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertDescription className="whitespace-pre-wrap">
              {summary}
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <Link
              className="text-sm text-blue-600 hover:underline"
              params={{ owner, ref, repo }}
              to="/repos/$owner/$repo/commits/$ref"
            >
              View commit details →
            </Link>

            <Button
              disabled={deleteMutation.isPending}
              onClick={handleDeleteSummary}
              size="sm"
              variant="destructive"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Summary
            </Button>
          </div>

          {deleteMutation.isError && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to delete summary</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SummaryDetail;
