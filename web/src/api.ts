const API = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
export async function fetchRecent(owner:string, repo:string, sinceDays=14) {
  const res = await fetch(`${API}/api/github/${owner}/${repo}/recent?sinceDays=${sinceDays}`);
  if(!res.ok) throw new Error(await res.text());
  return (await res.json()).items;
}
export async function summarize(items:any[]) {
  const res = await fetch(`${API}/api/summarize`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items, language:'ko', tone:'blog' }) });
  if(!res.ok) throw new Error(await res.text());
  return (await res.json()).markdown as string;
}