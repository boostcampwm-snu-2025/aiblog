import { useState } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { useBlogList } from '../hooks/useBlogList';
import BlogDetailModal from './BlogDetailModal';

export default function BlogListPage() {
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isDarkMode = useDarkMode();

  // useBlogList 훅 사용
  const { blogs, allBlogs, isLoading, hasError, error, pagination, actions } = useBlogList({
    itemsPerPage: 10,
    searchQuery,
  });

  if (isLoading) {
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

  if (hasError && error) {
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

  // 실제로 블로그가 하나도 없는 경우
  if (allBlogs.length === 0) {
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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        gap: 16,
      }}>
        <h2 style={{
          fontSize: 24,
          fontWeight: 700,
          margin: 0,
          color: isDarkMode ? '#e5e7eb' : '#111'
        }}>
          게시된 블로그 ({pagination.totalItems}개)
        </h2>

        {/* 검색창 */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="제목, 내용, 커밋, 작성자로 검색..."
          style={{
            flex: 1,
            maxWidth: 400,
            padding: '10px 16px',
            fontSize: 14,
            border: isDarkMode ? '1px solid #444' : '1px solid #d1d5db',
            borderRadius: 8,
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
            color: isDarkMode ? '#e5e7eb' : '#333',
            outline: 'none',
          }}
        />
      </div>

      {/* 검색 결과가 없는 경우 */}
      {blogs.length === 0 && allBlogs.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
          color: isDarkMode ? '#999' : '#666',
          textAlign: 'center',
          padding: 40,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#f9fafb',
          borderRadius: 12,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            검색 결과가 없습니다
          </div>
          <div style={{ fontSize: 14 }}>
            다른 검색어를 입력해보세요
          </div>
        </div>
      )}

      {/* 블로그 목록 */}
      {blogs.length > 0 && (
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
      )}

      {/* 페이지네이션 */}
      {blogs.length > 0 && pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
          marginTop: 32
        }}>
          <button
            onClick={actions.prevPage}
            disabled={!pagination.hasPrev}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              borderRadius: 6,
              border: isDarkMode ? '1px solid #444' : '1px solid #d1d5db',
              backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
              color: !pagination.hasPrev ? (isDarkMode ? '#555' : '#ccc') : (isDarkMode ? '#e5e7eb' : '#333'),
              cursor: !pagination.hasPrev ? 'not-allowed' : 'pointer'
            }}
          >
            이전
          </button>
          <span style={{ color: isDarkMode ? '#e5e7eb' : '#333' }}>
            {pagination.currentPage} / {pagination.totalPages}
          </span>
          <button
            onClick={actions.nextPage}
            disabled={!pagination.hasNext}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              borderRadius: 6,
              border: isDarkMode ? '1px solid #444' : '1px solid #d1d5db',
              backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
              color: !pagination.hasNext ? (isDarkMode ? '#555' : '#ccc') : (isDarkMode ? '#e5e7eb' : '#333'),
              cursor: !pagination.hasNext ? 'not-allowed' : 'pointer'
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
          }}
        />
      )}
    </div>
  );
}
