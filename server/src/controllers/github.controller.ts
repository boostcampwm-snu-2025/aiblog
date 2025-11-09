import { Request, Response } from 'express';
import { ApiResponse } from '../types';
import { asyncHandler } from '../middlewares/errorHandler';

// Mock data for testing (will be replaced with real API calls)
const mockCommits = [
  {
    sha: '1a2b3c4d',
    commit: {
      message: 'Add user authentication feature',
      author: {
        name: 'John Doe',
        email: 'john@example.com',
        date: '2024-01-15T10:30:00Z',
      },
    },
    html_url: 'https://github.com/owner/repo/commit/1a2b3c4d',
  },
  {
    sha: '5e6f7g8h',
    commit: {
      message: 'Fix bug in login flow',
      author: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        date: '2024-01-14T15:45:00Z',
      },
    },
    html_url: 'https://github.com/owner/repo/commit/5e6f7g8h',
  },
];

const mockPullRequests = [
  {
    id: 1,
    number: 42,
    title: 'Feature: Add dark mode support',
    body: 'This PR adds dark mode support to the application',
    state: 'open',
    created_at: '2024-01-16T09:00:00Z',
    updated_at: '2024-01-16T14:30:00Z',
    html_url: 'https://github.com/owner/repo/pull/42',
    user: {
      login: 'contributor1',
    },
  },
];

export const getCommits = asyncHandler(
  async (req: Request, res: Response) => {
    const { owner, repo } = req.params as { owner: string; repo: string };

    console.log(`Fetching commits for ${owner}/${repo}`);

    // TODO: Replace with actual GitHub API call in next step
    // For now, return mock data
    const response: ApiResponse = {
      success: true,
      data: mockCommits,
      message: `Mock commits for ${owner}/${repo}`,
    };

    res.json(response);
  }
);

export const getPullRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const { owner, repo } = req.params as { owner: string; repo: string };

    console.log(`Fetching pull requests for ${owner}/${repo}`);

    // TODO: Replace with actual GitHub API call in next step
    // For now, return mock data
    const response: ApiResponse = {
      success: true,
      data: mockPullRequests,
      message: `Mock pull requests for ${owner}/${repo}`,
    };

    res.json(response);
  }
);
