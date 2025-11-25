import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Loader2 } from "lucide-react";

import { createCommitSummary } from "~/api/summaries";
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
  const navigate = useNavigate();

  const createMutation = useMutation({
    ...createCommitSummary(queryClient),
    onSuccess: () => {
      void navigate({
        params: { owner, ref, repo },
        to: "/summaries/$owner/$repo/$ref",
      });
    },
  });

  const handleGenerateSummary = () => {
    createMutation.mutate({ owner, ref, repo });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Summary</CardTitle>
        <CardDescription>
          Generate a summary of this commit using AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          disabled={createMutation.isPending}
          onClick={handleGenerateSummary}
        >
          {createMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Generate Summary
        </Button>

        {createMutation.isError && (
          <Alert className="mt-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to generate summary</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default Summary;
