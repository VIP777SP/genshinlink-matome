'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

// お気に入りアイテムの型定義
export type FavoriteItem = {
  id: string;
  title: string;
  url: string;
  category: string;
  addedAt: number; // タイムスタンプ
};

// コンテキストの型定義
type FavoritesContextType = {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

// コンテキストの作成
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// プロバイダーコンポーネント
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  // お気に入りの状態管理
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期化時にローカルストレージから読み込み
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      setIsInitialized(true);
    }
  }, []);

  // お気に入りが変更されたらローカルストレージに保存
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, isInitialized]);

  // お気に入りに追加
  const addFavorite = (item: Omit<FavoriteItem, 'addedAt'>) => {
    if (!isFavorite(item.id)) {
      const newFavorite: FavoriteItem = {
        ...item,
        addedAt: Date.now()
      };
      
      // お気に入り追加効果音を再生
      const sound = new Audio('/sounds/favorite-add.mp3');
      sound.play().catch(e => console.log('Audio play failed:', e));
      
      setFavorites(prev => [...prev, newFavorite]);
    }
  };

  // お気に入りから削除
  const removeFavorite = (id: string) => {
    // お気に入り削除効果音を再生
    const sound = new Audio('/sounds/favorite-remove.mp3');
    sound.play().catch(e => console.log('Audio play failed:', e));
    
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  // お気に入りに含まれているか確認
  const isFavorite = (id: string) => {
    return favorites.some(item => item.id === id);
  };

  // コンテキスト値の作成
  const contextValue = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

// カスタムフック
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 