'use client';

import { useState, useEffect, useRef } from 'react';

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
  const [typingSound] = useState<HTMLAudioElement | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // 音声の初期化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 実際にはここで音声を読み込みます
      // setTypingSound(new Audio('/sounds/typing.mp3'));
    }

    // クリックイベントリスナーの追加
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

  // タイピング音声の再生
  const playTypingSound = () => {
    if (typingSound) {
      typingSound.currentTime = 0;
      typingSound.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  // 検索ロジック
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    playTypingSound();

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
    <div className="relative w-full max-w-md mx-auto my-4" ref={searchRef}>
      {/* 検索入力エリア */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => query.trim() !== '' && setIsOpen(true)}
          placeholder="検索..."
          className="w-full p-2 pl-10 pr-4 rounded-full border-2 border-orange-300 focus:border-orange-500 focus:outline-none transition-all duration-300 shadow-md"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500">
          <i className="fas fa-search"></i>
        </div>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {/* 検索結果 */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-orange-300 overflow-hidden transition-all duration-300 max-h-80 overflow-y-auto">
          <div className="p-2">
            <h3 className="text-sm text-gray-500 mb-2">検索結果: {results.length}件</h3>
            <ul>
              {results.map((result, index) => (
                <li key={index}>
                  <a
                    href={result.href}
                    className="block p-2 hover:bg-orange-100 rounded transition-colors duration-200 flex items-center"
                  >
                    <span className="bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mr-2">
                      <i className="fas fa-link"></i>
                    </span>
                    <div>
                      <div className="text-orange-700 font-medium">{result.title}</div>
                      <div className="text-xs text-gray-500">{result.category}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 検索結果がない場合 */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-orange-300 p-4 text-center">
          <div className="text-gray-500">
            <i className="fas fa-search fa-2x mb-2"></i>
            <p>「{query}」に一致する結果はありませんでした</p>
          </div>
        </div>
      )}
    </div>
  );
} 