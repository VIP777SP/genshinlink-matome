'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // 初期化時にローカルストレージから読み込み
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // ローカルストレージからテーマを取得
      const savedTheme = localStorage.getItem('theme') as Theme;
      
      // システムの設定を確認
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // ローカルストレージに保存されていれば、それを使用
      // 保存されていなければデフォルトでライトモード
      // ただし、最初の訪問でシステム設定がダークならシステム設定を尊重
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      setTheme(initialTheme);
      
      setMounted(true);
    }
  }, []);

  // テーマが変更されたらローカルストレージに保存し、classを切り替え
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme);
      
      // HTMLのdata-themeを切り替え
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme, mounted]);

  // テーマを切り替える
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// カスタムフック
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 