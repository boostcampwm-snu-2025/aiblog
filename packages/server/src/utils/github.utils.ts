import { ParsedGitHubUrl } from "../types/github.types";
import { ValidationError } from "./errors";

export function parseGitHubUrl(url: string): ParsedGitHubUrl {
  if (!url || typeof url !== "string") {
    throw new ValidationError("GitHub URL을 입력해주세요.");
  }

  const trimmedUrl = url.trim();

  const githubUrlPattern =
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/\.]+)(?:\.git)?(?:\/)?$/;

  const match = trimmedUrl.match(githubUrlPattern);

  if (!match) {
    throw new ValidationError(
      "올바른 GitHub 레포지토리 URL 형식이 아닙니다. " +
        "(예: https://github.com/owner/repo)"
    );
  }

  const [, owner, repo] = match;

  if (!owner || !repo) {
    throw new ValidationError(
      "레포지토리 owner 또는 repo 이름을 찾을 수 없습니다."
    );
  }

  return {
    owner,
    repo,
  };
}

export function buildGitHubApiUrl(
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 30
): string {
  const baseUrl = "https://api.github.com";
  return `${baseUrl}/repos/${owner}/${repo}/commits?page=${page}&per_page=${perPage}`;
}

export function buildGitHubPullRequestsApiUrl(
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 30,
  state: "open" | "closed" | "all" = "all"
): string {
  const baseUrl = "https://api.github.com";
  return `${baseUrl}/repos/${owner}/${repo}/pulls?state=${state}&page=${page}&per_page=${perPage}`;
}

export function buildGitHubPullRequestDetailApiUrl(
  owner: string,
  repo: string,
  pullNumber: number
): string {
  const baseUrl = "https://api.github.com";
  return `${baseUrl}/repos/${owner}/${repo}/pulls/${pullNumber}`;
}
