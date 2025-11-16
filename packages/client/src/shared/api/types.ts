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

export type PullRequestInfo = {
  id: number;
  number: number;
  state: "open" | "closed";
  title: string;
  body: string | null;
  authorLogin: string | null;
  authorAvatar: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  mergedAt: string | null;
  headRef: string;
  headSha: string;
  baseRef: string;
  baseSha: string;
  merged: boolean;
  mergeable: boolean | null;
  draft: boolean;
  htmlUrl: string;
};

export type PullRequestsResponse = {
  repository: string;
  page: number;
  perPage: number;
  state: "open" | "closed" | "all";
  count: number;
  pullRequests: PullRequestInfo[];
};

export type GeneratePRSummaryRequest = {
  url: string;
  pullNumber: number;
};

export type GeneratePRSummaryResponse = {
  summary: string;
  prNumber: number;
  repository: string;
};

export type GenerateBlogPostRequest = {
  url: string;
  pullNumber: number;
  summary: string;
};

export type GenerateBlogPostResponse = {
  blogPost: string;
  blogPostTitle: string;
  prNumber: number;
  repository: string;
};

export type SaveBlogPostRequest = {
  url: string;
  pullNumber: number;
  blogPost: string;
  summary?: string | null;
  title?: string | null;
};

export type SaveBlogPostResponse = {
  id: string;
  repository: string;
  prNumber: number;
};
