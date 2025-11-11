import { Request, Response } from 'express';
import { ApiResponse } from '../types';
import { asyncHandler } from '../middlewares/errorHandler';
import { fetchCommitsGraphQL, fetchPullRequestsGraphQL } from '../services/github.service';

/**
 * Get commits for a repository
 * Query params:
 *   - limit: number of commits (default: 10)
 */
export const getCommits = asyncHandler(
  async (req: Request, res: Response) => {
    const { owner, repo } = req.params as { owner: string; repo: string };
    const limit = parseInt(req.query.limit as string) || 10;

    console.log(`Fetching commits for ${owner}/${repo} (limit: ${limit})`);

    const commits = await fetchCommitsGraphQL(owner, repo, limit);

    const response: ApiResponse = {
      success: true,
      data: commits,
      message: `Fetched ${commits.length} commits from ${owner}/${repo}`,
    };

    res.json(response);
  }
);

/**
 * Get pull requests for a repository
 * Query params:
 *   - limit: number of PRs (default: 10)
 */
export const getPullRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const { owner, repo } = req.params as { owner: string; repo: string };
    const limit = parseInt(req.query.limit as string) || 10;

    console.log(`Fetching pull requests for ${owner}/${repo} (limit: ${limit})`);

    const pullRequests = await fetchPullRequestsGraphQL(owner, repo, limit);

    const response: ApiResponse = {
      success: true,
      data: pullRequests,
      message: `Fetched ${pullRequests.length} pull requests from ${owner}/${repo}`,
    };

    res.json(response);
  }
);
