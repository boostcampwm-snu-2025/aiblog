import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { createCommitSummary } from "~/api/gemini";
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
  const [summary, setSummary] = useState("");
  const summarizeMutation = useMutation({
    mutationFn: () => createCommitSummary(owner, repo, ref),
  });

  useEffect(() => {
    if (summarizeMutation.isSuccess) {
      setSummary(summarizeMutation.data);
    }
  }, [summarizeMutation.isSuccess, summarizeMutation.data]);

  const handleGenerateSummary = () => {
    summarizeMutation.mutate();
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
            <AlertDescription>Failed to generate summary</AlertDescription>
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
  );
}

export default Summary;
