import { useState } from 'react';

type Props = { onSubmit: (owner: string, repo: string) => void };

export default function RepoInput({ onSubmit }: Props) {
  const [text, setText] = useState('facebook/react');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [owner, repo] = text.split('/');
    if (!owner || !repo) return alert('owner/repo 형태로 입력하세요');
    onSubmit(owner, repo);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', gap:8 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="owner/repo"
        style={{ padding:8, width:280 }}
      />
      <button type="submit">불러오기</button>
    </form>
  );
}
