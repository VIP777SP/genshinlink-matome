'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 検索結果の型定義
type SearchResult = {
  title: string;
  description?: string;
  url: string;
  category: string;
};

// 検索バープロパティの型定義
interface SearchBarProps {
  compact?: boolean; // コンパクトモード（ナビバー用）
}

// ダミーの検索データ
// 実際のアプリケーションでは、これをAPIコールなどで取得するか
// 各ページのデータを統合して検索できるようにします
const searchData: SearchResult[] = [
  { title: 'おすすめ便利サイト', category: 'リンク集', url: '/recsite' },
  { title: 'おすすめコミュニティ', category: 'リンク集', url: '/reccommunity' },
  { title: 'おすすめYoutuber', category: 'リンク集', url: '/recyoutuber' },
  { title: 'キャラ攻略', category: 'コンテンツ', url: '/characters' },
  { title: '聖遺物攻略', category: 'コンテンツ', url: '/artifacts' },
  { title: 'マップ情報', category: 'コンテンツ', url: '/maps' },
  { title: 'イベント情報', category: 'コンテンツ', url: '/events' },
  { title: 'パーティー編成', category: 'コンテンツ', url: '/teams' },
  { title: 'ニュース', category: 'コンテンツ', url: '/news' },
  // 各ページ内のリンクなども検索対象に含めることができます
];

export default function SearchBar({ compact = false }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // クリックイベントリスナーの追加
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // キーボード操作のハンドラ
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    // 矢印キーで検索結果間を移動
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // 検索実行の関数
  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    
    if (value.trim() === '') {
      setResults([]);
      setIsOpen(false);
      return;
    }
    
    // 検索クエリに一致する結果をフィルタリング
    const filteredResults = searchData.filter(item => {
      // タイトルと説明を検索
      const titleMatch = item.title.toLowerCase().includes(value.toLowerCase());
      const descMatch = item.description?.toLowerCase().includes(value.toLowerCase()) || false;
      
      return titleMatch || descMatch;
    }).slice(0, 10); // 最大10件表示
    
    setResults(filteredResults);
    setIsOpen(filteredResults.length > 0);
  }, []);
  
  // フォーム送信時のハンドラ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedIndex >= 0 && results[selectedIndex]) {
      // 選択された結果のURLに遷移
      router.push(results[selectedIndex].url);
      setIsOpen(false);
      setQuery('');
    } else if (query.trim() !== '') {
      // 検索ページに遷移
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder={compact ? "検索" : "検索..."}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className={`w-full ${compact ? 'px-3 py-1' : 'px-4 py-2'} pl-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 text-gray-800 dark:text-gray-200 ${compact ? 'text-sm' : ''}`}
            onFocus={() => query.trim() !== '' && setIsOpen(true)}
            ref={inputRef}
            onKeyDown={handleKeyDown}
          />
          <div className={`absolute ${compact ? 'left-2' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400`}>
            <i className="fas fa-search"></i>
          </div>
          {query && (
            <button
              type="button"
              className={`absolute ${compact ? 'right-2' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300`}
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              aria-label="検索クリア"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </form>
      
      {/* 検索結果ドロップダウン */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-[60vh] overflow-y-auto">
          {results.length > 0 ? (
            <ul>
              {results.map((result, index) => (
                <li key={index}>
                  <Link
                    href={result.url}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={`block px-4 py-2 hover:bg-amber-100/70 dark:hover:bg-amber-800/30 ${
                      index === selectedIndex ? 'bg-amber-100/90 dark:bg-amber-800/50' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-800 dark:text-gray-200">{result.title}</div>
                    {result.description && !compact && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{result.description}</div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-gray-600 dark:text-gray-400">
              <p>「{query}」の検索結果はありません</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 