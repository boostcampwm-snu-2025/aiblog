import { useState } from 'react';

export default function RepoSearch({ onSearch }) {
  const [repo, setRepo] = useState('vercel/next.js');
  return (
    <div className="card">
      <input className="input" value={repo} onChange={e=>setRepo(e.target.value)} placeholder="owner/repo" />
      <div style={{marginTop:12}}>
        <button className="btn" onClick={()=>onSearch(repo)}>Load</button>
      </div>
    </div>
  );
}
