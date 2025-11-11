const API = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export async function fetchRecent(owner: string, repo: string, sinceDays = 90) {
    const res = await fetch(`${API}/api/github/${owner}/${repo}/recent?sinceDays=${sinceDays}`);
    if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
    return (await res.json()).items;
  }
  
