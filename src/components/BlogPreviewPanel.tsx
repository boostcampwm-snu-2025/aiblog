import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { BlogGenerationResponse } from '../lib/api';
import { useDarkMode } from '../hooks/useDarkMode';

type Props = {
  blogData: BlogGenerationResponse['data'] | null;
  onPublish?: () => void;
  onCancel?: () => void;
};

export default function BlogPreviewPanel({ blogData, onPublish, onCancel }: Props) {
  const isDarkMode = useDarkMode();
  // 블로그 데이터가 없을 때
  if (!blogData) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: 400,
        padding: 32,
        color: isDarkMode ? '#999' : '#888',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          블로그를 생성해보세요
        </div>
        <div style={{ fontSize: 14 }}>
          커밋을 선택하고 "블로그 생성" 버튼을 클릭하세요
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* 블로그 내용 영역 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 24,
        backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
        border: isDarkMode ? '1px solid #444' : '1px solid #e5e7eb',
        borderRadius: 8
      }}>
        {/* 제목 */}
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 16,
          color: isDarkMode ? '#e5e7eb' : '#111'
        }}>
          {blogData.title}
        </h1>

        {/* 요약 */}
        {blogData.summary && (
          <div style={{
            padding: 16,
            backgroundColor: isDarkMode ? '#2a2a2a' : '#f3f4f6',
            borderLeft: '4px solid #0066cc',
            borderRadius: 4,
            marginBottom: 24,
            fontStyle: 'italic',
            color: isDarkMode ? '#bbb' : '#555'
          }}>
            {blogData.summary}
          </div>
        )}

        {/* 메타데이터 */}
        <div style={{
          display: 'flex',
          gap: 16,
          fontSize: 13,
          color: isDarkMode ? '#999' : '#666',
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: isDarkMode ? '1px solid #444' : '1px solid #e5e7eb'
        }}>
          <div>
            📝 작성자: <b>{blogData.metadata.author}</b>
          </div>
          <div>
            🔗 커밋: <code style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#f3f4f6', padding: '2px 6px', borderRadius: 3, color: isDarkMode ? '#e5e7eb' : 'inherit' }}>
              {blogData.metadata.commitSha.substring(0, 7)}
            </code>
          </div>
          <div>
            📂 파일: <b>{blogData.metadata.filesChanged.length}개</b>
          </div>
        </div>

        {/* Markdown 본문 */}
        <div style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: isDarkMode ? '#d4d4d4' : '#333'
        }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // 코드 블록 스타일링
              code: ({ node, className, children, ...props }) => {
                const isInline = !className;
                return isInline ? (
                  <code
                    style={{
                      backgroundColor: isDarkMode ? '#2a2a2a' : '#f3f4f6',
                      color: isDarkMode ? '#e5e7eb' : 'inherit',
                      padding: '2px 6px',
                      borderRadius: 3,
                      fontSize: '0.9em',
                      fontFamily: 'monospace'
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <code
                    className={className}
                    style={{
                      display: 'block',
                      backgroundColor: isDarkMode ? '#0d1117' : '#1e1e1e',
                      color: '#d4d4d4',
                      padding: 16,
                      borderRadius: 6,
                      overflow: 'auto',
                      fontSize: '0.9em',
                      fontFamily: 'monospace'
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              // 링크 스타일링
              a: ({ node, ...props }) => (
                <a
                  style={{ color: '#0066cc', textDecoration: 'underline' }}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              // 제목 스타일링
              h1: ({ node, ...props }) => (
                <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 32, marginBottom: 16 }} {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24, marginBottom: 12 }} {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 20, marginBottom: 10 }} {...props} />
              ),
              // 리스트 스타일링
              ul: ({ node, ...props }) => (
                <ul style={{ marginLeft: 20, marginBottom: 16 }} {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol style={{ marginLeft: 20, marginBottom: 16 }} {...props} />
              ),
              // 문단 스타일링
              p: ({ node, ...props }) => (
                <p style={{ marginBottom: 16 }} {...props} />
              ),
            }}
          >
            {blogData.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* 액션 버튼 영역 */}
      <div style={{
        display: 'flex',
        gap: 12,
        padding: 16,
        borderTop: isDarkMode ? '1px solid #444' : '1px solid #e5e7eb',
        backgroundColor: isDarkMode ? '#2a2a2a' : '#f9fafb'
      }}>
        <button
          onClick={onPublish}
          style={{
            flex: 1,
            padding: '12px 24px',
            fontSize: 15,
            fontWeight: 600,
            color: 'white',
            backgroundColor: '#0066cc',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052a3'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0066cc'}
        >
          ✅ 게시하기
        </button>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '12px 24px',
            fontSize: 15,
            fontWeight: 600,
            color: isDarkMode ? '#d1d5db' : '#666',
            backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
            border: isDarkMode ? '1px solid #555' : '1px solid #d1d5db',
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#2a2a2a' : '#f3f4f6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#1e1e1e' : 'white'}
        >
          ❌ 취소하기
        </button>
      </div>
    </div>
  );
}
