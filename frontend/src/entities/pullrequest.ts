export type PRStatus = "draft" | "open" | "merged" | "closed";

export type PullRequest = {
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
};

export type PaginationInfo = {
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  lastPage: number | null;
};

export type GetPullRequestsResponse = {
  data: PullRequest[];
  pagination: PaginationInfo;
};
