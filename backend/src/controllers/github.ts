import type { Request, Response } from "express";
import { fetchGithubData } from "../utils/githubApi.js";

// PR 상태 상수
const PR_STATUS = {
  DRAFT: "draft",
  OPEN: "open",
  MERGED: "merged",
  CLOSED: "closed",
} as const;

// PR 상태 판별 함수
const getPRStatus = (
  state: string,
  draft: boolean,
  mergedAt: string | null
) => {
  if (draft) return PR_STATUS.DRAFT;
  if (state === "open") return PR_STATUS.OPEN;
  if (mergedAt) return PR_STATUS.MERGED;
  return PR_STATUS.CLOSED;
};

// 타입 정의
type GetPRListParams = {
  owner: string;
  repo: string;
};

type GetPRListQuery = {
  state?: string;
};

// PR 목록 조회
export const getPRList = async (
  req: Request<GetPRListParams, unknown, unknown, GetPRListQuery>,
  res: Response
) => {
  try {
    const { owner, repo } = req.params;
    const { state = "all" } = req.query;

    const data = await fetchGithubData(
      `/repos/${owner}/${repo}/pulls?state=${state}&per_page=10`
    );

    const simplified = data.map((pr: any) => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      state: pr.state,
      prStatus: getPRStatus(pr.state, pr.draft, pr.merged_at),
      user: {
        login: pr.user.login,
      },
      createdAt: pr.created_at,
      mergedAt: pr.merged_at,
      draft: pr.draft,
    }));

    res.json(simplified);
  } catch (error) {
    console.error("Error fetching PRs:", error);
    res.status(500).json({ error: "Failed to fetch pull requests" });
  }
};

type GetPRDetailParams = {
  owner: string;
  repo: string;
  pull_number: string;
};

// PR 상세 정보 조회
export const getPRDetail = async (
  req: Request<GetPRDetailParams>,
  res: Response
) => {
  try {
    const { owner, repo, pull_number } = req.params;

    const pr = await fetchGithubData(
      `/repos/${owner}/${repo}/pulls/${pull_number}`
    );

    const simplified = {
      id: pr.id,
      number: pr.number,
      title: pr.title,
      state: pr.state,
      prStatus: getPRStatus(pr.state, pr.draft, pr.merged_at),
      body: pr.body,
      user: {
        login: pr.user.login,
      },
      createdAt: pr.created_at,
      mergedAt: pr.merged_at,
      draft: pr.draft,
      htmlUrl: pr.html_url,
    };

    res.json(simplified);
  } catch (error) {
    console.error("Error fetching PR detail:", error);
    res.status(500).json({ error: "Failed to fetch PR detail" });
  }
};

type GetPRCommitsParams = {
  owner: string;
  repo: string;
  pull_number: string;
};

// PR 커밋 로그 조회
export const getPRCommits = async (
  req: Request<GetPRCommitsParams>,
  res: Response
) => {
  try {
    const { owner, repo, pull_number } = req.params;

    const data = await fetchGithubData(
      `/repos/${owner}/${repo}/pulls/${pull_number}/commits`
    );

    const simplified = data.map((commit: any) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: {
        name: commit.commit.author.name,
        date: commit.commit.author.date,
      },
    }));

    res.json(simplified);
  } catch (error) {
    console.error("Error fetching commits:", error);
    res.status(500).json({ error: "Failed to fetch commits" });
  }
};
