import { customConsole } from "./console";

export const setLocalStorage = <T = unknown>(key: string, value: T) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    customConsole.error(`Error saving key "${key}" to localStorage:`, error);
  }
};

export const getLocalStorage = <T>(key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    customConsole.error(`Failed to get item with key "${key}":`, error);
    return null;
  }
};

export const removeLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    customConsole.error(`Error removing key "${key}" from localStorage:`, error);
  }
};

export const updateLocalStorage = <T extends object | string | number | boolean>(
  key: string,
  newValue: T extends object ? Partial<T> | T : T,
) => {
  try {
    const existingValue = getLocalStorage<T>(key);

    if (existingValue === null) {
      // 기존 값이 없으면 새 값을 그대로 저장
      setLocalStorage(key, newValue as T);
      return true;
    }

    let updatedValue: T;

    // T가 객체이고, 기존 값과 새 값 모두 객체 타입인 경우 병합(Merge)을 시도합니다.
    if (
      typeof existingValue === "object" &&
      existingValue !== null &&
      !Array.isArray(existingValue) &&
      typeof newValue === "object" &&
      newValue !== null &&
      !Array.isArray(newValue)
    ) {
      // Partial<T>를 사용하여 기존 객체와 새 객체를 병합합니다.
      updatedValue = { ...existingValue, ...(newValue as Partial<T>) } as T;
    } else {
      // 객체가 아니거나, 기존 값이 없었거나, 배열인 경우는 완전히 교체합니다.
      updatedValue = newValue as T;
    }

    setLocalStorage(key, updatedValue);
    return true;
  } catch (error) {
    customConsole.error(`Error updating key "${key}" in localStorage:`, error);
    return false;
  }
};
