import { useEffect, useState } from 'react';
import type { Activity } from '../types';
import { fetchActivities, type BlogGenerationResponse } from '../lib/api';
import ActivityItem from './ActivityItem';

type Props = {
  owner: string;
  repo: string;
  onLoadingChange?: (loading: boolean) => void;
  onBlogGenerate?: (blogData: BlogGenerationResponse['data']) => void;
};

export default function ActivityList({ owner, repo, onLoadingChange, onBlogGenerate }: Props) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const load = async (nextPage = 1) => {
    try {
      setLoading(true);
      onLoadingChange?.(true);
      const res = await fetchActivities({ owner, repo, type:'all', page: nextPage, perPage: 20 });
      if (res.items.length === 0) setHasMore(false);
      setItems(prev => nextPage === 1 ? res.items : [...prev, ...res.items]);
      setPage(nextPage);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message ?? 'fetch failed');
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  useEffect(() => { setItems([]); setPage(1); if (owner && repo) load(1); }, [owner, repo]);

  return (
    <div style={{ display:'grid', gap:12, marginTop:12 }}>
      {err && <div style={{ color:'crimson' }}>에러: {err}</div>}
      {items.map((it, idx) => (
        <ActivityItem
          key={`${it.kind}-${it.kind==='commit'?it.id:it.number}-${idx}`}
          item={it}
          owner={owner}
          repo={repo}
          onBlogGenerate={onBlogGenerate}
        />
      ))}
      {loading && <div>로딩중…</div>}
      {!loading && items.length > 0 && (hasMore ? (
        <button onClick={() => load(page + 1)} style={{ padding:10 }}>더 보기</button>
      ) : <div>마지막 페이지입니다.</div>)}
    </div>
  );
}
