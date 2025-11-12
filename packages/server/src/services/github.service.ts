import {
  GitHubCommitResponse,
  CommitInfo,
  ParsedGitHubUrl,
} from "../types/github.types";
import { buildGitHubApiUrl } from "../utils/github.utils";
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
