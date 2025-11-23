import { usePosts } from '../components/PostsContext.jsx';

export default function SavedPosts() {
  const { state, actions } = usePosts();

  if (state.status === 'loading') return <div className="card">로딩 중...</div>;
  if (state.status === 'error')   return <div className="card" style={{color:'#b91c1c'}}>에러: {state.error}</div>;

  const list = state.items;

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Saved Posts (local)</h3>
      {list.length === 0 ? (
        <div className="badge">No posts</div>
      ) : (
        <div className="list">
          {list.map(p => (
            <div key={p.id} className="item">
              <div>
                <div><strong>{p.title}</strong></div>
                <div className="badge">{new Date(p.createdAt).toLocaleString()}</div>
                {p.sourceUrl && <a href={p.sourceUrl} target="_blank" rel="noreferrer">source ↗</a>}
              </div>
              <div style={{whiteSpace:'pre-wrap', margin:'6px 0'}}>{p.body}</div>
              <button className="btn secondary" onClick={()=>actions.remove(p.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
