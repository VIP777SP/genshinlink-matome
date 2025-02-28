'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, TouchEvent } from "react";

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
    image: "/images/characters/raiden-shogun.png",
    element: "electro",
    description: "「稲光を切り裂く永遠の雷霆」"
  },
  { 
    name: "胡桃", 
    image: "/images/characters/hutao.png",
    element: "pyro",
    description: "「往生堂の七十七代目当主」" 
  },
  { 
    name: "楓原万葉", 
    image: "/images/characters/kazuha.png",
    element: "anemo",
    description: "「風流の剣士」" 
  },
  { 
    name: "夜蘭", 
    image: "/images/characters/yelan.png",
    element: "hydro",
    description: "「玲瓏一擲」" 
  },
  { 
    name: "甘雨", 
    image: "/images/characters/ganyu.png",
    element: "cryo",
    description: "「循循守月」" 
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
  const [touchStartX, setTouchStartX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const characterDisplayRef = useRef<HTMLDivElement>(null);

  // ウェルカムメッセージのアニメーション
  useEffect(() => {
    setShowWelcome(true);
    const timer = setTimeout(() => setShowWelcome(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // モバイル判定
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // 初期チェック
    checkIfMobile();
    
    // リサイズ時にチェック
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // キャラクターのローテーション
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCharacterIndex((prev) => (prev + 1) % featuredCharacters.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // タッチ開始ハンドラ
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  // タッチ終了ハンドラ
  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    
    // 左右スワイプの判定（50px以上の移動で判定）
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // 右スワイプ - 前のキャラクター
        setCurrentCharacterIndex(prev => 
          prev === 0 ? featuredCharacters.length - 1 : prev - 1
        );
      } else {
        // 左スワイプ - 次のキャラクター
        setCurrentCharacterIndex(prev => 
          (prev + 1) % featuredCharacters.length
        );
      }
    }
  };

  // キャラクター切り替えボタンハンドラ
  const changeCharacter = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentCharacterIndex(prev => 
        prev === 0 ? featuredCharacters.length - 1 : prev - 1
      );
    } else {
      setCurrentCharacterIndex(prev => 
        (prev + 1) % featuredCharacters.length
      );
    }
  };

  return (
    <main className="container mx-auto px-3 py-4 sm:px-6 sm:py-8">
      {/* ウェルカムオーバーレイ */}
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-start pt-[20vh] bg-black/80 backdrop-blur-md
                      transition-opacity duration-1000 ${showWelcome ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="text-6xl md:text-9xl font-bold text-white text-center tracking-wider animate-pulse">
          <span className="text-amber-400">原神</span>、起動！！
        </div>
      </div>
      
      {/* ヒーローセクション */}
      <div className="relative mb-10 md:mb-14 rounded-2xl overflow-hidden shadow-2xl">
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
        
        {/* モバイルとデスクトップで異なるレイアウト */}
        <div className="relative py-8 md:py-16 px-4 md:px-12">
          {/* モバイル版レイアウト - フレックスカラム */}
          <div className="md:hidden flex flex-col space-y-8">
            {/* キャラクター表示（上） */}
            <div 
              ref={characterDisplayRef}
              className="flex justify-center relative"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative w-64 h-64">
                {/* 左右矢印 */}
                <button 
                  onClick={() => changeCharacter('prev')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 bg-white/80 dark:bg-gray-800/80 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                  aria-label="前のキャラクター"
                >
                  <i className="fas fa-chevron-left text-amber-600 dark:text-amber-400"></i>
                </button>
                <button 
                  onClick={() => changeCharacter('next')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 bg-white/80 dark:bg-gray-800/80 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                  aria-label="次のキャラクター"
                >
                  <i className="fas fa-chevron-right text-amber-600 dark:text-amber-400"></i>
                </button>
              
                {/* スワイプヒント */}
                <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                  スワイプしてキャラクターを切り替え
                </div>
                
                {/* キャラクターカルーセル */}
                {featuredCharacters.map((character, index) => (
                  <div 
                    key={character.name}
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
                      index === currentCharacterIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  >
                    <div className="relative">
                      <div className="animate-float w-56 h-56 relative">
                        <Image 
                          src={character.image}
                          alt={character.name}
                          width={400}
                          height={400}
                          className="object-contain drop-shadow-xl"
                          priority={index === 0}
                        />
                      </div>
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-[16rem] px-3 py-2 rounded-full text-white font-bold text-base shadow-md text-center"
                        style={{
                          background: character.element === 'pyro' ? 'linear-gradient(90deg, #f87171, #ef4444)' : 
                            character.element === 'hydro' ? 'linear-gradient(90deg, #60a5fa, #3b82f6)' :
                            character.element === 'anemo' ? 'linear-gradient(90deg, #5eead4, #2dd4bf)' :
                            character.element === 'electro' ? 'linear-gradient(90deg, #c084fc, #a855f7)' :
                            character.element === 'cryo' ? 'linear-gradient(90deg, #7dd3fc, #38bdf8)' :
                            character.element === 'geo' ? 'linear-gradient(90deg, #fcd34d, #f59e0b)' :
                            'linear-gradient(90deg, #a3e635, #84cc16)'
                        }}
                      >
                        <div>{character.name}</div>
                        <div className="text-xs mt-0.5 opacity-90 font-normal">{character.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* キャラクター切り替えインジケーター */}
                <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-2">
                  {featuredCharacters.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentCharacterIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentCharacterIndex ? 'bg-amber-500 scale-125' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-label={`キャラクター ${idx + 1} に切り替え`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* テキストコンテンツ（下） */}
            <div className="text-center z-10">
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-600">
                原神の冒険を<br />もっと楽しく！
              </h1>
              <p className="text-base mb-4 text-gray-800 dark:text-gray-200">
                攻略情報、素材集め、キャラクター解説など、<br />
                テイワット大陸を旅するのに役立つ情報が満載！
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link 
                  href="/characters" 
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-red-600 text-white text-sm rounded-full font-bold transform hover:scale-105 transition-transform shadow-lg"
                >
                  <i className="fas fa-user-group mr-1"></i>キャラクター攻略
                </Link>
                <Link 
                  href="/tiermaker" 
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm rounded-full font-bold transform hover:scale-105 transition-transform shadow-lg"
                >
                  <i className="fas fa-list-ol mr-1"></i>Tierメーカー
                </Link>
              </div>
            </div>
          </div>
          
          {/* デスクトップ版レイアウト - 横並び */}
          <div className="hidden md:flex md:flex-row md:items-center md:justify-between">
            {/* テキストコンテンツ（左側） */}
            <div className="md:w-1/2 text-left z-10 md:pr-8">
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-600">
                原神の冒険を<br />もっと楽しく！
              </h1>
              <p className="text-lg lg:text-xl mb-6 text-gray-800 dark:text-gray-200">
                攻略情報、素材集め、キャラクター解説など、<br />
                テイワット大陸を旅するのに役立つ情報が満載！
              </p>
              <div className="flex flex-wrap gap-4">
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
            
            {/* 特集キャラクター（右側） */}
            <div 
              ref={characterDisplayRef}
              className="md:w-1/2 flex justify-center relative"
            >
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                {/* 左右矢印 */}
                <button 
                  onClick={() => changeCharacter('prev')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white/80 dark:bg-gray-800/80 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  aria-label="前のキャラクター"
                >
                  <i className="fas fa-chevron-left text-amber-600 dark:text-amber-400"></i>
                </button>
                <button 
                  onClick={() => changeCharacter('next')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white/80 dark:bg-gray-800/80 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  aria-label="次のキャラクター"
                >
                  <i className="fas fa-chevron-right text-amber-600 dark:text-amber-400"></i>
                </button>
                
                {/* キャラクターカルーセル */}
                {featuredCharacters.map((character, index) => (
                  <div 
                    key={character.name}
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
                      index === currentCharacterIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  >
                    <div className="relative">
                      <div className="animate-float w-72 h-72 lg:w-80 lg:h-80 relative">
                        <Image 
                          src={character.image}
                          alt={character.name}
                          width={400}
                          height={400}
                          className="object-contain drop-shadow-xl"
                          priority={index === 0}
                        />
                      </div>
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-[18rem] px-4 py-2 rounded-full text-white font-bold text-lg shadow-md text-center"
                        style={{
                          background: character.element === 'pyro' ? 'linear-gradient(90deg, #f87171, #ef4444)' : 
                            character.element === 'hydro' ? 'linear-gradient(90deg, #60a5fa, #3b82f6)' :
                            character.element === 'anemo' ? 'linear-gradient(90deg, #5eead4, #2dd4bf)' :
                            character.element === 'electro' ? 'linear-gradient(90deg, #c084fc, #a855f7)' :
                            character.element === 'cryo' ? 'linear-gradient(90deg, #7dd3fc, #38bdf8)' :
                            character.element === 'geo' ? 'linear-gradient(90deg, #fcd34d, #f59e0b)' :
                            'linear-gradient(90deg, #a3e635, #84cc16)'
                        }}
                      >
                        <div>{character.name}</div>
                        <div className="text-xs mt-0.5 opacity-90 font-normal">{character.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* キャラクター切り替えインジケーター */}
                <div className="absolute -bottom-14 left-0 right-0 flex justify-center gap-3">
                  {featuredCharacters.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentCharacterIndex(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        idx === currentCharacterIndex ? 'bg-amber-500 scale-125' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-label={`キャラクター ${idx + 1} に切り替え`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* コンテンツセクション */}
      <div className="py-4">
        {/* カテゴリータイトル */}
        <div className="mb-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 inline-block relative">
            <span className="relative z-10">コンテンツをチェック</span>
            <span className="absolute bottom-0 left-0 right-0 h-2 md:h-3 bg-amber-300/30 dark:bg-amber-700/30 -z-0 transform -rotate-1"></span>
          </h2>
        </div>

        {/* カードグリッド - モバイルとデスクトップで調整 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
          {cards.map((card, index) => (
            <Link 
              key={index}
              href={card.href} 
              className={`
                relative overflow-hidden
                p-3 sm:p-4 md:p-6 rounded-xl transition-all duration-300
                transform hover:scale-105 active:scale-95 hover:-translate-y-1
                shadow-md ${card.hoverShadow}
                bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo}
                group flex flex-col justify-between min-h-[110px] sm:min-h-[130px] md:min-h-[160px]
                backdrop-filter backdrop-blur-sm
                border border-white/10
                touch-manipulation
              `}
            >
              {/* 元素アイコン */}
              <ElementIcon element={card.element} />
              
              {/* キラキラエフェクト */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-white/10 animate-sparkle"></div>
              </div>
              
              {/* 背景の装飾的な円 */}
              <div className={`absolute -bottom-6 -right-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white opacity-10 
                              group-hover:scale-150 group-active:scale-125 transition-transform duration-700 ease-out`}></div>
              
              <h2 className="text-xs sm:text-sm md:text-base font-bold text-white relative z-10 drop-shadow-md">{card.title}</h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-1 sm:mt-2 text-center text-white relative z-10 drop-shadow-lg">
                {card.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </div>
      
      {/* 最新アップデート情報 - モバイルとデスクトップでスタイルを調整 */}
      <div className="mt-10 md:mt-16 rounded-xl overflow-hidden shadow-lg border border-amber-200 dark:border-amber-800">
        <div className="bg-amber-100 dark:bg-amber-900 px-4 md:px-6 py-3 md:py-4">
          <h3 className="text-lg md:text-xl font-bold text-amber-800 dark:text-amber-200">
            <i className="fas fa-newspaper mr-2"></i>最新アップデート情報
          </h3>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-start gap-2 md:gap-3">
              <div className="bg-red-100 dark:bg-red-900 rounded-full p-1.5 md:p-2 text-red-500 dark:text-red-300 flex-shrink-0 mt-0.5">
                <i className="fas fa-star text-sm md:text-base"></i>
              </div>
              <div>
                <h4 className="font-bold text-sm md:text-base text-gray-800 dark:text-gray-200">Tierメーカー機能を追加しました！</h4>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">あなただけのキャラクターTierリストを作成して共有できます。</p>
              </div>
            </div>
            <div className="flex items-start gap-2 md:gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1.5 md:p-2 text-blue-500 dark:text-blue-300 flex-shrink-0 mt-0.5">
                <i className="fas fa-info-circle text-sm md:text-base"></i>
              </div>
              <div>
                <h4 className="font-bold text-sm md:text-base text-gray-800 dark:text-gray-200">攻略カレンダーに聖遺物ドメイン情報を追加</h4>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">効率的な素材集めのためのスケジュールを確認できます。</p>
              </div>
            </div>
          </div>
          <div className="mt-3 md:mt-4 text-center">
            <Link 
              href="/news" 
              className="inline-block text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 text-sm md:text-base font-medium"
            >
              すべてのニュースを見る <i className="fas fa-chevron-right ml-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
