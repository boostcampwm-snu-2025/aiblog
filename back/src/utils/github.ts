import type { CommitItem } from "@/types/index.ts";

export const getCommitDate = (data: CommitItem): string =>
  data.commit.author?.date ||
  data.commit.committer?.date ||
  new Date(0).toISOString();
