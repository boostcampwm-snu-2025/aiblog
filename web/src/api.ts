const API = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

import type { Activity } from './types';
import type { Post } from './api.types';

export async function fetchRecent(
  owner: string,
  repo: string,
  sinceDays = 90,
) {
  const res = await fetch(
    `${API}/api/github/${owner}/${repo}/recent?sinceDays=${sinceDays}`,
  );
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return (await res.json()).items as Activity[];
}

export async function summarizeActivities(
  items: Activity[],
  language: 'ko' | 'en' = 'ko',
  tone: 'blog' | 'concise' = 'blog',
): Promise<string> {
  const payload = {
    items: items.map((it) => ({
      title: it.title,
      message: it.message,
      url: it.url,
      committedAt: it.committedAt,
    })),
    language,
    tone,
  };

  const res = await fetch(`${API}/api/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  const json = await res.json();
  return json.markdown as string;
}

export async function listPosts(): Promise<Post[]> {
  const res = await fetch(`${API}/api/posts`);
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return (await res.json()) as Post[];
}

export async function getPost(id: string): Promise<Post> {
  const res = await fetch(`${API}/api/posts/${id}`);
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return (await res.json()) as Post;
}

export async function createPost(
  title: string,
  markdown: string,
  tags?: string[],
): Promise<Post> {
  const res = await fetch(`${API}/api/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, markdown, tags }),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return (await res.json()) as Post;
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`${API}/api/posts/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
}

