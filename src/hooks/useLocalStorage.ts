import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../lib/localStorage';

/**
 * localStorage와 동기화되는 상태를 관리하는 커스텀 훅
 * @param key - localStorage 키
 * @param initialValue - 초기값
 * @returns [value, setValue] 튜플
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // 초기 상태: localStorage에서 로드하거나 initialValue 사용
  const [storedValue, setStoredValue] = useState<T>(() => {
    return loadFromLocalStorage(key, initialValue);
  });

  // 값이 변경되면 localStorage에 저장
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 함수형 업데이트 지원
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      saveToLocalStorage(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 다른 탭/창에서 localStorage 변경 감지
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `aiblog_${key}` && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // JSON 파싱 실패 시 무시
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
