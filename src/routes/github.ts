import { Router } from 'express';
// import { Octokit } from '@octokit/rest';
import type { Activity, PagedResponse } from '../types';


const router = Router();

async function buildOctokit(token?: string) {
  const mod = await import('@octokit/rest'); // ESM을 안전하게 로드
  const { Octokit } = mod;
  const auth = token || process.env.GITHUB_PAT || undefined;
  return new Octokit(auth ? { auth } : {});
}

/**
 * GET /api/github/activities?owner=:o&repo=:r&type=all|commits|prs&per_page=20&page=1
 * - 커밋: 기본 브랜치 기준 최신
 * - PR: 업데이트 최신
 * - 통합 후 날짜 기준 내림차순
 */
router.get('/activities', async (req, res) => {
  const owner = String(req.query.owner || '');
  const repo = String(req.query.repo || '');
  const type = (req.query.type as string) || 'all';
  const per_page = Number(req.query.per_page || 20);
  const page = Number(req.query.page || 1);

  if (!owner || !repo) return res.status(400).json({ error: 'owner/repo required' });

  try {
    const token = (req.session as any).ghToken as string | undefined;
    const octokit = await buildOctokit(token);

    const tasks: Promise<any>[] = [];
    if (type === 'all' || type === 'commits') {
      tasks.push(octokit.repos.listCommits({ owner, repo, per_page, page }));
    } else {
      tasks.push(Promise.resolve({ data: [] }));
    }
    if (type === 'all' || type === 'prs') {
      tasks.push(octokit.pulls.list({ owner, repo, state: 'all', sort: 'updated', direction: 'desc', per_page, page }));
    } else {
      tasks.push(Promise.resolve({ data: [] }));
    }

    const [commitsRes, prsRes] = await Promise.all(tasks);
    const commits = (commitsRes.data as any[]).map<Activity>(c => ({
      kind: 'commit',
      id: c.sha,
      sha: c.sha,
      title: (c.commit?.message?.split('\n')[0]) || '(no message)',
      message: c.commit?.message || '',
      author: c.author?.login || c.commit?.author?.name || 'unknown',
      url: c.html_url,
      date: c.commit?.committer?.date
    }));

    const prs = (prsRes.data as any[]).map<Activity>(p => ({
      kind: 'pr',
      id: p.id,
      number: p.number,
      title: p.title,
      author: p.user?.login || 'unknown',
      url: p.html_url,
      date: p.updated_at,
      state: p.merged_at ? 'merged' : p.state
    }));

    const items = [...commits, ...prs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const body: PagedResponse<Activity> = { items, pageInfo: { page, perPage: per_page } };
    res.json(body);
  } catch (e: any) {
    res.status(500).json({ error: 'GitHub fetch failed', detail: e?.message });
  }
});

export default router;
