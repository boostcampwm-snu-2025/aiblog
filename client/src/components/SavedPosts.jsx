import { useEffect, useState } from 'react';
import { listPosts, deletePost } from '../api.js';

export default function SavedPosts() {
  const [posts, setPosts] = useState([]);
  async function load(){ setPosts(await listPosts()); }
  useEffect(()=>{ load(); }, []);

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Saved Posts</h3>
      <div className="list">
        {posts.map(p=>(
          <div key={p.id} className="item" style={{alignItems:'flex-start'}}>
            <div>
              <div><strong>{p.title}</strong></div>
              <div className="badge">{new Date(p.createdAt).toLocaleString()}</div>
              <p style={{marginTop:8, whiteSpace:'pre-wrap'}}>{p.body}</p>
              {p.sourceUrl && <a href={p.sourceUrl} target="_blank">source ↗</a>}
            </div>
            <button className="btn secondary" onClick={async()=>{ await deletePost(p.id); load(); }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
