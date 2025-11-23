import { Card, CardTitle } from "@shared";
import type { CommitInfo } from "@shared/api/types";

type CommitCardProps = {
  commit: CommitInfo;
};

export function CommitCard({ commit }: CommitCardProps) {
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
      </div>
    </Card>
  );
}
