import ReactMarkdown from 'react-markdown';
import './BlogPost.css';

function BlogPost({ blog, onClose }) {
  if (!blog) {
    return (
      <div className="blog-post-empty">
        <p>📝 커밋이나 PR을 선택하고 "블로그 생성" 버튼을 클릭하세요</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(blog.content);
    alert('블로그 내용이 복사되었습니다!');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([blog.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${blog.title}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="blog-post">
      <div className="blog-post-header">
        <h2>{blog.title}</h2>
        <button className="close-btn" onClick={onClose} title="닫기">
          ✕
        </button>
      </div>

      <div className="blog-post-meta">
        <span className="blog-created">
          🕐 생성 시각: {new Date(blog.createdAt).toLocaleString('ko-KR')}
        </span>
      </div>

      <div className="blog-post-content">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>

      <div className="blog-post-actions">
        <button className="btn-secondary" onClick={handleCopy}>
          📋 복사
        </button>
        <button className="btn-primary" onClick={handleDownload}>
          💾 다운로드
        </button>
      </div>
    </div>
  );
}

export default BlogPost;
