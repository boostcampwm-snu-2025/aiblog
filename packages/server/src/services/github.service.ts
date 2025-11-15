import {
  GitHubCommitResponse,
  CommitInfo,
  ParsedGitHubUrl,
  GitHubPullRequestResponse,
  PullRequestInfo,
  GitHubPullRequestDetailResponse,
} from "../types/github.types";
import {
  buildGitHubApiUrl,
  buildGitHubPullRequestsApiUrl,
  buildGitHubPullRequestDetailApiUrl,
} from "../utils/github.utils";
import { AppError, NotFoundError } from "../utils/errors";

export async function fetchCommits(
  parsedUrl: ParsedGitHubUrl,
  page: number = 1,
  perPage: number = 30
): Promise<CommitInfo[]> {
  const { owner, repo } = parsedUrl;

  const validatedPerPage = Math.min(Math.max(perPage, 1), 100);

  const apiUrl = buildGitHubApiUrl(owner, repo, page, validatedPerPage);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (response.status === 404) {
      throw new NotFoundError(
        `레포지토리를 찾을 수 없습니다: ${owner}/${repo}`
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        (errorData as { message?: string }).message ||
        "GitHub API 요청에 실패했습니다.";

      throw new AppError(response.status, `GitHub API 오류: ${errorMessage}`);
    }

    const commits = (await response.json()) as GitHubCommitResponse[];

    return commits.map(transformCommitData);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      500,
      `GitHub API 호출 중 오류가 발생했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
  }
}

function transformCommitData(commit: GitHubCommitResponse): CommitInfo {
  return {
    sha: commit.sha,
    author: commit.commit.author.name,
    authorEmail: commit.commit.author.email,
    committer: commit.commit.committer.name,
    committerEmail: commit.commit.committer.email,
    message: commit.commit.message,
    date: commit.commit.author.date,
    authorLogin: commit.author?.login ?? null,
    authorAvatar: commit.author?.avatar_url ?? null,
  };
}

export async function fetchPullRequests(
  parsedUrl: ParsedGitHubUrl,
  page: number = 1,
  perPage: number = 30,
  state: "open" | "closed" | "all" = "all"
): Promise<PullRequestInfo[]> {
  const { owner, repo } = parsedUrl;

  const validatedPerPage = Math.min(Math.max(perPage, 1), 100);

  const apiUrl = buildGitHubPullRequestsApiUrl(
    owner,
    repo,
    page,
    validatedPerPage,
    state
  );

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (response.status === 404) {
      throw new NotFoundError(
        `레포지토리를 찾을 수 없습니다: ${owner}/${repo}`
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        (errorData as { message?: string }).message ||
        "GitHub API 요청에 실패했습니다.";

      throw new AppError(response.status, `GitHub API 오류: ${errorMessage}`);
    }

    const pullRequests = (await response.json()) as GitHubPullRequestResponse[];

    return pullRequests.map(transformPullRequestData);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      500,
      `GitHub API 호출 중 오류가 발생했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
  }
}

function transformPullRequestData(
  pr: GitHubPullRequestResponse
): PullRequestInfo {
  return {
    id: pr.id,
    number: pr.number,
    state: pr.state,
    title: pr.title,
    body: pr.body,
    authorLogin: pr.user?.login ?? null,
    authorAvatar: pr.user?.avatar_url ?? null,
    createdAt: pr.created_at,
    updatedAt: pr.updated_at,
    closedAt: pr.closed_at,
    mergedAt: pr.merged_at,
    headRef: pr.head.ref,
    headSha: pr.head.sha,
    baseRef: pr.base.ref,
    baseSha: pr.base.sha,
    merged: pr.merged,
    mergeable: pr.mergeable,
    draft: pr.draft,
    htmlUrl: pr.html_url,
  };
}

export async function getPullRequest(
  parsedUrl: ParsedGitHubUrl,
  pullNumber: number
): Promise<GitHubPullRequestDetailResponse> {
  const { owner, repo } = parsedUrl;

  const apiUrl = buildGitHubPullRequestDetailApiUrl(owner, repo, pullNumber);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (response.status === 404) {
      throw new NotFoundError(
        `Pull request #${pullNumber}를 찾을 수 없습니다: ${owner}/${repo}`
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        (errorData as { message?: string }).message ||
        "GitHub API 요청에 실패했습니다.";

      throw new AppError(response.status, `GitHub API 오류: ${errorMessage}`);
    }

    return (await response.json()) as GitHubPullRequestDetailResponse;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      500,
      `GitHub API 호출 중 오류가 발생했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
  }
}

export async function getDiff(diffUrl: string): Promise<string> {
  try {
    const response = await fetch(diffUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        (errorData as { message?: string }).message ||
        "Diff를 가져오는데 실패했습니다.";

      throw new AppError(response.status, `GitHub API 오류: ${errorMessage}`);
    }

    return await response.text();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      500,
      `Diff 가져오기 중 오류가 발생했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
  }
}
