import { Request } from 'express';

// GitHub Types
export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  html_url: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  user: {
    login: string;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Request Types
export interface GitHubRepoRequest extends Request {
  params: {
    owner: string;
    repo: string;
  };
}

export interface CreatePostRequest extends Request {
  body: {
    title: string;
    content: string;
    repoName: string;
    metadata?: Record<string, any>;
  };
}
