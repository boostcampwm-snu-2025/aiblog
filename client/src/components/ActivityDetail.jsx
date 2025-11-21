import BlogPost from './BlogPost';
import './ActivityDetail.css';

function ActivityDetail({ activity, onGenerateBlog, isGenerating, generatedBlog, onCloseBlog }) {
  if (!activity && !generatedBlog) {
    return (
      <div className="activity-detail-empty">
        <div className="empty-content">
          <span className="empty-icon">📝</span>
          <h3>활동을 선택하세요</h3>
          <p>왼쪽에서 커밋이나 PR을 클릭하면 상세 정보가 표시됩니다</p>
        </div>
      </div>
    );
  }

  // 블로그가 생성되면 블로그를 보여줌
  if (generatedBlog) {
    return <BlogPost blog={generatedBlog} onClose={onCloseBlog} />;
  }

  // 선택된 활동의 상세 정보 표시
  return (
    <div className="activity-detail">
      <div className="detail-header">
        <div className="detail-type-badge">
          {activity.type === 'commit' ? '📝 커밋' : '🔀 PR'}
        </div>
        <h2>{activity.type === 'commit' ? activity.message : activity.title}</h2>
      </div>

      <div className="detail-meta">
        <div className="meta-item">
          <span className="meta-label">작성자</span>
          <span className="meta-value">{activity.author}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">날짜</span>
          <span className="meta-value">
            {new Date(activity.date).toLocaleString('ko-KR')}
          </span>
        </div>
        {activity.type === 'pull_request' && (
          <>
            <div className="meta-item">
              <span className="meta-label">PR 번호</span>
              <span className="meta-value">#{activity.number}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">상태</span>
              <span className={`pr-status ${activity.state}`}>
                {activity.state === 'open' ? '열림' : '닫힘'}
              </span>
            </div>
          </>
        )}
      </div>

      {activity.type === 'pull_request' && activity.body && (
        <div className="detail-body">
          <h3>PR 설명</h3>
          <pre>{activity.body}</pre>
        </div>
      )}

      <div className="detail-actions">
        <button
          className="btn-generate-blog"
          onClick={() => onGenerateBlog(activity)}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="btn-spinner"></span>
              블로그 생성 중...
            </>
          ) : (
            <>
              AI 블로그 생성
            </>
          )}
        </button>
        <a
          href={activity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-view-github"
        >
          GitHub에서 보기 →
        </a>
      </div>
    </div>
  );
}

export default ActivityDetail;
