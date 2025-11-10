export default function CommitCard({ c, onSelect, onSummarize }) {
  const author = c.author?.user?.login || c.author?.name || 'unknown';
  return (
    <div className="item">
      <div>
        <div><strong>{c.messageHeadline}</strong></div>
        <div className="badge">{author} • {new Date(c.committedDate).toISOString().slice(0,10)}</div>
      </div>
      <div style={{display:'flex', gap:8}}>
        <button className="btn secondary" onClick={()=>onSelect(c)}>Open</button>
        <button className="btn" onClick={()=>onSummarize(c)}>Generate Summary</button>
      </div>
    </div>
  );
}
