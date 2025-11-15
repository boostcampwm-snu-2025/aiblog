import { useEffect, useState } from 'react';
import { fetchRepositories } from '../lib/api';

type Repository = {
  name: string;
  description: string | null;
  stars: number;
  updated_at: string;
};

type Props = {
  owner: string;
  onSelectRepo: (repo: string) => void;
  onLoadingChange?: (loading: boolean) => void;
};

export default function RepositoryList({ owner, onSelectRepo, onLoadingChange }: Props) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!owner) return;

    const load = async () => {
      try {
        setLoading(true);
        onLoadingChange?.(true);
        setError(null);
        const data = await fetchRepositories(owner);
        setRepos(data);
      } catch (e: any) {
        setError(e?.message ?? 'Repository 목록을 불러올 수 없습니다');
      } finally {
        setLoading(false);
        onLoadingChange?.(false);
      }
    };

    load();
  }, [owner]);

  const default_list = (
    <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
      <h2>{owner}의 Repositories</h2>
      {repos.map(repo => (
        <div
          key={repo.name}
          onClick={() => onSelectRepo(repo.name)}
          style={{
            padding: 16,
            border: '1px solid #444',
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: 8 }}>
            {repo.name}
          </div>
          {repo.description && (
            <div style={{ color: '#aaa', marginBottom: 8 }}>
              {repo.description}
            </div>
          )}
          <div style={{ fontSize: '0.9em', color: '#888' }}>
            ⭐ {repo.stars} · 업데이트: {new Date(repo.updated_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) return default_list;
  if (error) return <div style={{ color: 'crimson' }}>에러: {error}</div>;
  if (repos.length === 0) return <div>Repository가 없습니다.</div>;
  return default_list;
}
