export default function PRList({ prs = [], onSelect, onSummarize }) {
  const list = Array.isArray(prs) ? prs : [];
  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Recent PRs</h3>
      {list.length === 0 ? <div className="badge">No PRs</div> : (
        <div className="list">
          {list.map(pr => (
            <div key={pr.number} className="item">
              <div>
                <div><strong>#{pr.number} {pr.title}</strong></div>
                <div className="badge">{new Date(pr.updatedAt).toISOString().slice(0,10)}</div>
              </div>
              <div style={{display:'flex', gap:8}}>
                <button className="btn secondary" onClick={()=>onSelect(pr)}>Open</button>
                <button className="btn" onClick={()=>onSummarize(pr)}>Generate Summary</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
