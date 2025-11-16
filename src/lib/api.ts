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

export interface PublishBlogRequest {
  title: string;
  content: string;
  summary?: string;
  commitSha: string;
  owner: string;
  repo: string;
  author: string;
  filesChanged: string[];
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
}

export interface PublishBlogResponse {
  success: boolean;
  data?: {
    id: string;
    title: string;
    content: string;
    summary?: string;
    commitSha: string;
    owner: string;
    repo: string;
    author: string;
    filesChanged: string[];
    stats: {
      additions: number;
      deletions: number;
      total: number;
    };
    published: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
  error?: string;
}

export async function publishBlog(data: PublishBlogRequest): Promise<PublishBlogResponse> {
  const res = await fetch(`http://localhost:3000/api/blog/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<PublishBlogResponse>;
}

export interface BlogListResponse {
  success: boolean;
  items: Array<{
    id: string;
    title: string;
    summary?: string;
    commitSha: string;
    owner: string;
    repo: string;
    author: string;
    publishedAt?: string;
  }>;
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export async function fetchBlogList(page: number = 1, perPage: number = 10): Promise<BlogListResponse> {
  const res = await fetch(`http://localhost:3000/api/blog/list?page=${page}&per_page=${perPage}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<BlogListResponse>;
}

export interface BlogDetailResponse {
  success: boolean;
  data?: PublishBlogResponse['data'];
  error?: string;
}

export async function fetchBlogDetail(id: string): Promise<BlogDetailResponse> {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<BlogDetailResponse>;
}

export async function deleteBlog(id: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }

  return res.json();
}

