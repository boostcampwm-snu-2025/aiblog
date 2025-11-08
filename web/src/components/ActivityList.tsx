import { useEffect, useState } from 'react';
import type { Activity } from '../types';

export function ActivityList({
  items,
  onSelect,
}: {
  items: Activity[];
  onSelect?: (ids: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  useEffect(() => {
    onSelect?.(selected);
  }, [selected, onSelect]);

  if (!items.length) return <div className="empty">최근 작업이 없습니다.</div>;

  return (
    <div className="list">
      {items.map((it) => (
        <div key={it.id} className="item">
          <label>
            <input
              type="checkbox"
              checked={selected.includes(it.id)}
              onChange={() => toggle(it.id)}
            />
          </label>
          <span className={`badge ${it.type}`}>{it.type.toUpperCase()}</span>
          <a href={it.url} target="_blank" rel="noreferrer">
            {it.title}
          </a>
          <span className="meta">
            {new Date(it.committedAt).toLocaleString()} · {it.author}
          </span>
        </div>
      ))}
    </div>
  );
}
