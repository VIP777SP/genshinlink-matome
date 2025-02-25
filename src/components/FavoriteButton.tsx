'use client';

import { useState } from 'react';
import { useFavorites } from './FavoritesContext';

type FavoriteButtonProps = {
  id: string;
  title: string;
  url: string;
  category: string;
};

export default function FavoriteButton({ id, title, url, category }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleFavorite = () => {
    setIsAnimating(true);
    
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite({ id, title, url, category });
    }
    
    // アニメーション用タイマー
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const favorited = isFavorite(id);

  return (
    <button
      onClick={toggleFavorite}
      className={`
        relative flex items-center justify-center 
        w-10 h-10 rounded-full
        ${favorited ? 'bg-amber-100' : 'bg-gray-100'} 
        hover:bg-amber-200 transition-all duration-300
        ${isAnimating ? 'scale-125' : 'scale-100'}
      `}
      aria-label={favorited ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      <i 
        className={`
          fas fa-star text-lg
          ${favorited ? 'text-amber-500' : 'text-gray-400'}
          ${isAnimating ? 'animate-ping' : ''}
        `} 
      />
      
      {/* ツールチップ */}
      <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        {favorited ? 'お気に入りから削除' : 'お気に入りに追加'}
      </span>
    </button>
  );
} 