import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useDarkMode } from '../hooks/useDarkMode';
import { fetchBlogDetail, deleteBlog, type BlogDetailResponse } from '../lib/api';

interface Props {
  blogId: string;
  onClose: () => void;
  onDeleted?: () => void;
}

export default function BlogDetailModal({ blogId, onClose, onDeleted }: Props) {
  const isDarkMode = useDarkMode();
  const [blog, setBlog] = useState<BlogDetailResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadBlogDetail();
  }, [blogId]);

  const loadBlogDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchBlogDetail(blogId);
      if (response.success && response.data) {
        setBlog(response.data);
      } else {
        setError(response.error || '블로그를 불러올 수 없습니다.');
      }
    } catch (err: any) {
      setError(err.message || '블로그를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('이 블로그를 삭제하시겠습니까?')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await deleteBlog(blogId);
      if (response.success) {
        alert('블로그가 삭제되었습니다.');
        onDeleted?.();
        onClose();
      } else {
        alert(`삭제 실패: ${response.error}`);
      }
    } catch (err: any) {
      alert(`블로그 삭제 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  // 모달 배경 클릭 시 닫기
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackgroundClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        style={{
          backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
          borderRadius: 12,
          maxWidth: 900,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* 헤더 */}
        <div style={{
          padding: '16px 24px',
          borderBottom: isDarkMode ? '1px solid #444' : '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 600,
            margin: 0,
            color: isDarkMode ? '#e5e7eb' : '#111',
          }}>
            블로그 상세 보기
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '6px 12px',
              fontSize: 18,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: isDarkMode ? '#999' : '#666',
            }}
          >
            ✕
          </button>
        </div>

        {/* 본문 */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: 24,
        }}>
          {loading && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200,
              color: isDarkMode ? '#999' : '#666',
            }}>
              로딩 중...
            </div>
          )}

          {error && (
            <div style={{
              padding: 20,
              backgroundColor: isDarkMode ? '#2a1a1a' : '#fee',
              borderRadius: 8,
              color: 'crimson',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          {!loading && !error && blog && (
            <>
              <h1 style={{
                fontSize: 28,
                fontWeight: 700,
                marginTop: 0,
                marginBottom: 16,
                color: isDarkMode ? '#e5e7eb' : '#111',
              }}>
                {blog.title}
              </h1>

              {/* 메타데이터 */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 16,
                padding: 16,
                backgroundColor: isDarkMode ? '#2a2a2a' : '#f9fafb',
                borderRadius: 8,
                marginBottom: 24,
                fontSize: 13,
                color: isDarkMode ? '#999' : '#666',
              }}>
                <div>👤 {blog.author}</div>
                <div>📂 {blog.owner}/{blog.repo}</div>
                <div>
                  🔗 <code style={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#f3f4f6',
                    padding: '2px 6px',
                    borderRadius: 3,
                    fontFamily: 'monospace',
                    fontSize: 12,
                  }}>
                    {blog.commitSha.substring(0, 7)}
                  </code>
                </div>
                {blog.publishedAt && (
                  <div>📅 {new Date(blog.publishedAt).toLocaleString()}</div>
                )}
                {blog.stats && (
                  <div>
                    📊 +{blog.stats.additions} -{blog.stats.deletions}
                  </div>
                )}
              </div>

              {/* Markdown 내용 */}
              <div style={{
                lineHeight: 1.7,
                color: isDarkMode ? '#d4d4d4' : '#333',
              }}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({ className, children }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code style={{
                          backgroundColor: isDarkMode ? '#2a2a2a' : '#f3f4f6',
                          padding: '2px 6px',
                          borderRadius: 3,
                          fontFamily: 'monospace',
                          fontSize: '0.9em',
                        }}>
                          {children}
                        </code>
                      ) : (
                        <code style={{
                          display: 'block',
                          backgroundColor: isDarkMode ? '#0d1117' : '#1e1e1e',
                          color: isDarkMode ? '#c9d1d9' : '#e6edf3',
                          padding: 16,
                          borderRadius: 6,
                          fontFamily: 'monospace',
                          fontSize: '0.9em',
                          overflowX: 'auto',
                          whiteSpace: 'pre',
                        }}>
                          {children}
                        </code>
                      );
                    },
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: isDarkMode ? '#5BA3F5' : '#0066cc',
                          textDecoration: 'none',
                        }}
                      >
                        {children}
                      </a>
                    ),
                    h1: ({ children }) => (
                      <h1 style={{ color: isDarkMode ? '#e5e7eb' : '#111', marginTop: 24 }}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 style={{ color: isDarkMode ? '#e5e7eb' : '#111', marginTop: 20 }}>
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 style={{ color: isDarkMode ? '#e5e7eb' : '#111', marginTop: 16 }}>
                        {children}
                      </h3>
                    ),
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>
            </>
          )}
        </div>

        {/* 푸터 (버튼들) */}
        {!loading && !error && blog && (
          <div style={{
            padding: '16px 24px',
            borderTop: isDarkMode ? '1px solid #444' : '1px solid #e5e7eb',
            display: 'flex',
            gap: 12,
            justifyContent: 'flex-end',
          }}>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 6,
                border: 'none',
                backgroundColor: deleting ? (isDarkMode ? '#3a1a1a' : '#fee') : (isDarkMode ? '#5a1a1a' : '#dc2626'),
                color: '#fff',
                cursor: deleting ? 'not-allowed' : 'pointer',
                opacity: deleting ? 0.6 : 1,
              }}
            >
              {deleting ? '삭제 중...' : '🗑️ 삭제하기'}
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 6,
                border: isDarkMode ? '1px solid #444' : '1px solid #d1d5db',
                backgroundColor: isDarkMode ? '#2a2a2a' : '#f9fafb',
                color: isDarkMode ? '#e5e7eb' : '#333',
                cursor: 'pointer',
              }}
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
