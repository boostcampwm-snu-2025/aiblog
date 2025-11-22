/**
 * localStorage 유틸리티 함수
 * 데이터를 localStorage에 안전하게 저장/로드/삭제
 */

const STORAGE_PREFIX = 'aiblog_';

/**
 * localStorage에 데이터 저장
 */
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    const prefixedKey = STORAGE_PREFIX + key;
    const serialized = JSON.stringify(data);
    localStorage.setItem(prefixedKey, serialized);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    throw new Error('localStorage 저장에 실패했습니다.');
  }
}

/**
 * localStorage에서 데이터 로드
 */
export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const prefixedKey = STORAGE_PREFIX + key;
    const serialized = localStorage.getItem(prefixedKey);

    if (serialized === null) {
      return defaultValue;
    }

    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
}

/**
 * localStorage에서 데이터 삭제
 */
export function removeFromLocalStorage(key: string): void {
  try {
    const prefixedKey = STORAGE_PREFIX + key;
    localStorage.removeItem(prefixedKey);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

/**
 * localStorage 전체 초기화 (aiblog_ prefix만)
 */
export function clearAllLocalStorage(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * localStorage 사용 가능 여부 확인
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
