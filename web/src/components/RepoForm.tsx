import { useState } from 'react';

export function RepoForm({ onSearch }: { onSearch: (owner: string, repo: string, sinceDays: number) => void }) {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [since, setSince] = useState(90); // 기본 90일

  return (
    <form
      className="repo-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!owner.trim() || !repo.trim()) return;
        onSearch(owner.trim(), repo.trim(), since);
      }}
    >
      <input placeholder="owner" value={owner} onChange={(e) => setOwner(e.target.value)} required />
      <span>/</span>
      <input placeholder="repo" value={repo} onChange={(e) => setRepo(e.target.value)} required />
      <select value={since} onChange={(e) => setSince(Number(e.target.value))}>
        <option value={14}>14일</option>
        <option value={30}>30일</option>
        <option value={90}>90일</option>
        <option value={180}>180일</option>
        <option value={365}>1년</option>
        <option value={0}>전체</option>
      </select>
      <button type="submit">불러오기</button>
    </form>
  );
}
