'use client';

import CommentSection from "@/components/CommentSection";
import FavoriteButton from "@/components/FavoriteButton";
import { useState } from "react";
import { useSound } from "@/components/SoundService";

// サイトリンクデータ
const siteLinks = [
  {
    id: "official",
    title: "原神公式サイト",
    url: "https://genshin.mihoyo.com/ja/home",
    description: "原神の公式サイトは、ゲームの最新情報やアップデート内容を確認するための最適なサイトです。新キャラクターの情報やイベントの詳細も掲載されています。",
    category: "公式情報"
  },
  {
    id: "hoyolab",
    title: "HoYoLAB",
    url: "https://www.hoyolab.com/",
    description: "miHoYo社が運営するゲームコミュニティサイト。ユーザー同士の交流や、ゲーム内のアイテムが獲得できるデイリーチェックイン機能などが利用できます。",
    category: "公式情報"
  },
  {
    id: "honeyhunter",
    title: "Honey Hunter World",
    url: "https://genshin.honeyhunterworld.com/",
    description: "最新のキャラクターやアイテムに関する詳細なデータベース。アップデート前の新キャラクターの情報や、武器、聖遺物の性能値なども確認できます。",
    category: "データベース"
  },
  {
    id: "map",
    title: "原神インタラクティブマップ",
    url: "https://webstatic-sea.mihoyo.com/app/ys-map-sea/",
    description: "公式の詳細マップ。宝箱や鉱石、特産品の場所などが記載されており、探索に役立ちます。自分でマークを付けて管理することも可能です。",
    category: "攻略支援"
  },
  {
    id: "genshin-db",
    title: "Genshin DB",
    url: "https://genshin-db.net/",
    description: "日本語で利用できる原神データベース。武器、キャラクター、聖遺物などの情報が網羅されています。",
    category: "データベース"
  },
  {
    id: "genshin-optimizer",
    title: "Genshin Optimizer",
    url: "https://frzyc.github.io/genshin-optimizer/",
    description: "聖遺物の最適な組み合わせを計算するツール。自分が持っている聖遺物を入力し、キャラクターの最大ダメージを計算できます。",
    category: "攻略支援"
  },
  {
    id: "paimon-moe",
    title: "Paimon.moe",
    url: "https://paimon.moe/",
    description: "原神のプレイヤーをサポートする多機能ツール。願いのカウンター、キャラクタービルダー、ToDoリストなど様々な機能があります。",
    category: "攻略支援"
  },
  {
    id: "genshin-center",
    title: "Genshin Center",
    url: "https://genshin-center.com/",
    description: "樹脂計算機やアセンション素材の計算など、効率的な育成をサポートするツールが揃っています。",
    category: "攻略支援"
  }
];

export default function RecSite() {
  const [filter, setFilter] = useState("all");
  const { playSound } = useSound();
  
  // カテゴリ一覧を取得
  const categories = ["all", ...new Set(siteLinks.map(site => site.category))];
  
  // フィルター適用
  const filteredSites = filter === "all" 
    ? siteLinks 
    : siteLinks.filter(site => site.category === filter);

  return (
    <main className="max-w-4xl mx-auto relative">
      {/* 背景装飾パターン */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02] pointer-events-none overflow-hidden">
        {/* 直接SVGパターンを描画 */}
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="genshin-pattern-recsite" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              {/* 元素記号：風 */}
              <path d="M20,20 C25,15 35,15 40,20 C45,25 45,35 40,40 C35,45 25,45 20,40 C15,35 15,25 20,20 Z" 
                   fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              
              {/* 元素記号：岩 */}
              <path d="M70,20 L90,20 L80,40 Z" 
                   fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              
              {/* 元素記号：雷 */}
              <path d="M20,70 L25,80 L30,70 L35,90 L20,70" 
                   fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              
              {/* 元素記号：氷 */}
              <path d="M70,70 L90,70 M80,60 L80,80 M75,65 L85,75 M75,75 L85,65" 
                   fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              
              {/* 装飾的な円形 */}
              <circle cx="50" cy="50" r="20" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="#D4AF37" strokeWidth="0.3" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#genshin-pattern-recsite)"/>
        </svg>
        
        {/* カラフルなグラデーションの円 */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          {/* SVGロゴを直接描画 */}
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              {/* 外側円 */}
              <circle cx="50" cy="50" r="48" fill="none" stroke="#FFB13B" strokeWidth="2" opacity="0.9"/>
              
              {/* 内側円 */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#FFB13B" strokeWidth="1.5" opacity="0.7"/>
              
              {/* 十字の星模様 */}
              <path d="M50,10 L50,90 M10,50 L90,50 M25,25 L75,75 M25,75 L75,25" 
                    stroke="#FFB13B" strokeWidth="1.5" opacity="0.8" strokeLinecap="round"/>
              
              {/* 装飾的な円 */}
              <circle cx="50" cy="50" r="20" fill="none" stroke="#FFB13B" strokeWidth="1" opacity="0.6"/>
              
              {/* 中央のシンボル */}
              <circle cx="50" cy="50" r="10" fill="#FFB13B" opacity="0.8"/>
              <circle cx="50" cy="50" r="6" fill="#FFF5E6" opacity="0.9"/>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-500 drop-shadow-sm">
            【おすすめ便利サイト】
          </h1>
        </div>
        <FavoriteButton 
          id="recsite-page"
          title="おすすめ便利サイト"
          url="/recsite"
          category="リンク集"
        />
      </div>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        原神の攻略やゲーム情報を効率的に集めるための便利サイトをご紹介します。
        役立つ情報を活用して、テイワット大陸での冒険をより充実させましょう！
      </p>
      
      {/* カテゴリフィルター */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-gray-700 dark:text-gray-300 font-medium">カテゴリ:</span>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setFilter(category);
                playSound('click');
              }}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === category
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-200 dark:hover:bg-amber-900'
              }`}
            >
              {category === "all" ? "すべて表示" : category}
            </button>
          ))}
        </div>
      </div>

      {/* サイトリスト */}
      <div className="space-y-6">
        {filteredSites.map(site => (
          <section 
            key={site.id} 
            className="border border-amber-200 dark:border-amber-900 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 group"
          >
            <div className="flex justify-between">
              <a 
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound('click')}
                className="text-xl font-bold text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
              >
                {site.title} <i className="fas fa-external-link-alt text-sm ml-1"></i>
              </a>
              <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs px-2 py-1 rounded">
                {site.category}
              </span>
            </div>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{site.description}</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                URLを開く際は注意してください。リンク先の情報は変更されている可能性があります。
              </span>
              <FavoriteButton 
                id={`site-${site.id}`}
                title={site.title}
                url={site.url}
                category="便利サイト"
              />
            </div>
          </section>
        ))}
      </div>
      
      {/* コメントセクション */}
      <CommentSection pageId="recsite" />
    </main>
  );
} 