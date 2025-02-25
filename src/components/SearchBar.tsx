'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSound } from './SoundService';

// 検索結果の型定義
type SearchResult = {
  title: string;
  subtitle?: string;
  href: string;
  category: string;
};

// ダミーの検索データ
// 実際のアプリケーションでは、これをAPIコールなどで取得するか
// 各ページのデータを統合して検索できるようにします
const searchData: SearchResult[] = [
  { title: 'おすすめ便利サイト', category: 'リンク集', href: '/recsite' },
  { title: 'おすすめコミュニティ', category: 'リンク集', href: '/reccommunity' },
  { title: 'おすすめYoutuber', category: 'リンク集', href: '/recyoutuber' },
  { title: 'キャラ攻略', category: 'コンテンツ', href: '/characters' },
  { title: '聖遺物攻略', category: 'コンテンツ', href: '/artifacts' },
  { title: 'マップ情報', category: 'コンテンツ', href: '/maps' },
  { title: 'イベント情報', category: 'コンテンツ', href: '/events' },
  { title: 'パーティー編成', category: 'コンテンツ', href: '/teams' },
  { title: 'ニュース', category: 'コンテンツ', href: '/news' },
  // 各ページ内のリンクなども検索対象に含めることができます
];

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playSound } = useSound();

  // クリックイベントリスナーの追加
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    // ESCキーで検索結果を閉じる
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  // 検索ロジック
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    playSound('typing');

    if (value.trim() === '') {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // 簡易検索ロジック（実際のアプリではもっと高度な検索を実装するとよいでしょう）
    const filtered = searchData.filter(item => 
      item.title.toLowerCase().includes(value.toLowerCase()) ||
      item.category.toLowerCase().includes(value.toLowerCase())
    );
    
    setResults(filtered);
    setIsOpen(true);
  };

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto my-2 sm:my-4" ref={searchRef}>
      {/* 検索入力エリア */}
      <div className={`
        relative rounded-full
        bg-black/20 backdrop-blur-sm
        overflow-hidden
        transition-all duration-300
        border-2 ${isFocused ? 'border-amber-400 shadow-lg shadow-amber-600/20' : 'border-white/30 shadow-md shadow-black/10'}
      `}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim() !== '') setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="検索..."
          className="w-full p-1.5 sm:p-2 pl-8 sm:pl-10 pr-4 rounded-full text-sm sm:text-base 
                    bg-transparent text-white placeholder-white/70 focus:outline-none"
          aria-label="サイト内検索"
        />
        <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-amber-300">
          <i className="fas fa-search text-sm sm:text-base"></i>
        </div>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              playSound('click');
            }}
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            aria-label="検索をクリア"
          >
            <i className="fas fa-times text-sm sm:text-base"></i>
          </button>
        )}
      </div>

      {/* 検索結果 */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 sm:mt-2 w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-amber-200 dark:border-amber-800/30 overflow-hidden transition-all duration-300 max-h-60 sm:max-h-80 overflow-y-auto">
          <div className="p-2 sm:p-3">
            <h3 className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-2 px-2">検索結果: {results.length}件</h3>
            <ul className="space-y-1">
              {results.map((result, index) => (
                <li key={index}>
                  <Link
                    href={result.href}
                    className="block p-2 rounded-lg transition-colors duration-200 flex items-center
                              hover:bg-amber-100 dark:hover:bg-amber-800/30 group"
                    onClick={() => {
                      setIsOpen(false);
                      playSound('click');
                    }}
                  >
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 
                                    text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 
                                    flex items-center justify-center mr-2 
                                    shadow-md shadow-amber-500/20
                                    group-hover:shadow-amber-500/40 transition-shadow">
                      <i className="fas fa-link text-xs"></i>
                    </span>
                    <div>
                      <div className="text-amber-700 dark:text-amber-300 font-medium text-sm sm:text-base group-hover:text-amber-800 dark:group-hover:text-amber-200 transition-colors">
                        {result.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{result.category}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 検索結果がない場合 */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute z-50 mt-1 sm:mt-2 w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-amber-200 dark:border-amber-800/30 p-3 sm:p-4 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <i className="fas fa-search fa-lg sm:fa-2x mb-1 sm:mb-2 text-amber-400/70"></i>
            <p className="text-sm sm:text-base">「{query}」に一致する結果はありませんでした</p>
          </div>
        </div>
      )}
    </div>
  );
} 