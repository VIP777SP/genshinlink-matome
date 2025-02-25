'use client';

import { useState, useEffect } from 'react';
import { useFavorites, FavoriteItem } from '@/components/FavoritesContext';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [playRemoveSound] = useState<HTMLAudioElement | null>(null);

  // ページがマウントされたことを確認
  useEffect(() => {
    setMounted(true);
  }, []);

  // お気に入りリストをソート
  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortBy === 'date') {
      return b.addedAt - a.addedAt;
    }
    return a.title.localeCompare(b.title);
  });

  // カテゴリーでフィルタリング
  const filteredFavorites = filter === 'all' 
    ? sortedFavorites 
    : sortedFavorites.filter(fav => fav.category === filter);

  // カテゴリのユニークリストを取得
  const categories = [...new Set(favorites.map(fav => fav.category))];

  // お気に入りから削除
  const handleRemove = (id: string) => {
    // サウンド再生
    if (playRemoveSound) {
      playRemoveSound.currentTime = 0;
      playRemoveSound.play().catch(e => console.log('Audio play failed:', e));
    }
    removeFavorite(id);
  };

  if (!mounted) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-700">お気に入り</h1>
      
      {favorites.length === 0 ? (
        <div className="bg-amber-50 p-8 rounded-lg shadow text-center">
          <i className="fas fa-star-half-alt text-amber-400 text-5xl mb-4"></i>
          <h2 className="text-xl font-semibold mb-2">お気に入りはまだありません</h2>
          <p className="text-gray-600 mb-4">
            サイト内のコンテンツを閲覧して、気に入ったページをお気に入りに追加してください。
          </p>
          <Link 
            href="/" 
            className="inline-block bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      ) : (
        <>
          {/* フィルターとソートコントロール */}
          <div className="flex flex-col md:flex-row justify-between mb-6 bg-white p-4 rounded-lg shadow">
            <div className="mb-4 md:mb-0">
              <label className="mr-2 font-medium">カテゴリー:</label>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-amber-50 border border-amber-300 rounded px-3 py-1"
              >
                <option value="all">すべて表示</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="mr-2 font-medium">並び替え:</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
                className="bg-amber-50 border border-amber-300 rounded px-3 py-1"
              >
                <option value="date">追加日順</option>
                <option value="name">名前順</option>
              </select>
            </div>
          </div>
          
          {/* お気に入りリスト */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFavorites.map((favorite) => (
              <div 
                key={favorite.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-amber-200"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">
                      {favorite.category}
                    </span>
                    <button
                      onClick={() => handleRemove(favorite.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="お気に入りから削除"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold mt-2 mb-2 text-orange-700">
                    {favorite.title}
                  </h3>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-500">
                      {new Date(favorite.addedAt).toLocaleDateString('ja-JP')}
                    </span>
                    
                    <Link
                      href={favorite.url}
                      className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm hover:bg-orange-700 transition-colors"
                    >
                      訪問する
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 