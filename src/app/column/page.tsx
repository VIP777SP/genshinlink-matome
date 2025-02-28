'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import FavoriteButton from '@/components/FavoriteButton';
import CommentSection from '@/components/CommentSection';

// 記事カテゴリーの定義
type ArticleCategory = 'お役立ちサイト' | 'コミュニティ' | 'YouTuber' | '攻略情報' | 'ゲーム情報';

// 記事の型定義
type Article = {
  id: string;
  title: string;
  description: string;
  category: ArticleCategory;
  thumbnail?: string;
  url: string;
  date: string;
  featured?: boolean;
  views?: number;
};

// お役立ちサイト、コミュニティ、YouTuber情報
const externalResources: Article[] = [];

// コラム記事
const articles: Article[] = [
  {
    id: 'beginners-guide-2024',
    title: '【2024年版】原神 初心者向け完全攻略ガイド',
    description: '冒険ランク上げから効率的な育成方法まで、新規プレイヤー向けの総合ガイドです。',
    category: '攻略情報',
    thumbnail: '/images/articles/beginners-guide.jpg',
    url: '/column/beginners-guide-2024',
    date: '2024-02-27',
    views: 12500
  },
  {
    id: 'spiral-abyss-guide',
    title: '【4.5版】深境螺旋完全攻略ガイド',
    description: '深境螺旋の各階の敵構成とおすすめパーティー、攻略のコツを詳しく解説します。',
    category: '攻略情報',
    thumbnail: '/images/articles/spiral-abyss.jpg',
    url: '/column/spiral-abyss-guide',
    date: '2024-02-27',
    views: 15800
  },
  {
    id: 'elemental-reactions',
    title: '元素反応完全ガイド',
    description: '全ての元素反応の仕組みとダメージ計算式、効果的な活用方法を解説します。',
    category: '攻略情報',
    thumbnail: '/images/articles/elemental-reactions.jpg',
    url: '/column/elemental-reactions',
    date: '2024-02-25',
    views: 13200
  },
  {
    id: 'team-compositions',
    title: '最強パーティー編成ガイド',
    description: '元素共鳴や相性を考慮した効果的なパーティー編成のコツと、環境別のおすすめ編成をご紹介します。',
    category: '攻略情報',
    thumbnail: '/images/articles/team-compositions.jpg',
    url: '/teams',
    date: '2024-02-28',
    featured: true,
    views: 14200
  },
  {
    id: 'recommended-youtubers',
    title: '【2024年版】原神攻略におすすめのYouTuber',
    description: 'キャラクター解説や深境螺旋攻略など、参考になる動画を投稿している優良YouTuberをご紹介します。',
    category: 'YouTuber',
    thumbnail: '/images/articles/youtubers.jpg',
    url: '/recyoutuber',
    date: '2024-02-27',
    featured: true,
    views: 8500
  },
  {
    id: 'recommended-communities',
    title: '【2024年版】原神コミュニティガイド',
    description: '最新情報の入手や他プレイヤーとの交流に役立つ、おすすめのコミュニティサイトをご紹介します。',
    category: 'コミュニティ',
    thumbnail: '/images/articles/communities.jpg',
    url: '/reccommunity',
    date: '2024-02-27',
    featured: true,
    views: 7800
  }
];

// カテゴリー別の色設定
const categoryColors: Record<ArticleCategory, { bg: string; text: string; darkBg: string; darkText: string }> = {
  'お役立ちサイト': { 
    bg: 'bg-blue-100', 
    text: 'text-blue-800', 
    darkBg: 'dark:bg-blue-900/30', 
    darkText: 'dark:text-blue-300' 
  },
  'コミュニティ': { 
    bg: 'bg-green-100', 
    text: 'text-green-800', 
    darkBg: 'dark:bg-green-900/30', 
    darkText: 'dark:text-green-300' 
  },
  'YouTuber': { 
    bg: 'bg-red-100', 
    text: 'text-red-800', 
    darkBg: 'dark:bg-red-900/30', 
    darkText: 'dark:text-red-300' 
  },
  '攻略情報': { 
    bg: 'bg-amber-100', 
    text: 'text-amber-800', 
    darkBg: 'dark:bg-amber-900/30', 
    darkText: 'dark:text-amber-300' 
  },
  'ゲーム情報': { 
    bg: 'bg-purple-100', 
    text: 'text-purple-800', 
    darkBg: 'dark:bg-purple-900/30', 
    darkText: 'dark:text-purple-300' 
  }
};

export default function ColumnPage() {
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 選択されたカテゴリーに基づいて記事をフィルタリング
  const filteredArticles = selectedCategory === 'all' 
    ? [...articles, ...externalResources]
    : [...articles, ...externalResources].filter(article => article.category === selectedCategory);

  // おすすめ記事（featuredがtrueの記事）
  const featuredArticles = [...articles, ...externalResources].filter(article => article.featured);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-700 dark:text-amber-500 mb-2">コラム</h1>
          <p className="text-gray-600 dark:text-gray-300">
            原神の攻略情報、お役立ちサイト、コミュニティ情報など、冒険に役立つ情報をお届けします。
          </p>
        </div>
        <FavoriteButton 
          id="column-page"
          title="コラム"
          url="/column"
          category="記事"
        />
      </div>

      {/* おすすめ記事セクション */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-500 mb-6 flex items-center">
          <i className="fas fa-star mr-2"></i>おすすめ記事
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <Link 
              key={article.id}
              href={article.url}
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-amber-200/30 dark:border-amber-800/30"
            >
              {/* サムネイル画像 */}
              <div className="relative h-48 overflow-hidden">
                {article.thumbnail ? (
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600"></div>
                )}
                {/* カテゴリーバッジ */}
                <div className={`absolute top-2 left-2 px-3 py-1 rounded-full ${categoryColors[article.category].bg} ${categoryColors[article.category].text}`}>
                  {article.category}
                </div>
              </div>
              
              {/* 記事情報 */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{new Date(article.date).toLocaleDateString('ja-JP')}</span>
                  {article.views && <span><i className="fas fa-eye mr-1"></i>{article.views.toLocaleString()}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* カテゴリーフィルター */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
            }`}
          >
            すべて
          </button>
          {Object.keys(categoryColors).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as ArticleCategory)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 記事一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Link 
            key={article.id}
            href={article.url}
            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-amber-200/30 dark:border-amber-800/30"
          >
            {/* サムネイル画像 */}
            <div className="relative h-48 overflow-hidden">
              {article.thumbnail ? (
                <Image
                  src={article.thumbnail}
                  alt={article.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600"></div>
              )}
              {/* カテゴリーバッジ */}
              <div className={`absolute top-2 left-2 px-3 py-1 rounded-full ${categoryColors[article.category].bg} ${categoryColors[article.category].text}`}>
                {article.category}
              </div>
            </div>
            
            {/* 記事情報 */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                {article.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{new Date(article.date).toLocaleDateString('ja-JP')}</span>
                {article.views && <span><i className="fas fa-eye mr-1"></i>{article.views.toLocaleString()}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* コメントセクション */}
      <div className="mt-12">
        <CommentSection pageId="column-page" />
      </div>
    </div>
  );
} 