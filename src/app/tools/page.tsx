'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import FavoriteButton from '@/components/FavoriteButton';
import CommentSection from '@/components/CommentSection';

type Tool = {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  bgColor: string;
  category: '計算ツール' | 'ゲーム攻略' | '情報整理';
  new?: boolean;
};

const tools: Tool[] = [
  // 計算ツール
  {
    id: 'calculator',
    name: '素材計算機',
    description: 'キャラクターや武器育成に必要な素材を一目で把握。レアリティや目標レベルに応じた必要素材を計算します。',
    icon: 'fa-calculator',
    href: '/calculator',
    bgColor: 'from-blue-500 to-cyan-600',
    category: '計算ツール'
  },
  
  // ゲーム攻略
  {
    id: 'calendar',
    name: '攻略カレンダー',
    description: '曜日ごとの効率的な素材集めガイド。領域解放日やイベント日程をカレンダー形式で確認できます。',
    icon: 'fa-calendar-alt',
    href: '/calendar',
    bgColor: 'from-green-500 to-emerald-600',
    category: 'ゲーム攻略'
  },
  {
    id: 'maps',
    name: 'マップ',
    description: 'テイワット大陸の収集ポイントを詳細に表示。宝箱や特産品、鉱石などの効率的な収集ルートを提案します。',
    icon: 'fa-map',
    href: '/maps',
    bgColor: 'from-amber-500 to-orange-600',
    category: 'ゲーム攻略'
  },
  
  // 情報整理
  {
    id: 'tiermaker',
    name: 'Tierメーカー',
    description: '自分だけのキャラクターと武器のTierリストを作成。強さや好みに応じた独自のランク付けを共有できます。',
    icon: 'fa-list-ol',
    href: '/tiermaker',
    bgColor: 'from-purple-500 to-indigo-600',
    category: '情報整理',
    new: true
  }
];

// カテゴリーでグループ化
const groupedTools = tools.reduce((acc, tool) => {
  acc[tool.category] = acc[tool.category] || [];
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, Tool[]>);

export default function ToolsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-700 dark:text-amber-500 mb-2">便利ツール集</h1>
          <p className="text-gray-600 dark:text-gray-300">
            原神の冒険をもっと楽しく、効率的にするためのツール集です。
          </p>
        </div>
        <FavoriteButton 
          id="tools-page"
          title="便利ツール集"
          url="/tools"
          category="ツール"
        />
      </div>

      {/* 背景装飾 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-1/3 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/3 w-80 h-80 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute left-1/2 top-2/3 w-64 h-64 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* カテゴリーごとにツールを表示 */}
      <div className="space-y-12">
        {Object.entries(groupedTools).map(([category, categoryTools]) => (
          <div key={category} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-amber-200/30 dark:border-amber-800/30">
            <h2 className="text-xl font-bold mb-6 text-amber-700 dark:text-amber-400 border-b border-amber-200/50 dark:border-amber-800/30 pb-2">
              {/* カテゴリーに応じたアイコン */}
              <i className={`fas ${
                category === '計算ツール' ? 'fa-calculator' : 
                category === 'ゲーム攻略' ? 'fa-gamepad' : 
                'fa-layer-group'
              } mr-2`}></i>
              {category}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryTools.map((tool) => (
                <Link 
                  key={tool.id}
                  href={tool.href}
                  className={`
                    relative overflow-hidden rounded-xl shadow-md group
                    hover:shadow-lg transition-all duration-300 hover:-translate-y-1
                    bg-gradient-to-r ${tool.bgColor} text-white
                    flex flex-col p-5 h-full
                  `}
                >
                  {/* NEW バッジ */}
                  {tool.new && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      NEW
                    </div>
                  )}
                  
                  {/* 装飾円 */}
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full transform group-hover:scale-150 transition-transform duration-500"></div>
                  
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white/20 rounded-lg mr-4">
                      <i className={`fas ${tool.icon} text-2xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold">{tool.name}</h3>
                  </div>
                  
                  <p className="text-white/90 flex-grow mb-4">{tool.description}</p>
                  
                  <div className="flex justify-end mt-2">
                    <span className="flex items-center group-hover:translate-x-1 transition-transform">
                      ツールを開く <i className="fas fa-arrow-right ml-2"></i>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 今後追加予定のツール */}
      <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl shadow-md border border-amber-200/50 dark:border-amber-800/30">
        <h2 className="text-xl font-bold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
          <i className="fas fa-tools mr-2"></i>
          今後追加予定のツール
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          より便利に原神を楽しめるよう、新機能を続々と開発中です。今後追加を予定しているツールをご紹介します。
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'ビルドシミュレーター', icon: 'fa-sliders-h', desc: 'キャラクターの聖遺物と武器の組み合わせを試せるシミュレーター' },
            { name: 'イベントリマインダー', icon: 'fa-bell', desc: 'イベント開始やレジンの回復をお知らせする通知機能' },
            { name: 'アチーブメントトラッカー', icon: 'fa-check-square', desc: '達成すべき目標を管理し、効率的に原石を集められるツール' },
          ].map((item, index) => (
            <div key={index} className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-amber-100 dark:border-amber-900/30">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-amber-500/20 dark:bg-amber-500/30 rounded-full flex items-center justify-center mr-3">
                  <i className={`fas ${item.icon} text-amber-600 dark:text-amber-400`}></i>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200">{item.name}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* コメントセクション */}
      <div className="mt-12">
        <CommentSection pageId="tools-page" />
      </div>
    </div>
  );
} 