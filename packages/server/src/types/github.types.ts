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
