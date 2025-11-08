export type PRStatus = "open" | "closed" | "merged" | "draft";

export type PullRequest = {
  id: number;
  number: number;
  title: string;
  state: PRStatus;
  user: {
    login: string;
  };
  createdAt: string;
  mergedAt: string | null;
  draft: boolean;
};
