import { ReactNode, useState, useEffect } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

type Props = {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
};

export default function TwoColumnLayout({ leftPanel, rightPanel }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const isDarkMode = useDarkMode();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: 20,
      marginTop: 16,
      height: isMobile ? 'auto' : 'calc(100vh - 200px)',
      minHeight: isMobile ? 'auto' : 600
    }}>
      {/* 왼쪽 패널: 커밋 목록 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
        borderRadius: 8,
        border: isDarkMode ? '1px solid #444' : '1px solid #e5e7eb',
        minHeight: isMobile ? 400 : 'auto'
      }}>
        <div style={{
          padding: '12px 16px',
          borderBottom: isDarkMode ? '1px solid #444' : '1px solid #e5e7eb',
          backgroundColor: isDarkMode ? '#2a2a2a' : '#f9fafb',
          fontWeight: 600,
          fontSize: 14,
          color: isDarkMode ? '#e5e7eb' : '#374151'
        }}>
          📋 커밋 목록
        </div>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 12
        }}>
          {leftPanel}
        </div>
      </div>

      {/* 오른쪽 패널: 블로그 미리보기 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
        borderRadius: 8,
        border: isDarkMode ? '1px solid #444' : '1px solid #e5e7eb',
        minHeight: isMobile ? 400 : 'auto'
      }}>
        <div style={{
          padding: '12px 16px',
          borderBottom: isDarkMode ? '1px solid #444' : '1px solid #e5e7eb',
          backgroundColor: isDarkMode ? '#2a2a2a' : '#f9fafb',
          fontWeight: 600,
          fontSize: 14,
          color: isDarkMode ? '#e5e7eb' : '#374151'
        }}>
          📝 블로그 미리보기
        </div>
        <div style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {rightPanel}
        </div>
      </div>
    </div>
  );
}
