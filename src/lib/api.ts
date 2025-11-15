import type { Activity } from '../types';

export type { Activity };

export async function fetchActivities(params: {
  owner: string; repo: string; type?: 'all'|'commits'|'prs'; page?: number; perPage?: number;
}) {
  const { owner, repo, type='all', page=1, perPage=20 } = params;
  const qs = new URLSearchParams({ owner, repo, type, page: String(page), per_page: String(perPage) });
  const res = await fetch(`http://localhost:3000/api/github/activities?${qs.toString()}`, {
    credentials: 'include'
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<{ items: Activity[], pageInfo: { page: number; perPage: number } }>;
}

export async function fetchRepositories(owner: string) {
  const res = await fetch(`http://localhost:3000/api/github/repos/${owner}`, {
    credentials: 'include'
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<Array<{ name: string; description: string | null; stars: number; updated_at: string }>>;
}

export const loginWithGitHub = () => {
  window.location.href = `http://localhost:3000/api/auth/login`;
};

export async function getAuthState() {
  const res = await fetch(`http://localhost:3000/api/auth/me`, { credentials: 'include' });
  return res.json() as Promise<{ authenticated: boolean }>;
}

export interface BlogGenerationResponse {
  success: boolean;
  data?: {
    title: string;
    content: string;
    summary?: string;
    metadata: {
      commitSha: string;
      author: string;
      date: string;
      filesChanged: string[];
      stats: {
        additions: number;
        deletions: number;
        total: number;
      };
    };
  };
  error?: string;
  detail?: string;
}

export async function generateBlog(owner: string, repo: string, commitSha: string): Promise<BlogGenerationResponse> {
  const res = await fetch(`http://localhost:3000/api/blog/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ owner, repo, commitSha }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<BlogGenerationResponse>;
}

