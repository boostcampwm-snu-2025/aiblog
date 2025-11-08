import { get as cget, set as cset } from './cache.js';
import type { Activity } from './types.js';

const API = 'https://api.github.com';
const HEADERS = (token?: string) => ({
  'Accept': 'application/vnd.github+json',
  'Authorization': token ? `Bearer ${token}` : undefined,
  'X-GitHub-Api-Version': '2022-11-28',
});

async function fetchJSON(url: string, token?: string) {
  const ck = `gh:${url}`; const cached = cget(ck); const headers: any = HEADERS(token);
  if (cached?.etag) headers['If-None-Match'] = cached.etag;
  const res = await fetch(url, { headers });
  if (res.status === 304 && cached?.body) return { json: cached.body, etag: cached.etag };
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const etag = res.headers.get('etag') ?? undefined; const json = await res.json();
  cset(ck, { etag, body: json }); return { json, etag };
}

export async function getRecentActivities(owner: string, repo: string, sinceDays = 14, page = 1, perPage = 20, token?: string): Promise<Activity[]> {
  const sinceISO = new Date(Date.now() - sinceDays*86400000).toISOString();
  const commitsUrl = `${API}/repos/${owner}/${repo}/commits?since=${encodeURIComponent(sinceISO)}&per_page=${perPage}&page=${page}`;
  const prsUrl = `${API}/repos/${owner}/${repo}/pulls?state=all&sort=updated&direction=desc&per_page=${perPage}&page=${page}`;
  const [{ json: commits }, { json: prs }] = await Promise.all([
    fetchJSON(commitsUrl, token), fetchJSON(prsUrl, token)
  ]);

  const commitItems: Activity[] = (commits || []).map((c: any) => ({
    id: c.sha,
    type: 'commit',
    title: (c.commit?.message?.split('\n')[0]) ?? 'Commit',
    message: c.commit?.message,
    url: c.html_url,
    author: c.commit?.author?.name ?? c.author?.login ?? 'unknown',
    committedAt: c.commit?.author?.date ?? c.commit?.committer?.date ?? new Date().toISOString(),
  }));

  const prItems: Activity[] = (prs || []).map((p: any) => ({
    id: String(p.id),
    type: 'pr',
    title: p.title,
    message: p.body ?? undefined,
    url: p.html_url,
    author: p.user?.login ?? 'unknown',
    committedAt: p.updated_at ?? p.created_at,
  }));

  return [...commitItems, ...prItems].sort((a,b)=> +new Date(b.committedAt) - +new Date(a.committedAt));
}