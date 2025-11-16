import { useState, useEffect } from 'react';

/**
 * 시스템의 다크모드 설정을 감지하는 커스텀 훅
 */
export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 초기값: 시스템 다크모드 설정 확인
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 다크모드 변경 감지
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    // 이벤트 리스너 등록
    mediaQuery.addEventListener('change', handleChange);

    // 클린업
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isDarkMode;
}
