'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  { href: '/news', label: 'ニュース', icon: 'fa-newspaper' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hoverSound] = useState<HTMLAudioElement | null>(null);
  const [clickSound] = useState<HTMLAudioElement | null>(null);

  // 音声効果の初期化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // hoverSoundRef.current = new Audio('/sounds/hover.mp3');
      // clickSoundRef.current = new Audio('/sounds/click.mp3');
    }
  }, []);

  // ホバー時の音声再生
  const playHoverSound = () => {
    if (hoverSound) {
      hoverSound.currentTime = 0;
      hoverSound.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  // クリック時の音声再生
  const playClickSound = () => {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  return (
    <nav className="backdrop-blur-md bg-black/70 text-white sticky top-0 z-50 transition-all duration-300 shadow-lg">
      {/* モバイル用トグルボタン */}
      <div className="md:hidden p-4 flex justify-between items-center">
        <span className="text-xl font-bold">原神リンク集</span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* デスクトップ＆モバイル展開時メニュー */}
      <div className={`
        md:flex md:flex-row md:justify-center
        transition-all duration-300 ease-in-out
        ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 md:max-h-screen opacity-0 md:opacity-100 overflow-hidden'}
      `}>
        <ul className="md:flex md:flex-row md:space-x-1 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="mb-1 md:mb-0">
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-4 py-2 rounded-lg
                    transition-all duration-300 ease-in-out
                    transform hover:scale-105 hover:bg-orange-600
                    ${isActive ? 'bg-orange-700 font-bold' : 'hover:text-white'}
                  `}
                  onClick={playClickSound}
                  onMouseEnter={playHoverSound}
                >
                  <i className={`fas ${item.icon} mr-2`}></i>
                  <span>{item.label}</span>
                  {/* アクティブなメニューには装飾を追加 */}
                  {isActive && (
                    <span className="ml-2 animate-pulse">●</span>
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