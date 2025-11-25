import { useDarkMode } from '../hooks/useDarkMode';
import type { ViewMode } from '../types';

interface Props {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function Header({ currentView, onViewChange }: Props) {
  const isDarkMode = useDarkMode();

  const buttonStyle = (isActive: boolean) => ({
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: isActive ? 600 : 400,
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: isActive
      ? (isDarkMode ? '#0066cc' : '#0066cc')
      : (isDarkMode ? '#2a2a2a' : '#f3f4f6'),
    color: isActive
      ? '#fff'
      : (isDarkMode ? '#e5e7eb' : '#333'),
    transition: 'all 0.3s ease',
    outline: 'none',
  });

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
      borderBottom: isDarkMode ? '1px solid #444' : '1px solid #e5e7eb',
      marginBottom: 0,
    }}>
      <h1 style={{
        fontSize: 24,
        fontWeight: 700,
        margin: 0,
        color: isDarkMode ? '#e5e7eb' : '#111',
      }}>
        SmartBlog — GitHub 연동
      </h1>

      <div style={{
        display: 'flex',
        gap: 12,
        backgroundColor: isDarkMode ? '#1a1a1a' : '#f9fafb',
        padding: 6,
        borderRadius: 10,
        border: isDarkMode ? '1px solid #333' : '1px solid #e5e7eb',
      }}>
        <button
          onClick={() => onViewChange('commits')}
          style={buttonStyle(currentView === 'commits')}
          onMouseEnter={(e) => {
            if (currentView !== 'commits') {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#333' : '#e5e7eb';
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== 'commits') {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#2a2a2a' : '#f3f4f6';
            }
          }}
        >
          📊 커밋 분석
        </button>
        <button
          onClick={() => onViewChange('blogs')}
          style={buttonStyle(currentView === 'blogs')}
          onMouseEnter={(e) => {
            if (currentView !== 'blogs') {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#333' : '#e5e7eb';
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== 'blogs') {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#2a2a2a' : '#f3f4f6';
            }
          }}
        >
          📚 블로그 목록
        </button>
      </div>
    </div>
  );
}
