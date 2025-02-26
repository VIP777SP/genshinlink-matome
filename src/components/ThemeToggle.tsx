'use client';

import { useTheme } from './ThemeContext';
import { useState, useId } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const toggleId = useId(); // 一意のIDを生成
  
  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <div className="relative z-10">
      {/* 非表示のチェックボックス - アクセシビリティのために存在 */}
      <input
        type="checkbox"
        id={toggleId}
        checked={theme === 'dark'}
        onChange={handleToggle}
        className="opacity-0 absolute h-0 w-0"
        aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
      />
      
      {/* トグルラベル */}
      <label
        htmlFor={toggleId}
        className={`
          relative block w-12 h-6 rounded-full cursor-pointer
          transition-colors duration-300 ease-in-out
          shadow-inner shadow-gray-400/40
          ${theme === 'dark' ? 'bg-slate-600' : 'bg-slate-400'}
        `}
      >
        {/* トグルボール */}
        <span 
          className={`
            absolute top-0.5 w-5 h-5 rounded-full
            transition-all duration-300 ease-in-out flex items-center justify-center
            ${isAnimating ? 'animate-pulse' : ''}
            ${theme === 'dark' 
              ? 'bg-cyan-400 left-[calc(100%-1.375rem)]' 
              : 'bg-yellow-400 left-0.5'}
            shadow-md
          `}
        >
          {/* アイコン */}
          {theme === 'dark' ? (
            <i className="fas fa-moon text-xs text-slate-800"></i>
          ) : (
            <span className="text-sm font-bold text-amber-600">☀</span>
          )}
        </span>
      </label>
    </div>
  );
} 