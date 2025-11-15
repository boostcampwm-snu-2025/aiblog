export type GitHubCommitAuthor = {
  name: string;
  email: string;
  date: string;
};

export type GitHubCommitData = {
  author: GitHubCommitAuthor;
  committer: GitHubCommitAuthor;
  message: string;
};

export type GitHubCommitResponse = {
  sha: string;
  commit: GitHubCommitData;
  author: {
    login: string;
    avatar_url: string;
  } | null;
  committer: {
    login: string;
    avatar_url: string;
  } | null;
};

export type ParsedGitHubUrl = {
  owner: string;
  repo: string;
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

export type GitHubPullRequestResponse = {
  id: number;
  number: number;
  state: "open" | "closed";
  title: string;
  body: string | null;
  user: {
    login: string;
    avatar_url: string;
  } | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };
  merged: boolean;
  mergeable: boolean | null;
  draft: boolean;
  html_url: string;
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
