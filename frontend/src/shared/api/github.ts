export interface Commit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

export interface PullRequest {
  number: number;
  title: string;
  html_url: string;
  created_at: string;
  author: {
    login: string;
    url: string;
  };
  body?: string;
}

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  stargazers_count: number;
  html_url: string;
  owner: {
    login: string;
  };
}

export interface SimplePRDetail {
  number: number;
  title: string;
  body: string | null;
  author: string;
  html_url: string;
  created_at: string;
  merged: boolean;
}

export interface CommitDetail {
  message: string;
  body?: string | null;
  files: {
    filename: string;
    status: string;
    patch?: string;
  }[];
}

const BASE_URL = "/api/github";

async function apiFetch<T>(
  path: string,
  params?: Record<string, any>
): Promise<T> {
  const query = params
    ? "?" +
      Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&")
    : "";

  const res = await fetch(`${BASE_URL}${path}${query}`);

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `API Error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const getCommits = async (
  owner: string,
  repo: string,
  page = 1
): Promise<Commit[]> => {
  return apiFetch<Commit[]>("/commits", {
    owner,
    repo,
    page,
    per_page: 10,
  });
};

export const getPRs = async (
  owner: string,
  repo: string,
  page = 1
): Promise<PullRequest[]> => {
  return apiFetch<PullRequest[]>("/prs", {
    owner,
    repo,
    page,
    per_page: 10,
  });
};

export const getMyRepos = async (): Promise<Repo[]> => {
  return apiFetch<Repo[]>("/repos");
};

export const getSimplePRDetail = async (
  owner: string,
  repo: string,
  number: number
): Promise<SimplePRDetail> => {
  return apiFetch<SimplePRDetail>(`/pr-detail/${number}`, {
    owner,
    repo,
  });
};

export const getCommitDetail = async (
  owner: string,
  repo: string,
  sha: string
): Promise<CommitDetail> => {
  return apiFetch<CommitDetail>("/commit-detail", {
    owner,
    repo,
    sha,
  });
};