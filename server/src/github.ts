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
  
  // 모든 브랜치 가져오기
  const branchesUrl = `${API}/repos/${owner}/${repo}/branches?per_page=100`;
  const prsUrl = `${API}/repos/${owner}/${repo}/pulls?state=all&sort=updated&direction=desc&per_page=${perPage}&page=${page}`;
  
  const [{ json: branches }, { json: prs }] = await Promise.all([
    fetchJSON(branchesUrl, token), 
    fetchJSON(prsUrl, token)
  ]);

  // 각 브랜치의 최근 커밋 가져오기
  const commitItems: Activity[] = [];
  const branchList = (branches || []).slice(0, 10); // 최대 10개 브랜치만 조회
  
  await Promise.all(
    branchList.map(async (branch: any) => {
      try {
        const branchName = branch.name;
        const commitsUrl = `${API}/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branchName)}&since=${encodeURIComponent(sinceISO)}&per_page=${perPage}&page=${page}`;
        const { json: commits } = await fetchJSON(commitsUrl, token);
        
        (commits || []).forEach((c: any) => {
          commitItems.push({
            id: `${c.sha}-${branchName}`,
            type: 'commit',
            title: (c.commit?.message?.split('\n')[0]) ?? 'Commit',
            message: c.commit?.message,
            url: c.html_url,
            author: c.commit?.author?.name ?? c.author?.login ?? 'unknown',
            committedAt: c.commit?.author?.date ?? c.commit?.committer?.date ?? new Date().toISOString(),
            branch: branchName,
          });
        });
      } catch (err) {
        // 브랜치별 에러는 무시하고 계속 진행
        console.error(`Error fetching commits for branch ${branch.name}:`, err);
      }
    })
  );

  const prItems: Activity[] = (prs || []).map((p: any) => ({
    id: String(p.id),
    type: 'pr',
    title: p.title,
    message: p.body ?? undefined,
    url: p.html_url,
    author: p.user?.login ?? 'unknown',
    committedAt: p.updated_at ?? p.created_at,
    branch: p.head?.ref, // PR의 소스 브랜치
  }));

  return [...commitItems, ...prItems].sort((a,b)=> +new Date(b.committedAt) - +new Date(a.committedAt));
}