const BASE = 'http://localhost:5179';

export async function getCommits(repo) {
  const r = await fetch(`${BASE}/api/github/commits?repo=${encodeURIComponent(repo)}`);
  return r.json();
}
export async function getPRs(repo) {
  const r = await fetch(`${BASE}/api/github/pulls?repo=${encodeURIComponent(repo)}`);
  return r.json();
}
export async function summarizeCommit(commit) {
  const r = await fetch(`${BASE}/api/github/summarize/commit`, {
    method: 'POST', headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ commit })
  });
  return r.json();
}
export async function savePost(payload) {
  const r = await fetch(`${BASE}/api/posts`, {
    method: 'POST', headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(payload)
  });
  return r.json();
}
export async function listPosts() {
  const r = await fetch(`${BASE}/api/posts`);
  return r.json();
}
export async function deletePost(id) {
  const r = await fetch(`${BASE}/api/posts/${id}`, { method:'DELETE' });
  return r.json();
}
