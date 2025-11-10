import { Router } from 'express';
import { fetchRecentCommits, fetchRecentPRs } from '../github.js';
import { summarizeCommit, summarizePR } from '../llm.js';

const r = Router();

/** 최근 커밋 */
r.get('/commits', async (req, res) => {
  try {
    const { repo } = req.query;
    if (!repo) return res.status(400).json({ error: 'repo is required' });
    const [owner, name] = repo.split('/');
    const commits = await fetchRecentCommits({ owner, name, first: 20 });
    res.json(commits);
  } catch (e) {
    console.error('[commits] error:', e.message);
    res.status(500).json({ error: String(e.message) });
  }
});


/** 최근 PR */
r.get('/pulls', async (req, res) => {
  try {
    const { repo } = req.query;
    if (!repo) return res.status(400).json({ error: 'repo is required' });
    const [owner, name] = repo.split('/');
    const prs = await fetchRecentPRs({ owner, name, first: 20 });
    res.json(prs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** 커밋 요약 */
r.post('/summarize/commit', async (req, res) => {
  try {
    const summary = await summarizeCommit(req.body.commit);
    res.json({ summary });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** PR 요약 */
r.post('/summarize/pr', async (req, res) => {
  try {
    const summary = await summarizePR(req.body.pr);
    res.json({ summary });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default r;
