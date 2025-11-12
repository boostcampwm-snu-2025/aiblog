import type { Activity } from '../types';

export default function ActivityItem({ item }: { item: Activity }) {
  if (item.kind === 'commit') {
    return (
      <div style={{ border:'1px solid #e5e7eb', borderRadius:8, padding:12 }}>
        <div style={{ fontWeight:600 }}>[Commit] {item.title}</div>
        <div style={{ fontSize:12, color:'#555' }}>
          {item.author} • {new Date(item.date).toLocaleString()}
        </div>
        <a href={item.url} target="_blank">보기</a>
        <div style={{ fontSize:12, marginTop:6, whiteSpace:'pre-wrap' }}>{item.message}</div>
      </div>
    );
  }
  return (
    <div style={{ border:'1px solid #e5e7eb', borderRadius:8, padding:12 }}>
      <div style={{ fontWeight:600 }}>[PR #{item.number}] {item.title}</div>
      <div style={{ fontSize:12, color:'#555' }}>
        {item.author} • {item.state.toUpperCase()} • {new Date(item.date).toLocaleString()}
      </div>
      <a href={item.url} target="_blank">보기</a>
    </div>
  );
}
