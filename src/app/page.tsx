'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// カードの情報を配列として管理
const cards = [
  {
    href: "/recsite",
    title: "これであなたも原神マスター！？",
    subtitle: "【お役立ちサイト集】",
    element: "anemo", // 風元素
    gradientFrom: "from-teal-500",
    gradientTo: "to-emerald-600",
    hoverShadow: "hover:shadow-anemo"
  },
  {
    href: "/reccommunity",
    title: "原神ライフが充実する！",
    subtitle: "【原神関連コミュニティ集】",
    element: "geo", // 岩元素
    gradientFrom: "from-amber-500",
    gradientTo: "to-yellow-600",
    hoverShadow: "hover:shadow-geo"
  },
  {
    href: "/recyoutuber",
    title: "超タメになる！超面白い！！",
    subtitle: "【おすすめYoutuber集】",
    element: "pyro", // 火元素
    gradientFrom: "from-red-500",
    gradientTo: "to-orange-600",
    hoverShadow: "hover:shadow-pyro"
  },
  {
    href: "/characters",
    title: "キャラ育成の参考に！",
    subtitle: "【キャラ攻略】",
    element: "hydro", // 水元素
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-600",
    hoverShadow: "hover:shadow-hydro"
  },
  {
    href: "/artifacts",
    title: "最強の聖遺物を目指せ！",
    subtitle: "【聖遺物攻略】",
    element: "electro", // 雷元素
    gradientFrom: "from-purple-500",
    gradientTo: "to-indigo-600",
    hoverShadow: "hover:shadow-electro"
  },
  {
    href: "/maps",
    title: "効率的な素材集め！",
    subtitle: "【マップ情報】",
    element: "cryo", // 冰元素
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-600",
    hoverShadow: "hover:shadow-cryo"
  },
  {
    href: "/events",
    title: "イベントを見逃すな！",
    subtitle: "【イベント情報】",
    element: "hydro", // 水元素
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-600",
    hoverShadow: "hover:shadow-hydro"
  },
  {
    href: "/teams",
    title: "最強パーティーを組もう！",
    subtitle: "【パーティー編成】",
    element: "anemo", // 風元素
    gradientFrom: "from-teal-500",
    gradientTo: "to-emerald-600",
    hoverShadow: "hover:shadow-anemo"
  },
  {
    href: "/news",
    title: "最新情報をチェック！",
    subtitle: "【ニュース】",
    element: "pyro", // 火元素
    gradientFrom: "from-red-500",
    gradientTo: "to-orange-600",
    hoverShadow: "hover:shadow-pyro"
  },
  {
    href: "/tiermaker",
    title: "あなただけのTierリストを！",
    subtitle: "【Tierメーカー】",
    element: "dendro", // 草元素
    gradientFrom: "from-green-500",
    gradientTo: "to-lime-600",
    hoverShadow: "hover:shadow-dendro"
  }
];

// 注目のキャラクター
const featuredCharacters = [
  { 
    name: "雷電将軍", 
    image: "/images/characters/raiden-shogun.png", // アイコンからフルイラストに変更
    element: "electro" 
  },
  { 
    name: "胡桃", 
    image: "/images/characters/hutao.png", // アイコンからフルイラストに変更
    element: "pyro" 
  },
  { 
    name: "楓原万葉", 
    image: "/images/characters/kazuha.png", // アイコンからフルイラストに変更
    element: "anemo" 
  },
  { 
    name: "夜蘭", 
    image: "/images/characters/yelan.png", // アイコンからフルイラストに変更
    element: "hydro" 
  },
  { 
    name: "甘雨", 
    image: "/images/characters/ganyu.png", // アイコンからフルイラストに変更
    element: "cryo" 
  }
];

// 元素アイコンコンポーネント
const ElementIcon = ({ element }: { element: string }) => {
  const iconMap: Record<string, string> = {
    anemo: "wind-circle",
    geo: "mountain",
    pyro: "fire-flame-curved",
    hydro: "droplet",
    electro: "bolt-lightning",
    cryo: "snowflake",
    dendro: "leaf"
  };

  const colorMap: Record<string, string> = {
    anemo: "text-teal-300",
    geo: "text-yellow-300",
    pyro: "text-red-400",
    hydro: "text-blue-300",
    electro: "text-purple-300",
    cryo: "text-cyan-300",
    dendro: "text-green-300"
  };

  return (
    <div className={`absolute top-2 right-2 ${colorMap[element]} opacity-60 text-lg`}>
      <i className={`fas fa-${iconMap[element] || 'circle'}`}></i>
    </div>
  );
};

// 浮遊アニメーションコンポーネント
const FloatingElement = ({ children, delay = 0, scale = 1 }: { children: React.ReactNode, delay?: number, scale?: number }) => {
  return (
    <div 
      className="absolute animate-float" 
      style={{ 
        animationDelay: `${delay}s`,
        transform: `scale(${scale})`
      }}
    >
      {children}
    </div>
  );
};

export default function Home() {
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  // ウェルカムメッセージのアニメーション
  useEffect(() => {
    setShowWelcome(true);
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // キャラクターのローテーション
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCharacterIndex((prev) => (prev + 1) % featuredCharacters.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
      {/* ウェルカムオーバーレイ */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md
                      transition-opacity duration-1000 ${showWelcome ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="text-4xl md:text-6xl font-bold text-white text-center tracking-wider animate-pulse">
          <span className="text-amber-400">原神</span>、起動！！
        </div>
      </div>
      
      {/* ヒーローセクション */}
      <div className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-600/20 animate-gradient-x"></div>
        
        {/* 背景装飾 */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingElement delay={0} scale={0.5}>
            <div className="absolute top-10 left-[10%] w-20 h-20 rounded-full bg-amber-500/20 blur-xl"></div>
          </FloatingElement>
          <FloatingElement delay={1.5} scale={0.7}>
            <div className="absolute bottom-20 right-[15%] w-24 h-24 rounded-full bg-orange-500/20 blur-xl"></div>
          </FloatingElement>
          <FloatingElement delay={1} scale={0.6}>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-red-500/20 blur-lg"></div>
          </FloatingElement>
        </div>
        
        <div className="relative py-16 px-4 md:px-12 flex flex-col md:flex-row items-center justify-between">
          {/* テキストコンテンツ */}
          <div className="md:w-1/2 text-center md:text-left z-10 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-600">
              原神の冒険を<br />もっと楽しく！
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-800 dark:text-gray-200">
              攻略情報、素材集め、キャラクター解説など、<br className="hidden md:block" />
              テイワット大陸を旅するのに役立つ情報が満載！
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link 
                href="/characters" 
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-full font-bold transform hover:scale-105 transition-transform shadow-lg"
              >
                <i className="fas fa-user-group mr-2"></i>キャラクター攻略
              </Link>
              <Link 
                href="/tiermaker" 
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full font-bold transform hover:scale-105 transition-transform shadow-lg"
              >
                <i className="fas fa-list-ol mr-2"></i>Tierメーカー
              </Link>
            </div>
          </div>
          
          {/* 特集キャラクター */}
          <div className="md:w-1/2 flex justify-center relative">
            <div className="relative w-64 h-64 sm:w-96 sm:h-96">
              {featuredCharacters.map((character, index) => (
                <div 
                  key={character.name}
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
                    index === currentCharacterIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="relative">
                    <div className="animate-float w-64 h-64 sm:w-80 sm:h-80 relative">
                      <Image 
                        src={character.image}
                        alt={character.name}
                        width={400}
                        height={400}
                        className="object-contain drop-shadow-xl"
                        priority={index === 0} // 最初の画像を優先的に読み込む
                      />
                    </div>
                    <div className={`
                      absolute -bottom-4 left-1/2 transform -translate-x-1/2
                      px-6 py-2 rounded-full text-white font-bold text-lg shadow-md
                      ${character.element === 'pyro' ? 'bg-red-500' : 
                        character.element === 'hydro' ? 'bg-blue-500' :
                        character.element === 'anemo' ? 'bg-teal-500' :
                        character.element === 'electro' ? 'bg-purple-500' :
                        character.element === 'cryo' ? 'bg-cyan-500' :
                        character.element === 'geo' ? 'bg-amber-500' :
                        'bg-green-500'
                      }
                    `}>
                      {character.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* カテゴリータイトル */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 inline-block relative">
          <span className="relative z-10">コンテンツをチェック</span>
          <span className="absolute bottom-0 left-0 right-0 h-3 bg-amber-300/30 dark:bg-amber-700/30 -z-0 transform -rotate-1"></span>
        </h2>
      </div>

      {/* カードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card, index) => (
          <Link 
            key={index}
            href={card.href} 
            className={`
              relative overflow-hidden
              p-4 sm:p-6 rounded-xl transition-all duration-300
              transform hover:scale-105 hover:-translate-y-1
              shadow-md ${card.hoverShadow}
              bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo}
              group flex flex-col justify-between min-h-[120px] sm:min-h-[150px]
              backdrop-filter backdrop-blur-sm
              border border-white/10
            `}
          >
            {/* 元素アイコン */}
            <ElementIcon element={card.element} />
            
            {/* キラキラエフェクト */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-white/10 animate-sparkle"></div>
            </div>
            
            {/* 背景の装飾的な円 */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white opacity-10 
                            group-hover:scale-150 transition-transform duration-700 ease-out`}></div>
            
            <h2 className="text-sm sm:text-base font-bold text-white relative z-10 drop-shadow-md">{card.title}</h2>
            <p className="text-lg sm:text-xl md:text-2xl font-bold mt-2 text-center text-white relative z-10 drop-shadow-lg">
              {card.subtitle}
            </p>
          </Link>
        ))}
      </div>
      
      {/* 最新アップデート情報 */}
      <div className="mt-16 rounded-xl overflow-hidden shadow-lg border border-amber-200 dark:border-amber-800">
        <div className="bg-amber-100 dark:bg-amber-900 px-6 py-4">
          <h3 className="text-xl font-bold text-amber-800 dark:text-amber-200">
            <i className="fas fa-newspaper mr-2"></i>最新アップデート情報
          </h3>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 dark:bg-red-900 rounded-full p-2 text-red-500 dark:text-red-300">
                <i className="fas fa-star"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">Tierメーカー機能を追加しました！</h4>
                <p className="text-gray-600 dark:text-gray-400">あなただけのキャラクターTierリストを作成して共有できます。</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2 text-blue-500 dark:text-blue-300">
                <i className="fas fa-info-circle"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">攻略カレンダーに聖遺物ドメイン情報を追加</h4>
                <p className="text-gray-600 dark:text-gray-400">効率的な素材集めのためのスケジュールを確認できます。</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link 
              href="/news" 
              className="inline-block text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium"
            >
              すべてのニュースを見る <i className="fas fa-chevron-right ml-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
