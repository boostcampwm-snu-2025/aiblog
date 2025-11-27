import { type Endpoints } from "@octokit/types";
export interface PostMeta {
  title: string;
  date: string; // ISO date-time
  repo: string;
  commit: string;
  tags: string[];
}

export interface PostListItem {
  id: string;
  title: string;
  tags: string[];
  date: string; // ISO date-time
}

export interface PostDetail {
  id: string;
  title: string;
  content: string;
  tags: string[];
  date: string; // ISO date-time
}

export interface CreatePostRequest {
  title: string;
  repo: string;
  commit: string;
  content: string;
  tags: string[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface GetRepoListRequest {
  repoOrg: string;
  repoName: string;
}

export interface GetCommitDetailListRequest {
  repoOrg: string;
  repoName: string;
  commitHash: string;
}

export interface CommitFile {
  filename: string;
  status: "added" | "modified" | "deleted" | "renamed";
  additions: number;
  deletions: number;
  changes: number;
  patch: string;
}

export type CommitItem =
  Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"][number];
