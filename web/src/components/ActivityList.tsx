// web/src/components/ActivityList.tsx
import { useEffect, useState } from 'react';
import type { Activity } from '../types';

type Props = {
  items: Activity[];
  onSelect?: (ids: string[]) => void;
};

export function ActivityList({ items, onSelect }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((s: string[]) =>
      s.includes(id) ? s.filter((x: string) => x !== id) : [...s, id]
    );
  }

  useEffect(() => {
    onSelect?.(selected);
  }, [selected, onSelect]);

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
