import type { Post } from '../api.types';

interface SavedPostListProps {
  posts: Post[];
  selectedId?: string | null;
  onSelect: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

export function SavedPostList({
  posts,
  selectedId,
  onSelect,
  onDelete,
}: SavedPostListProps) {
  if (!posts.length) {
    return <div className="empty">아직 저장된 블로그 글이 없습니다.</div>;
  }

  return (
    <div className="list">
      {posts.map((post) => {
        const isSelected = post.id === selectedId;
        return (
          <div
            key={post.id}
            className={`item-card saved-item${
              isSelected ? ' item-card--selected' : ''
            }`}
          >
            <div className="item-card-main">
              <div className="item-card-title-row">
                <span className="saved-badge">POST</span>
                <button
                  type="button"
                  className="link-button item-card-title"
                  onClick={() => onSelect(post)}
                >
                  {post.title}
                </button>
              </div>
              <div className="item-card-meta">
                {new Date(post.createdAt).toLocaleDateString()}
                {post.tags && post.tags.length > 0 && (
                  <span className="saved-tags">
                    {' '}
                    · {post.tags.join(', ')}
                  </span>
                )}
              </div>
            </div>
            {onDelete && (
              <button
                type="button"
                className="secondary-btn delete-btn"
                onClick={() => onDelete(post)}
              >
                삭제
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}


