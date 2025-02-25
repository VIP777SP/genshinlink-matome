'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSound } from './SoundService';

// ナビゲーションアイテムのタイプ定義
type NavItem = {
  href: string;
  label: string;
  icon: string; // FontAwesomeのアイコン名
};

// ナビゲーションアイテムの配列
const navItems: NavItem[] = [
  { href: '/', label: 'ホーム', icon: 'fa-home' },
  { href: '/recsite', label: 'お役立ちサイト', icon: 'fa-globe' },
  { href: '/reccommunity', label: 'コミュニティ', icon: 'fa-users' },
  { href: '/recyoutuber', label: 'YouTuber', icon: 'fa-youtube' },
  { href: '/characters', label: 'キャラクター図鑑', icon: 'fa-user-astronaut' },
  { href: '/calendar', label: '攻略カレンダー', icon: 'fa-calendar-alt' },
  { href: '/calculator', label: '素材計算機', icon: 'fa-calculator' },
  { href: '/artifacts', label: '聖遺物攻略', icon: 'fa-gem' },
  { href: '/maps', label: 'マップ', icon: 'fa-map' },
  { href: '/teams', label: 'パーティー編成', icon: 'fa-users-cog' },
  { href: '/tiermaker', label: 'Tierメーカー', icon: 'fa-list-ol' },
  { href: '/news', label: 'ニュース', icon: 'fa-newspaper' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { playSound } = useSound();

  // パスが変わったらモバイルメニューを閉じる
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // スクロール検出
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`
        backdrop-blur-md 
        bg-gradient-to-r from-black/85 to-gray-900/85 
        text-white sticky top-0 z-50 
        transition-all duration-300 
        ${scrolled ? 'shadow-xl' : 'shadow-lg'}
        border-b border-amber-900/30
      `}
    >
      {/* モバイル用トグルボタン */}
      <div className="md:hidden p-3 flex justify-between items-center">
        <Link 
          href="/" 
          className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 hover:brightness-110 transition-all"
        >
          原神リンク集
        </Link>
        <button 
          onClick={() => {
            setIsOpen(!isOpen);
            playSound('click');
          }}
          className="text-white p-2 rounded-lg hover:bg-amber-600/50 transition-colors"
          aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* デスクトップ＆モバイル展開時メニュー */}
      <div 
        className={`
          md:flex md:flex-row md:justify-center md:flex-wrap
          transition-all duration-300 ease-in-out
          ${isOpen 
            ? 'max-h-[500px] opacity-100 border-t border-amber-700/30' 
            : 'max-h-0 md:max-h-screen opacity-0 md:opacity-100 overflow-hidden border-t-0'
          }
        `}
      >
        <ul className="md:flex md:flex-row md:flex-wrap md:justify-center md:space-x-1 p-2 overflow-y-auto max-h-[calc(100vh-60px)] md:max-h-none">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="mb-1 md:mb-0">
                <Link
                  href={item.href}
                  className={`
                    relative overflow-hidden group
                    flex items-center px-3 py-2 rounded-lg
                    transition-all duration-300 ease-in-out
                    ${isActive 
                      ? 'bg-gradient-to-r from-amber-700 to-amber-600 font-bold text-white' 
                      : 'text-gray-300 hover:text-white'}
                    text-sm md:text-base
                  `}
                  onClick={() => {
                    playSound('click');
                    // モバイルの場合はクリック後にメニューを閉じる
                    if (window.innerWidth < 768) {
                      setIsOpen(false);
                    }
                  }}
                  onMouseEnter={() => playSound('hover')}
                >
                  {/* ホバーエフェクト */}
                  <span className={`
                    absolute inset-0 bg-gradient-to-r from-amber-600/50 to-amber-500/50
                    transform transition-transform duration-300 ease-out
                    ${isActive ? 'translate-x-0' : '-translate-x-full group-hover:translate-x-0'}
                  `}></span>
                  
                  {/* アイコンとテキスト */}
                  <span className="relative z-10 flex items-center">
                    <i className={`fas ${item.icon} mr-2 ${isActive ? 'text-amber-200' : 'text-amber-500'}`}></i>
                    <span>{item.label}</span>
                  </span>
                  
                  {/* アクティブなメニューには装飾を追加 */}
                  {isActive && (
                    <span className="relative z-10 ml-2 text-xs text-amber-200 animate-pulse">●</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
} 