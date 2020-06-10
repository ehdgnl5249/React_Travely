// https://usehooks.com/useLocalStorage/
import { useState } from "react";

export function getStorageItem(key, initialValue) {
  try {
    // Get from local storage by key
    const item = window.localStorage.getItem(key); // key 이름으로 가져옴
    // Parse stored json or if none return initialValue
    return item ? JSON.parse(item) : initialValue; // 값이 있다면 json으로 파싱
  } catch (error) {
    // If error also return initialValue
    console.log(error);
    return initialValue;
  }
}
export function setStorageItem(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value)); // 저장
  } catch (error) {
    console.log(error);
  }
}

// Hook
function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    return getStorageItem(key, initialValue);
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.

  const setValue = value => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore); // 상태값 반영
    setStorageItem(key, valueToStore); // 로컬스토리지 반영
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
