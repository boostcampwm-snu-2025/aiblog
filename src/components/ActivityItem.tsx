import { useState } from 'react';
import type { Activity } from '../types';
import { generateBlog, type BlogGenerationResponse } from '../lib/api';
import { useDarkMode } from '../hooks/useDarkMode';

type Props = {
  item: Activity;
  owner?: string;
  repo?: string;
  onBlogGenerate?: (blogData: BlogGenerationResponse['data']) => void;
};

export default function ActivityItem({ item, owner, repo, onBlogGenerate }: Props) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDarkMode = useDarkMode();

  const handleGenerateBlog = async () => {
    if (!owner || !repo || item.kind !== 'commit') return;

    try {
      setGenerating(true);
      setError(null);

      const response = await generateBlog(owner, repo, item.sha!);

      if (response.success && response.data) {
        onBlogGenerate?.(response.data);
      } else {
        setError(response.error || '블로그 생성에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err?.message || '블로그 생성 중 오류가 발생했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  if (item.kind === 'commit') {
    return (
      <div style={{
        border: isDarkMode ? '1px solid #444' : '1px solid #e5e7eb',
        borderRadius: 8,
        padding: 12,
        backgroundColor: isDarkMode ? '#1e1e1e' : 'transparent'
      }}>
        <div style={{ fontWeight: 600, color: isDarkMode ? '#e5e7eb' : 'inherit' }}>[Commit] {item.title}</div>
        <div style={{ fontSize: 12, color: isDarkMode ? '#999' : '#555' }}>
          {item.author} • {new Date(item.date).toLocaleString()}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
          <a href={item.url} target="_blank" style={{ color: isDarkMode ? '#5BA3F5' : '#0066cc' }}>보기</a>
          {owner && repo && (
            <button
              onClick={handleGenerateBlog}
              disabled={generating}
              style={{
                padding: '4px 12px',
                fontSize: 12,
                borderRadius: 4,
                border: '1px solid #0066cc',
                backgroundColor: generating ? '#ccc' : '#0066cc',
                color: 'white',
                cursor: generating ? 'not-allowed' : 'pointer',
              }}
            >
              {generating ? '생성 중...' : '블로그 생성'}
            </button>
          )}
        </div>
        {error && <div style={{ fontSize: 12, color: 'crimson', marginTop: 8 }}>{error}</div>}
        <div style={{ fontSize:12, marginTop:6, whiteSpace:'pre-wrap' }}>{item.message}</div>
      </div>
    );
  }
  return (
    <div style={{
      border: isDarkMode ? '1px solid #444' : '1px solid #e5e7eb',
      borderRadius: 8,
      padding: 12,
      backgroundColor: isDarkMode ? '#1e1e1e' : 'transparent'
    }}>
      <div style={{ fontWeight: 600, color: isDarkMode ? '#e5e7eb' : 'inherit' }}>[PR #{item.number}] {item.title}</div>
      <div style={{ fontSize: 12, color: isDarkMode ? '#999' : '#555' }}>
        {item.author} • {item.state.toUpperCase()} • {new Date(item.date).toLocaleString()}
      </div>
      <a href={item.url} target="_blank" style={{ color: isDarkMode ? '#5BA3F5' : '#0066cc' }}>보기</a>
    </div>
  );
}
