import type { Request, Response } from "express";
import {
  GithubService,
} from "../services/GithubService.ts";

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

export const listRepos = async (_req: Request, res: Response) => {
  try {
    const repos = await githubService.listRepos();
    res.status(200).json(repos);
  } catch (err) {
    handleError(res, err);
  }
};

export const listCommits = async (req: Request, res: Response) => {
  try {
    const { repoOrg, repoName } = req.params as { repoOrg: string; repoName: string };
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

export const getCommitDetails = async (req: Request, res: Response) => {
  try {
    const { repoOrg, repoName, commitHash } = req.params as {
      repoOrg: string;
      repoName: string;
      commitHash: string;
    };
    if (!repoOrg || !repoName || !commitHash) {
      res.status(400).json({ error: "Missing repoOrg, repoName, or commitHash" });
      return;
    }
    const details = await githubService.getCommitDetails(repoOrg, repoName, commitHash);
    res.status(200).json(details);
  } catch (err) {
    handleError(res, err);
  }
};
