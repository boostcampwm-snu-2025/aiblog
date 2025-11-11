export type PRStatus = "draft" | "open" | "merged" | "closed";

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  prStatus: PRStatus;
  user: {
    login: string;
  };
  createdAt: string;
  mergedAt: string | null;
  draft: boolean;
}
