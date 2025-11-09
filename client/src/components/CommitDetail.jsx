import './CommitDetail.css';

function CommitDetail({ commit }) {
  if (!commit) {
    return (
      <div className="commit-detail-container">
        <div className="no-selection">
          <p>← 왼쪽에서 커밋을 선택해주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="commit-detail-container">
      <h2>Selected Commit</h2>
      <div className="commit-detail-card">
        <div className="detail-header">
          <h3 className="detail-title">
            {commit.type === 'commit' ? commit.message : `#${commit.number} ${commit.title}`}
          </h3>
          <div className="detail-meta">
            <span className="detail-author">{commit.author}</span>
            <span className="detail-date">
              {new Date(commit.date).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>

        <div className="ai-summary-section">
          <h4>AI Summary</h4>
          <div className="ai-summary-placeholder">
            <p>AI 요약 기능은 다음 주에 구현됩니다.</p>
            <p className="summary-hint">
              Generate Summary 버튼을 클릭하면 AI가 커밋 내용을 분석하여 자동으로 요약을 생성합니다.
            </p>
          </div>
        </div>

        <div className="detail-actions">
          <a
            href={commit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="view-github-btn"
          >
            View on GitHub →
          </a>
          <button
            className="save-blog-btn"
            onClick={() => {
              // TODO: 블로그 저장 기능 (다음 주)
              alert('블로그 저장 기능은 다음 주에 구현됩니다!');
            }}
          >
            Save as Blog Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommitDetail;
