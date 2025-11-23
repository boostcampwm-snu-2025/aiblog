import { useAppContext } from '../contexts/AppContext';
import './ActivityList.css';

function ActivityList() {
  // ========== Context에서 필요한 상태와 함수 가져오기 ==========
  const { activities, repoInfo, selectedActivity, selectActivity } = useAppContext();

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
          <div
            key={activity.id}
            className={`activity-item ${selectedActivity?.id === activity.id ? 'selected' : ''}`}
            onClick={() => selectActivity(activity)}
          >
            <div className="activity-type-badge">
              {activity.type === 'commit' ? '📝 커밋' : '🔀 PR'}
            </div>

            {activity.type === 'commit' ? (
              <div className="activity-content">
                <p className="activity-message">{activity.message}</p>
                <div className="activity-meta">
                  <span className="author">{activity.author}</span>
                  <span className="date">
                    {new Date(activity.date).toLocaleString('ko-KR')}
                  </span>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityList;