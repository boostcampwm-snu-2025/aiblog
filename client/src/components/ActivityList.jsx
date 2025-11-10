import './ActivityList.css';

function ActivityList({ activities, repoInfo }) {
  if (activities.length === 0) {
    return null;
  }

  return (
    <div className="results">
      <h2>
        {repoInfo.owner}/{repoInfo.repo} 활동 내역
      </h2>
      <p className="results-count">총 {activities.length}개의 활동</p>

      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-type-badge">
              {activity.type === 'commit' ? '📝 커밋' : '🔀 PR'}
            </div>

            {activity.type === 'commit' ? (
              <>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <div className="activity-meta">
                    <span className="author">{activity.author}</span>
                    <span className="date">
                      {new Date(activity.date).toLocaleString('ko-KR')}
                    </span>
                  </div>
                </div>
                <a
                  href={activity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="activity-link"
                >
                  보기
                </a>
              </>
            ) : (
              <>
                <div className="activity-content">
                  <p className="activity-title">
                    #{activity.number} {activity.title}
                  </p>
                  <span className={`pr-state ${activity.state}`}>
                    {activity.state === 'open' ? '열림' : '닫힘'}
                  </span>
                  <div className="activity-meta">
                    <span className="author">{activity.author}</span>
                    <span className="date">
                      {new Date(activity.date).toLocaleString('ko-KR')}
                    </span>
                  </div>
                </div>
                <a
                  href={activity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="activity-link"
                >
                  보기
                </a>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityList;