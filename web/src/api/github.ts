import type { Endpoints } from "@octokit/types";

import { baseUrl } from ".";

export async function readBranch(
  owner: string,
  repo: string,
  branch: string,
  signal?: AbortSignal | null,
) {
  const response = await fetch(
    `${baseUrl}/api/github/repos/${owner}/${repo}/branches/${branch}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data =
    (await response.json()) as Endpoints["GET /repos/{owner}/{repo}/branches/{branch}"]["response"]["data"];
  return data;
}

export async function readBranches(
  owner: string,
  repo: string,
  signal?: AbortSignal | null,
) {
  const response = await fetch(
    `${baseUrl}/api/github/repos/${owner}/${repo}/branches`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data =
    (await response.json()) as Endpoints["GET /repos/{owner}/{repo}/branches"]["response"]["data"];
  return data;
}

export async function readCommits(
  owner: string,
  repo: string,
  signal?: AbortSignal | null,
) {
  const response = await fetch(
    `${baseUrl}/api/github/repos/${owner}/${repo}/commits`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data =
    (await response.json()) as Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"];
  return data;
}

export async function readPullCommits(
  owner: string,
  repo: string,
  pullNumber: number,
  signal?: AbortSignal | null,
) {
  const response = await fetch(
    `${baseUrl}/api/github/repos/${owner}/${repo}/pulls/${pullNumber}/commits`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data =
    (await response.json()) as Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"]["response"]["data"];
  return data;
}

export async function readPulls(
  owner: string,
  repo: string,
  signal?: AbortSignal | null,
) {
  const response = await fetch(
    `${baseUrl}/api/github/repos/${owner}/${repo}/pulls`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data =
    (await response.json()) as Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"]["data"];
  return data;
}
