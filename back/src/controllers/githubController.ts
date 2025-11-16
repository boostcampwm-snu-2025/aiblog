import type { Request, Response } from "express";
import { GithubService } from "../services/GithubService.ts";
import type {
  GetCommitDetailListRequest,
  GetRepoListRequest,
} from "../types/index.ts";

const githubService = new GithubService();

const handleError = (res: Response, error: unknown) => {
  const anyErr = error as any;
  const status = anyErr?.status || anyErr?.response?.status || 500;
  const message = anyErr?.message || "Internal server error";
  if (status === 404) {
    res.status(404).json({ error: "Not found" });
  } else {
    res.status(status).json({ error: message });
  }
};

export const getRepoList = async (_req: Request, res: Response) => {
  try {
    const repos = await githubService.listRepos();
    res.status(200).json(repos);
  } catch (err) {
    handleError(res, err);
  }
};

export const getCommitList = async (
  req: Request<GetRepoListRequest>,
  res: Response,
) => {
  try {
    const { repoOrg, repoName } = req.params;
    if (!repoOrg || !repoName) {
      res.status(400).json({ error: "Missing repoOrg or repoName" });
      return;
    }
    const commits = await githubService.listCommits(repoOrg, repoName);
    res.status(200).json(commits);
  } catch (err) {
    handleError(res, err);
  }
};

export const getCommitDetailList = async (
  req: Request<GetCommitDetailListRequest>,
  res: Response,
) => {
  try {
    const { repoOrg, repoName, commitHash } = req.params;
    if (!repoOrg || !repoName || !commitHash) {
      res
        .status(400)
        .json({ error: "Missing repoOrg, repoName, or commitHash" });
      return;
    }
    const details = await githubService.getCommitDetails(
      repoOrg,
      repoName,
      commitHash,
    );
    res.status(200).json(details);
  } catch (err) {
    handleError(res, err);
  }
};
