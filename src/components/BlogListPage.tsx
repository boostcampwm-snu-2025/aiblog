import { useEffect, useState } from 'react';
import { fetchBlogList, type BlogListResponse } from '../lib/api';
import { useDarkMode } from '../hooks/useDarkMode';
import BlogDetailModal from './BlogDetailModal';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<BlogListResponse['items']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
  });
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const isDarkMode = useDarkMode();

  useEffect(() => {
    loadBlogs(page);
  }, [page]);

  const loadBlogs = async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchBlogList(pageNum, 10);
      setBlogs(response.items);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || '블로그 목록을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && blogs.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        color: isDarkMode ? '#999' : '#666'
      }}>
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        color: 'crimson'
      }}>
        에러: {error}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        color: isDarkMode ? '#999' : '#666',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          아직 게시된 블로그가 없습니다
        </div>
        <div style={{ fontSize: 14 }}>
          커밋을 분석하여 첫 번째 블로그를 생성해보세요!
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 24,
        marginTop: 0,
        color: isDarkMode ? '#e5e7eb' : '#111'
      }}>
        게시된 블로그 ({pagination.total}개)
      </h2>

      <div style={{ display: 'grid', gap: 16 }}>
        {blogs.map(blog => (
          <div
            key={blog.id}
            onClick={() => setSelectedBlogId(blog.id)}
            style={{
              padding: 20,
              border: isDarkMode ? '1px solid #444' : '1px solid #e5e7eb',
              borderRadius: 8,
              backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0066cc';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = isDarkMode
                ? '0 4px 12px rgba(0, 102, 204, 0.2)'
                : '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isDarkMode ? '#444' : '#e5e7eb';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 8,
              color: isDarkMode ? '#e5e7eb' : '#111'
            }}>
              {blog.title}
            </h3>

            {blog.summary && (
              <p style={{
                fontSize: 14,
                color: isDarkMode ? '#aaa' : '#666',
                marginBottom: 12,
                lineHeight: 1.5
              }}>
                {blog.summary}
              </p>
            )}

            <div style={{
              display: 'flex',
              gap: 16,
              fontSize: 13,
              color: isDarkMode ? '#888' : '#666'
            }}>
              <div>
                👤 {blog.author}
              </div>
              <div>
                📂 {blog.owner}/{blog.repo}
              </div>
              <div>
                🔗 <code style={{
                  backgroundColor: isDarkMode ? '#2a2a2a' : '#f3f4f6',
                  padding: '2px 6px',
                  borderRadius: 3,
                  fontFamily: 'monospace',
                  fontSize: 12
                }}>
                  {blog.commitSha.substring(0, 7)}
                </code>
              </div>
              {blog.publishedAt && (
                <div style={{ marginLeft: 'auto' }}>
                  📅 {new Date(blog.publishedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
          marginTop: 32
        }}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              borderRadius: 6,
              border: isDarkMode ? '1px solid #444' : '1px solid #d1d5db',
              backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
              color: page === 1 ? (isDarkMode ? '#555' : '#ccc') : (isDarkMode ? '#e5e7eb' : '#333'),
              cursor: page === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            이전
          </button>
          <span style={{ color: isDarkMode ? '#e5e7eb' : '#333' }}>
            {page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              borderRadius: 6,
              border: isDarkMode ? '1px solid #444' : '1px solid #d1d5db',
              backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
              color: page === pagination.totalPages ? (isDarkMode ? '#555' : '#ccc') : (isDarkMode ? '#e5e7eb' : '#333'),
              cursor: page === pagination.totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            다음
          </button>
        </div>
      )}

      {/* 블로그 상세 모달 */}
      {selectedBlogId && (
        <BlogDetailModal
          blogId={selectedBlogId}
          onClose={() => setSelectedBlogId(null)}
          onDeleted={() => {
            setSelectedBlogId(null);
            loadBlogs(page); // 목록 새로고침
          }}
        />
      )}
    </div>
  );
}
