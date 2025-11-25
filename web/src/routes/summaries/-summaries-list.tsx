import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Clock, GitCommit } from "lucide-react";

import { readCommitSummaries } from "~/api/summaries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

function SummariesList() {
  const { data: summaries } = useSuspenseQuery(readCommitSummaries());

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Summaries</h1>
        <p className="mt-2 text-muted-foreground">
          All generated commit summaries
        </p>
      </div>

      {summaries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GitCommit className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              No summaries generated yet.
              <br />
              Visit a commit page to generate an AI summary.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {summaries.map(({ generatedAt, owner, ref, repo }) => (
            <Link
              className="block"
              key={`${owner}/${repo}/${ref}`}
              params={{ owner, ref, repo }}
              to="/summaries/$owner/$repo/$ref"
            >
              <Card className="cursor-pointer transition-colors hover:bg-accent">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {owner}/{repo}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <GitCommit className="h-4 w-4" />
                      <code className="rounded bg-muted px-2 py-1 text-xs">
                        {ref.slice(0, 7)}
                      </code>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {generatedAt.fromNow()}
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SummariesList;
