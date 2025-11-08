import { useState } from 'react';
export function RepoForm({ onSearch }:{ onSearch:(owner:string,repo:string)=>void }){
  const [owner,setOwner] = useState('');
  const [repo,setRepo] = useState('');
  return (
    <form className="repo-form" onSubmit={e=>{e.preventDefault(); onSearch(owner.trim(), repo.trim());}}>
      <input placeholder="owner" value={owner} onChange={e=>setOwner(e.target.value)} required />
      <span>/</span>
      <input placeholder="repo" value={repo} onChange={e=>setRepo(e.target.value)} required />
      <button type="submit">불러오기</button>
    </form>
  );
}