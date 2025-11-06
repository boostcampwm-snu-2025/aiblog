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

export const loginWithGitHub = () => {
  window.location.href = `http://localhost:3000/api/auth/login`;
};

export async function getAuthState() {
  const res = await fetch(`http://localhost:3000/api/auth/me`, { credentials: 'include' });
  return res.json() as Promise<{ authenticated: boolean }>;
}
