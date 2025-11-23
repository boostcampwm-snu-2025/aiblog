import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAppContext } from '../contexts/AppContext';
import './BlogPost.css';

function BlogPost({ onSave }) {
  // ========== Context에서 필요한 상태와 함수 가져오기 ==========
  const { generatedBlog, closeBlog } = useAppContext();

  const [isSaved, setIsSaved] = useState(false);

  if (!generatedBlog) {
    return (
      <div className="blog-post-empty">
        <p>📝 커밋이나 PR을 선택하고 "블로그 생성" 버튼을 클릭하세요</p>
      </div>
    );
  }

  const blog = generatedBlog;

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

  const handleSave = () => {
    onSave();
    setIsSaved(true);
  };

  return (
    <div className="blog-post">
      <div className="blog-post-header">
        <h2>{blog.title}</h2>
        <button className="close-btn" onClick={closeBlog} title="닫기">
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
        <button
          className={isSaved ? "btn-saved" : "btn-save"}
          onClick={handleSave}
          disabled={isSaved}
        >
          {isSaved ? '✅ 저장됨' : '💾 저장하기'}
        </button>
      </div>
    </div>
  );
}

export default BlogPost;
