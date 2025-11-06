import { useEffect, useState } from 'react';
import type { Activity } from '../types';
import { fetchActivities } from '../lib/api';
import ActivityItem from './ActivityItem';

type Props = { owner: string; repo: string };

export default function ActivityList({ owner, repo }: Props) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async (nextPage = 1) => {
    try {
      setLoading(true);
      const res = await fetchActivities({ owner, repo, type:'all', page: nextPage, perPage: 20 });
      setItems(prev => nextPage === 1 ? res.items : [...prev, ...res.items]);
      setPage(nextPage);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message ?? 'fetch failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setItems([]); setPage(1); if (owner && repo) load(1); }, [owner, repo]);

  return (
    <div style={{ display:'grid', gap:12, marginTop:12 }}>
      {err && <div style={{ color:'crimson' }}>에러: {err}</div>}
      {items.map((it, idx) => <ActivityItem key={`${it.kind}-${it.kind==='commit'?it.id:it.number}-${idx}`} item={it} />)}
      {loading && <div>로딩중…</div>}
      {!loading && items.length > 0 && (
        <button onClick={() => load(page + 1)} style={{ padding:10 }}>더 보기</button>
      )}
    </div>
  );
}
