import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";

import {
  createCommitSummary,
  deleteCommitSummary,
  existsCommitSummary,
  readCommitSummary,
} from "~/api/gemini";
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

function Summary({ owner, ref, repo }: Props) {
  const queryClient = useQueryClient();

  const { data: exists } = useSuspenseQuery(
    existsCommitSummary(owner, repo, ref),
  );

  const { data: summary } = useSuspenseQuery({
    ...readCommitSummary(owner, repo, ref),
    // enabled: exists,
  });

  const createMutation = useMutation(createCommitSummary(queryClient));

  const deleteMutation = useMutation(deleteCommitSummary(queryClient));

  const handleGenerateSummary = () => {
    createMutation.mutate({ owner, ref, repo });
  };

  const handleDeleteSummary = () => {
    deleteMutation.mutate({ owner, ref, repo });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Summary</CardTitle>
        <CardDescription>
          {exists
            ? "AI-generated summary of this commit"
            : "Generate a summary of this commit using AI"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {exists ? (
          <>
            <Alert className="mb-4">
              <AlertDescription className="whitespace-pre-wrap">
                {summary}
              </AlertDescription>
            </Alert>
            <Button
              disabled={deleteMutation.isPending}
              onClick={handleDeleteSummary}
              variant="destructive"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Summary
            </Button>
          </>
        ) : (
          <Button
            disabled={createMutation.isPending}
            onClick={handleGenerateSummary}
          >
            {createMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Generate Summary
          </Button>
        )}

        {createMutation.isError && (
          <Alert className="mt-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to generate summary</AlertDescription>
          </Alert>
        )}

        {deleteMutation.isError && (
          <Alert className="mt-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to delete summary</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default Summary;
