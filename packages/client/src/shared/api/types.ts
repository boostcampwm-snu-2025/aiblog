export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
};

export type CommitInfo = {
  sha: string;
  author: string;
  authorEmail: string;
  committer: string;
  committerEmail: string;
  message: string;
  date: string;
  authorLogin: string | null;
  authorAvatar: string | null;
};

export type CommitsResponse = {
  repository: string;
  page: number;
  perPage: number;
  count: number;
  commits: CommitInfo[];
};
