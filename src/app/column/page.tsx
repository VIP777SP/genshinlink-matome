'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// コラムカテゴリーの型定義
type ColumnCategory = '全て' | 'キャラクター関連' | 'ゲーム情報' | '攻略テクニック' | 'イベント情報';

// コラム記事の型定義
type ColumnArticle = {
  id: string;
  title: string;
  category: ColumnCategory;
  thumbnail: string;
  description: string;
  date: string;
  url: string;
};

// コラム記事データ
const columnArticles: ColumnArticle[] = [
  {
    id: 'character-element-guide',
    title: '元素反応完全ガイド：最強の組み合わせとコツ',
    category: 'ゲーム情報',
    thumbnail: '/images/placeholder.svg',
    description: '原神の元素反応システムを徹底解説。各元素の特性と相性、実戦での活用法まで。初心者から上級者まで役立つ情報が満載です。',
    date: '2024-02-26',
    url: '/column/game-info/element-reactions'
  },
  {
    id: 'abyss-guide-3-5',
    title: '【Ver.3.5】深境螺旋12層攻略法',
    category: '攻略テクニック',
    thumbnail: '/images/placeholder.svg',
    description: '最新の深境螺旋12層を9星クリアするためのチーム編成とローテーション解説。各階の敵の特性と対策を詳しく紹介します。',
    date: '2024-02-24',
    url: '/column/guides/abyss-3-5'
  },
  {
    id: 'upcoming-characters',
    title: '【リーク情報】今後実装予定のキャラクター',
    category: 'キャラクター関連',
    thumbnail: '/images/placeholder.svg',
    description: '信頼性の高い情報源から集めた、今後実装予定のキャラクター情報をまとめました。元素、武器タイプ、役割予想などを解説します。',
    date: '2024-02-22',
    url: '/column/character/upcoming'
  },
  {
    id: 'lantern-rite-guide',
    title: '【イベント】熾玮の節祭り完全攻略',
    category: 'イベント情報',
    thumbnail: '/images/placeholder.svg',
    description: '熾玮の節祭りイベントの効率的な攻略法と報酬入手方法。限定アイテムのコンプリート方法や隠し要素も紹介します。',
    date: '2024-02-20',
    url: '/column/events/lantern-rite'
  },
  {
    id: 'best-team-comps',
    title: '最強メタチーム編成ランキング【2024年版】',
    category: '攻略テクニック',
    thumbnail: '/images/placeholder.svg',
    description: '現在のメタで最強とされるチーム編成を解説。各チームの運用方法、必要なキャラクターと代替案、長所と短所を詳しく紹介します。',
    date: '2024-02-18',
    url: '/column/guides/meta-teams'
  },
  {
    id: 'character-build-tips',
    title: 'キャラクタービルドの基本とよくある間違い',
    category: 'キャラクター関連',
    thumbnail: '/images/placeholder.svg',
    description: 'キャラクターの適切な育成方法と最適化のコツ。聖遺物の選び方、ステータスの優先順位、よくある誤解について解説します。',
    date: '2024-02-15',
    url: '/column/character/build-basics'
  }
];

export default function ColumnPage() {
  const [selectedCategory, setSelectedCategory] = useState<ColumnCategory>('全て');

  // カテゴリーでフィルタリング
  const filteredArticles = selectedCategory === '全て'
    ? columnArticles
    : columnArticles.filter(article => article.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-700 dark:text-amber-500">
          【原神コラム】
        </h1>
      </div>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        原神に関する様々な情報や攻略情報をコラム形式でお届けします。キャラクター攻略からイベント情報、ゲームのコツまで幅広く解説しています。
      </p>

      {/* カテゴリーフィルター */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-medium text-gray-700 dark:text-gray-300">カテゴリー：</span>
          {(['全て', 'キャラクター関連', 'ゲーム情報', '攻略テクニック', 'イベント情報'] as ColumnCategory[]).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-200 dark:hover:bg-amber-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 記事一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredArticles.map(article => (
          <Link
            key={article.id}
            href={article.url}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                {article.category}
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {article.date}
              </div>
            </div>
            <div className="p-4 flex-grow">
              <h2 className="text-xl font-bold text-amber-700 dark:text-amber-400 mb-2 line-clamp-2">
                {article.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                {article.description}
              </p>
            </div>
            <div className="px-4 py-3 bg-amber-50 dark:bg-gray-700/50 text-amber-600 dark:text-amber-300 text-sm flex justify-end items-center border-t border-gray-100 dark:border-gray-700">
              続きを読む <i className="fas fa-chevron-right ml-2"></i>
            </div>
          </Link>
        ))}
      </div>

      {/* 記事がない場合 */}
      {filteredArticles.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-md border border-gray-200 dark:border-gray-700">
          <i className="fas fa-newspaper text-4xl text-amber-400 mb-4"></i>
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">記事が見つかりません</h2>
          <p className="text-gray-600 dark:text-gray-400">
            選択されたカテゴリーの記事はまだ公開されていません。<br />
            他のカテゴリーをお試しいただくか、後日再度ご確認ください。
          </p>
        </div>
      )}

      {/* 注意書き */}
      <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30 text-sm text-gray-600 dark:text-gray-400">
        <p className="flex items-center">
          <i className="fas fa-info-circle text-amber-500 mr-2"></i>
          掲載されているコラム記事は、公式情報および信頼できる情報源に基づいて作成していますが、ゲームのアップデートにより内容が変更される場合があります。
        </p>
      </div>
    </div>
  );
} 