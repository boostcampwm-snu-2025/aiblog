// web/src/App.tsx
import { useState } from 'react';
import { RepoForm } from './components/RepoForm';
import { ActivityList } from './components/ActivityList';
import { Loader } from './components/Loader';
import { ErrorBanner } from './components/ErrorBanner';
import { fetchRecent } from './api';
import type { Activity } from './types';

export default function App() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function onSearch(owner: string, repo: string) {
    setError(undefined);
    setLoading(true);
    setItems([]);
    try {
      const data = (await fetchRecent(owner, repo, 90)) as Activity[]; // 기간은 필요에 맞게
      setItems(data);
    } catch (e: any) {
      setError(e?.message ?? '불러오기 실패');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>GitHub 활동 목록</h1>

      <RepoForm onSearch={onSearch} />

      {loading && <Loader />}
      {error && <ErrorBanner msg={error} />}

      {!loading && !error && items.length === 0 && (
        <div className="empty">선택한 기간 내 활동이 없습니다.</div>
      )}

      {!loading && !error && items.length > 0 && (
        <ActivityList items={items} />
      )}
    </div>
  );
}
