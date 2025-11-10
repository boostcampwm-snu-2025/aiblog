import './CommitList.css';

function CommitList({ activities, onSelectCommit, selectedCommit }) {
  if (activities.length === 0) {
    return null;
  }

  return (
    <div className="commit-list-container">
      <h2>Recent Commits</h2>
      <div className="commit-list">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`commit-card ${selectedCommit?.id === activity.id ? 'selected' : ''}`}
            onClick={() => onSelectCommit(activity)}
          >
            <div className="commit-header">
              <h3 className="commit-title">
                {activity.type === 'commit' ? activity.message : `#${activity.number} ${activity.title}`}
              </h3>
              <span className="commit-type-badge">
                {activity.type === 'commit' ? '📝 Commit' : '🔀 PR'}
              </span>
            </div>
            <div className="commit-meta">
              <span className="commit-author">{activity.author}</span>
              <span className="commit-date">
                {new Date(activity.date).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <button
              className="generate-btn"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: AI 요약 생성 (다음 주)
                alert('AI 요약 기능은 다음 주에 구현됩니다!');
              }}
            >
              Generate Summary
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommitList;
