import './SavedBlogsList.css';

function SavedBlogsList({ savedBlogs, deleteBlog, isLoading }) {

  const handleDelete = (id, title) => {
    if (window.confirm(`"${title}" 블로그를 삭제하시겠습니까?`)) {
      deleteBlog(id);
    }
  };

  const handleView = (blog) => {
    // 블로그 내용을 새 창으로 보여주기
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <html>
        <head>
          <title>${blog.title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
              line-height: 1.6;
            }
            h1 { color: #333; }
            pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
            code { background: #f5f5f5; padding: 2px 5px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <h1>${blog.title}</h1>
          <p><small>생성일: ${new Date(blog.createdAt).toLocaleString('ko-KR')}</small></p>
          <hr />
          <pre>${blog.content}</pre>
        </body>
      </html>
    `);
  };

  if (isLoading) {
    return (
      <div className="saved-blogs-list">
        <h3>💾 저장된 블로그</h3>
        <p className="loading-text">불러오는 중...</p>
      </div>
    );
  }

  if (savedBlogs.length === 0) {
    return (
      <div className="saved-blogs-list">
        <h3>💾 저장된 블로그</h3>
        <p className="empty-text">아직 저장된 블로그가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="saved-blogs-list">
      <h3>💾 저장된 블로그 ({savedBlogs.length})</h3>
      <div className="blogs-grid">
        {savedBlogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            <div className="blog-card-header">
              <span className="blog-type-badge">
                {blog.activityType === 'commit' ? '📝' : '🔀'}
              </span>
              <h4 className="blog-card-title">{blog.title}</h4>
            </div>

            <div className="blog-card-meta">
              {blog.repoInfo && (
                <span className="repo-info">
                  📁 {blog.repoInfo.owner}/{blog.repoInfo.repo}
                </span>
              )}
              <span className="created-date">
                🕐 {new Date(blog.createdAt).toLocaleDateString('ko-KR')}
              </span>
            </div>

            <div className="blog-card-actions">
              <button
                className="btn-view"
                onClick={() => handleView(blog)}
                title="블로그 보기"
              >
                보기
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(blog.id, blog.title)}
                title="삭제"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedBlogsList;
