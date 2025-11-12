import { Card, CardTitle } from "../../../shared";
import { Button } from "../../../shared";
import type { CommitInfo } from "../../../shared/api/types";

type CommitCardProps = {
  commit: CommitInfo;
  onGenerateSummary: (sha: string) => void;
};

export function CommitCard({ commit, onGenerateSummary }: CommitCardProps) {
  return (
    <Card
      variant="default"
      padding="md"
      className="flex justify-between items-center"
    >
      <div className="space-y-3">
        <CardTitle>{commit.message}</CardTitle>
        <p className="text-sm text-gray-500">
          {commit.author} • {commit.date}
        </p>
        <Button size="sm" onClick={() => onGenerateSummary(commit.sha)}>
          Generate Summary
        </Button>
      </div>
    </Card>
  );
}
