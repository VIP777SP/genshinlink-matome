import { useState, useEffect } from 'react';

// ローカルストレージを使用するためのカスタムフック
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // 状態の初期化
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // ローカルストレージからデータを取得
      const item = window.localStorage.getItem(key);
      // 保存されたデータがあればパースして返す、なければ初期値を返す
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 値を更新する関数
  const setValue = (value: T) => {
    try {
      // 関数として値を渡せるようにする（React の setState と同様）
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // 状態を更新
      setStoredValue(valueToStore);
      // ローカルストレージに保存
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // ウィンドウのストレージイベントをリッスンして、他のタブでの変更を検知
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [key]);

  return [storedValue, setValue];
} 