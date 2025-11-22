import type { Endpoints } from "@octokit/types";

import { queryOptions } from "@tanstack/react-query";

export function readBranchCommits(owner: string, repo: string, branch: string) {
  return queryOptions({
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/github/repos/${owner}/${repo}/branches/${branch}/commits`,
        { signal },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data =
        (await response.json()) as Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"];
      return data;
    },
    queryKey: ["branch-commits", owner, repo, branch],
  });
}

export function readBranches(owner: string, repo: string) {
  return queryOptions({
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/github/repos/${owner}/${repo}/branches`,
        { signal },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data =
        (await response.json()) as Endpoints["GET /repos/{owner}/{repo}/branches"]["response"]["data"];
      return data;
    },
    queryKey: ["branches", owner, repo],
  });
}

export function readCommit(owner: string, repo: string, ref: string) {
  return queryOptions({
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/github/repos/${owner}/${repo}/commits/${ref}`,
        { signal },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data =
        (await response.json()) as Endpoints["GET /repos/{owner}/{repo}/commits/{ref}"]["response"]["data"];
      return data;
    },
    queryKey: ["commit", owner, repo, ref],
  });
}

export function readOrgRepos(org: string) {
  return queryOptions({
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/github/orgs/${org}/repos`, {
        signal,
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data =
        (await response.json()) as Endpoints["GET /orgs/{org}/repos"]["response"]["data"];
      return data;
    },
    queryKey: ["org-repos", org],
  });
}

export function readPullCommits(owner: string, repo: string, prNumber: number) {
  return queryOptions({
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/github/repos/${owner}/${repo}/pulls/${prNumber}/commits`,
        { signal },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data =
        (await response.json()) as Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"]["response"]["data"];
      return data;
    },
    queryKey: ["pull-commits", owner, repo, prNumber],
  });
}

export function readPulls(owner: string, repo: string) {
  return queryOptions({
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/github/repos/${owner}/${repo}/pulls`,
        { signal },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data =
        (await response.json()) as Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"]["data"];
      return data;
    },
    queryKey: ["pulls", owner, repo],
  });
}

export function readRepository(owner: string, repo: string) {
  return queryOptions({
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/github/repos/${owner}/${repo}`,
        {
          signal,
        },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data =
        (await response.json()) as Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"];
      return data;
    },
    queryKey: ["repository", owner, repo],
  });
}

export function readUserRepos(username: string) {
  return queryOptions({
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/github/users/${username}/repos`,
        { signal },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data =
        (await response.json()) as Endpoints["GET /users/{username}/repos"]["response"]["data"];
      return data;
    },
    queryKey: ["user-repos", username],
  });
}

export function searchRepositories(query: string) {
  return queryOptions({
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/github/search/repositories?q=${encodeURIComponent(
          query,
        )}`,
        { signal },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data =
        (await response.json()) as Endpoints["GET /search/repositories"]["response"]["data"];
      return data;
    },
    queryKey: ["search-repositories", query],
  });
}
