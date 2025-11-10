import CommitCard from './CommitCard.jsx';

export default function CommitList({ commits = [], onSelect, onSummarize }) {
  const list = Array.isArray(commits) ? commits : [];
  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Recent Commits</h3>
      {list.length === 0 ? (
        <div className="badge">No commits</div>
      ) : (
        <div className="list">
          {list.map(c=>(
            <CommitCard key={c.oid} c={c} onSelect={onSelect} onSummarize={onSummarize} />
          ))}
        </div>
      )}
    </div>
  );
}
