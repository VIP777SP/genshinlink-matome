'use client';

import { useTheme } from './ThemeContext';
import { useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative rounded-full p-2
        transition-all duration-500 ease-in-out
        ${theme === 'dark' ? 'bg-orange-700' : 'bg-amber-300'}
        ${isAnimating ? 'animate-pulse' : ''}
      `}
      aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
    >
      <div className="relative w-6 h-6">
        {/* 太陽アイコン */}
        <div 
          className={`
            absolute inset-0 
            transition-all duration-500 ease-in-out
            ${theme === 'dark' 
              ? 'opacity-0 rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100'}
          `}
        >
          <i className="fas fa-sun text-amber-600"></i>
        </div>
        
        {/* 月アイコン */}
        <div 
          className={`
            absolute inset-0 
            transition-all duration-500 ease-in-out
            ${theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'}
          `}
        >
          <i className="fas fa-moon text-amber-100"></i>
        </div>
      </div>
    </button>
  );
} 