type Props = {
  owner: string;
  repo: string;
  onOwnerChange: (owner: string) => void;
  onRepoChange: (repo: string) => void;
  onSubmit: (owner: string, repo: string) => void;
};

export default function RepoInput({ owner, repo, onOwnerChange, onRepoChange, onSubmit }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner) return alert('Owner를 입력하세요');
    onSubmit(owner, repo);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', gap:8, alignItems:'center' }}>
      <input
        value={owner}
        onChange={(e) => onOwnerChange(e.target.value)}
        placeholder="Owner"
        style={{ padding:8, width:140 }}
      />
      <span>/</span>
      <input
        value={repo}
        onChange={(e) => onRepoChange(e.target.value)}
        placeholder="Repository"
        style={{ padding:8, width:140 }}
      />
      <button type="submit">불러오기</button>
    </form>
  );
}
