import { useEffect, useState } from 'react';

export function RepoForm({
  onSearch,
  defaultSinceDays = 90,
}: {
  onSearch: (owner: string, repo: string, sinceDays: number) => void;
  defaultSinceDays?: number;
}) {
  const [repoPath, setRepoPath] = useState('');
  const [since, setSince] = useState(defaultSinceDays); // 기본 값

  useEffect(() => {
    setSince(defaultSinceDays);
  }, [defaultSinceDays]);

  return (
    <form
      className="repo-form"
      onSubmit={(e) => {
        e.preventDefault();
        const [owner, repo] = repoPath.split('/').map((v) => v.trim());
        if (!owner || !repo) return;
        onSearch(owner, repo, since);
      }}
    >
      <input
        className="repo-input"
        placeholder="Repository (예: facebook/react)"
        value={repoPath}
        onChange={(e) => setRepoPath(e.target.value)}
        required
      />
      <select
        className="repo-since"
        value={since}
        onChange={(e) => setSince(Number(e.target.value))}
      >
        <option value={14}>14일</option>
        <option value={30}>30일</option>
        <option value={90}>90일</option>
        <option value={180}>180일</option>
        <option value={365}>1년</option>
        <option value={0}>전체</option>
      </select>
      <button type="submit" className="primary-btn">
        최근 커밋 보기
      </button>
    </form>
  );
}

