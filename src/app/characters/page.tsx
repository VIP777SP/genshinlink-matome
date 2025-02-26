'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSound } from '@/components/SoundService';
import FavoriteButton from '@/components/FavoriteButton';
import CommentSection from '@/components/CommentSection';
import { TierDefinition, tiersC0, tiersC2R1, Character, RoleType, ElementType, WeaponType, RarityType } from '@/utils/characters';

// 元素カラーのマッピング
const elementColors: Record<ElementType, { bg: string; text: string; darkBg: string; darkText: string }> = {
  anemo: { bg: 'bg-teal-100', text: 'text-teal-800', darkBg: 'dark:bg-teal-900', darkText: 'dark:text-teal-200' },
  geo: { bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'dark:bg-yellow-900', darkText: 'dark:text-yellow-200' },
  electro: { bg: 'bg-purple-100', text: 'text-purple-800', darkBg: 'dark:bg-purple-900', darkText: 'dark:text-purple-200' },
  dendro: { bg: 'bg-green-100', text: 'text-green-800', darkBg: 'dark:bg-green-900', darkText: 'dark:text-green-200' },
  hydro: { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900', darkText: 'dark:text-blue-200' },
  pyro: { bg: 'bg-red-100', text: 'text-red-800', darkBg: 'dark:bg-red-900', darkText: 'dark:text-red-200' },
  cryo: { bg: 'bg-cyan-100', text: 'text-cyan-800', darkBg: 'dark:bg-cyan-900', darkText: 'dark:text-cyan-200' }
};

// 武器アイコンのマッピング
const weaponIcons: Record<WeaponType, string> = {
  sword: 'fa-sword',
  claymore: 'fa-axe-battle',
  polearm: 'fa-khanda',
  bow: 'fa-bow-arrow',
  catalyst: 'fa-book-sparkles'
};

export default function CharacterTierPage() {
  const [tierMode, setTierMode] = useState<'c0' | 'c2r1'>('c0');
  const { playSound } = useSound();

  // 使用するティア表を決定
  const currentTiers = tierMode === 'c0' ? tiersC0 : tiersC2R1;

  // ティア内のキャラクターをアタッカーとサポーターに分割する関数
  const getRoleSplit = (characters: Character[]) => {
    return {
      attackers: characters.filter(c => c.role === 'attacker'),
      supporters: characters.filter(c => c.role === 'supporter')
    };
  };

  // モード切り替えハンドラー
  const handleModeChange = (mode: 'c0' | 'c2r1') => {
    playSound('click');
    setTierMode(mode);
  };

  return (
    <main className="max-w-6xl mx-auto relative">
      {/* 背景装飾 */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02] pointer-events-none overflow-hidden">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="genshin-pattern-tier" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20,20 C25,15 35,15 40,20 C45,25 45,35 40,40 C35,45 25,45 20,40 C15,35 15,25 20,20 Z" 
                  fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              <path d="M70,20 L90,20 L80,40 Z" 
                  fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              <path d="M20,70 L25,80 L30,70 L35,90 L20,70" 
                  fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              <path d="M70,70 L90,70 M80,60 L80,80 M75,65 L85,75 M75,75 L85,65" 
                  fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              <circle cx="50" cy="50" r="20" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="#D4AF37" strokeWidth="0.3" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#genshin-pattern-tier)"/>
        </svg>
        
        {/* カラフルなグラデーションの円 */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {/* SVGロゴ */}
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <circle cx="50" cy="50" r="48" fill="none" stroke="#FFB13B" strokeWidth="2" opacity="0.9"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#FFB13B" strokeWidth="1.5" opacity="0.7"/>
              <path d="M50,10 L50,90 M10,50 L90,50 M25,25 L75,75 M25,75 L75,25" 
                    stroke="#FFB13B" strokeWidth="1.5" opacity="0.8" strokeLinecap="round"/>
              <circle cx="50" cy="50" r="20" fill="none" stroke="#FFB13B" strokeWidth="1" opacity="0.6"/>
              <circle cx="50" cy="50" r="10" fill="#FFB13B" opacity="0.8"/>
              <circle cx="50" cy="50" r="6" fill="#FFF5E6" opacity="0.9"/>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-500 drop-shadow-sm">
            【最強キャラティア】
          </h1>
        </div>
        <FavoriteButton 
          id="character-tier-page"
          title="最強キャラティア"
          url="/characters/tier"
          category="攻略情報"
        />
      </div>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        原神における最強キャラクターのランキングをご紹介します。メタゲームの状況やアビスの環境に基づいて、各キャラクターの強さを評価しています。
        定期的に更新されますので、最新の環境に合わせた編成を考える参考にしてください。
      </p>

      {/* 条件切り替えバー */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-amber-200/40 dark:border-amber-800/30 mb-6">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleModeChange('c0')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              tierMode === 'c0'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
            }`}
          >
            <span className="font-medium">C0・星4武器前提</span>
          </button>
          <button
            onClick={() => handleModeChange('c2r1')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              tierMode === 'c2r1'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
            }`}
          >
            <span className="font-medium">C2・専用武器R1条件</span>
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          {tierMode === 'c0' 
            ? '無凸・星4武器装備を前提としたキャラクターの評価です' 
            : '2凸・専用星5武器を装備した場合のキャラクターの評価です'}
        </p>
      </div>

      {/* ティア一覧 */}
      <div className="space-y-8 mb-8">
        {currentTiers.map((tier) => {
          const { attackers, supporters } = getRoleSplit(tier.characters);
          return (
            <div key={tier.rank} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-amber-200/40 dark:border-amber-800/30">
              {/* ティアヘッダー */}
              <div className={`${tier.color} text-white p-4`}>
                <div className="flex items-center">
                  <div className="text-3xl font-bold mr-3">{tier.rank}</div>
                  <div className="text-xl font-medium">{tier.name}</div>
                </div>
                <p className="mt-1 text-white/90 text-sm">{tier.description}</p>
              </div>
              
              {/* キャラクター一覧（2列レイアウト） */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* アタッカー列 */}
                  <div>
                    <h3 className="font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center">
                      <i className="fas fa-swords mr-2"></i>アタッカー
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {attackers.length > 0 ? attackers.map((character) => (
                        <div 
                          key={character.id}
                          className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg border border-amber-100 dark:border-amber-900/30 w-20 sm:w-24 transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="relative h-20 sm:h-24">
                            <div className={`absolute inset-0 ${elementColors[character.element].bg} ${elementColors[character.element].darkBg} opacity-30`}></div>
                            <Image
                              src={character.imageUrl}
                              alt={character.name}
                              fill
                              className="object-cover object-top"
                            />
                            <div className="absolute top-0 right-0 m-1">
                              <span className={`flex items-center justify-center w-5 h-5 rounded-full ${elementColors[character.element].bg} ${elementColors[character.element].darkBg}`}>
                                <span className={`text-xs ${elementColors[character.element].text} ${elementColors[character.element].darkText}`}>
                                  {character.element.charAt(0).toUpperCase()}
                                </span>
                              </span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 px-2">
                              <p className="text-white text-xs text-center font-medium truncate">{character.name}</p>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm italic">このティアにはアタッカーがいません</p>
                      )}
                    </div>
                  </div>
                  
                  {/* サポーター列 */}
                  <div>
                    <h3 className="font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center">
                      <i className="fas fa-hands-helping mr-2"></i>サポーター
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {supporters.length > 0 ? supporters.map((character) => (
                        <div 
                          key={character.id}
                          className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg border border-amber-100 dark:border-amber-900/30 w-20 sm:w-24 transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="relative h-20 sm:h-24">
                            <div className={`absolute inset-0 ${elementColors[character.element].bg} ${elementColors[character.element].darkBg} opacity-30`}></div>
                            <Image
                              src={character.imageUrl}
                              alt={character.name}
                              fill
                              className="object-cover object-top"
                            />
                            <div className="absolute top-0 right-0 m-1">
                              <span className={`flex items-center justify-center w-5 h-5 rounded-full ${elementColors[character.element].bg} ${elementColors[character.element].darkBg}`}>
                                <span className={`text-xs ${elementColors[character.element].text} ${elementColors[character.element].darkText}`}>
                                  {character.element.charAt(0).toUpperCase()}
                                </span>
                              </span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 px-2">
                              <p className="text-white text-xs text-center font-medium truncate">{character.name}</p>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm italic">このティアにはサポーターがいません</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* ティア評価ポリシー */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-amber-200/40 dark:border-amber-800/30 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
          <i className="fas fa-balance-scale mr-2 text-amber-600 dark:text-amber-500"></i>
          ティア評価ポリシー
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-amber-700 dark:text-amber-400">
              評価基準
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span>深境螺旋（アビス）での活躍度</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span>汎用性と特化性のバランス</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span>チーム編成における役割と貢献度</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span>凸数と武器による性能差</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-amber-700 dark:text-amber-400">
              注意事項
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <i className="fas fa-exclamation-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span>このティアリストは一般的な目安であり、プレイスタイルや好みによって評価は異なります。</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-exclamation-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span>アップデートによってバランス調整が行われると評価が変わる場合があります。</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-exclamation-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span>下位ティアのキャラクターでも特定のコンテンツや状況では非常に強力な場合があります。</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* コメントセクション */}
      <CommentSection pageId="character-tier" />
    </main>
  );
} 