import type { Activity } from '../types';

interface Props {
  items: Activity[];
  selectedId?: string | null;
  generatingId?: string | null;
  onGenerate: (item: Activity) => void;
}

export function ActivityList({
  items,
  selectedId,
  generatingId,
  onGenerate,
}: Props) {
  if (!items.length) return <div className="empty">최근 작업이 없습니다.</div>;

  return (
    <div className="list">
      {items.map((it) => {
        const isSelected = it.id === selectedId;
        const isGenerating = it.id === generatingId;
        return (
          <div
            key={it.id}
            className={`item-card${isSelected ? ' item-card--selected' : ''}`}
          >
            <div className="item-card-main">
              <div className="item-card-title-row">
                <span className={`badge ${it.type}`}>{it.type.toUpperCase()}</span>
                <a
                  href={it.url}
                  target="_blank"
                  rel="noreferrer"
                  className="item-card-title"
                >
                  {it.title}
                </a>
              </div>
              <div className="item-card-meta">
                <span>
                  {new Date(it.committedAt).toLocaleDateString()} · {it.author}
                </span>
                {it.branch && <span className="branch"> · 🌿 {it.branch}</span>}
              </div>
            </div>
            <button
              className="generate-btn"
              onClick={() => onGenerate(it)}
              disabled={isGenerating}
            >
              {isGenerating ? '요약 생성 중…' : 'Generate Summary'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

