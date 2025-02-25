'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSound } from '@/components/SoundService';
import FavoriteButton from '@/components/FavoriteButton';
import CommentSection from '@/components/CommentSection';

// 属性タイプの定義
type ElementType = 'pyro' | 'hydro' | 'anemo' | 'electro' | 'dendro' | 'cryo' | 'geo';
type WeaponType = 'sword' | 'claymore' | 'polearm' | 'bow' | 'catalyst';
type RarityType = 4 | 5;

// キャラクター型の定義
type Character = {
  id: string;
  name: string;
  title: string;
  element: ElementType;
  weapon: WeaponType;
  rarity: RarityType;
  region: string;
  description: string;
  imageUrl: string;
};

// ティアの型定義
type TierRank = 'SS' | 'S' | 'A' | 'B' | 'C';

type TierDefinition = {
  rank: TierRank;
  name: string;
  description: string;
  color: string;
  characters: Character[];
};

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

// キャラクターデータ
// 実際のアプリでは別のファイルやAPIから取得することも考えられます
const characters: Character[] = [
  {
    id: 'raiden-shogun',
    name: '雷電将軍',
    title: '殲滅の稲妻',
    element: 'electro',
    weapon: 'polearm',
    rarity: 5,
    region: '稲妻',
    description: '稲妻の雷神であり、稲妻幕府の最高指導者。「永遠」を追い求め、「まぼろしの永遠」という方針を打ち出した。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202106/raiden_shogun.png'
  },
  {
    id: 'kazuha',
    name: '楓原万葉',
    title: '紅葉のいろどり',
    element: 'anemo',
    weapon: 'sword',
    rarity: 5,
    region: '稲妻',
    description: '稲妻の浪人剣士。さすらいの詩人である。若くて、名声もないが、多くの物語と伝説を聞いてきた。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202106/kazuha.png'
  },
  {
    id: 'nahida',
    name: 'ナヒーダ',
    title: '白草净华',
    element: 'dendro',
    weapon: 'catalyst',
    rarity: 5,
    region: 'スメール',
    description: 'スメール教令院の主神。知恵を司る草の神。純粋で、優しく、知恵に溢れている。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202210/nahida.png'
  },
  {
    id: 'bennett',
    name: 'ベネット',
    title: '運命の試練',
    element: 'pyro',
    weapon: 'sword',
    rarity: 4,
    region: 'モンド',
    description: 'モンドの冒険者ギルドに所属する若き冒険者。いつも不運に見舞われているが、それでも前向きな性格を持っている。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202001/bennett.png'
  },
  {
    id: 'xingqiu',
    name: '行秋',
    title: '少年春衫薄',
    element: 'hydro',
    weapon: 'sword',
    rarity: 4,
    region: '璃月',
    description: '璃月の有名な商家、飛雲商会の次男坊。本の虫で、武術にも優れた才能を持つ。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202001/xingqiu.png'
  },
  {
    id: 'zhongli',
    name: '鍾離',
    title: '通じ合う岩',
    element: 'geo',
    weapon: 'polearm',
    rarity: 5,
    region: '璃月',
    description: '往生堂の客人。博識で、長い年月を生きてきたかのような風格がある。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202011/zhongli.png'
  },
  {
    id: 'ganyu',
    name: '甘雨',
    title: '循いし理',
    element: 'cryo',
    weapon: 'bow',
    rarity: 5,
    region: '璃月',
    description: '璃月七星の秘書。半人半仙獣の血を引く。几帳面で真面目な性格。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202101/ganyu.png'
  },
  {
    id: 'xiangling',
    name: '香菱',
    title: '万民百味',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 4,
    region: '璃月',
    description: '璃月の料理人。料理に情熱を注ぎ、新しい食材や調理法を常に探求している。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202001/xiangling.png'
  },
  {
    id: 'hutao',
    name: '胡桃',
    title: '往生堂七十七代目堂主',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 5,
    region: '璃月',
    description: '璃月の葬儀社「往生堂」の若き堂主。死と生の境界を行き来する力を持つ。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202103/hutao.png'
  },
  {
    id: 'ayaka',
    name: '神里綾華',
    title: '白鷺氷華',
    element: 'cryo',
    weapon: 'sword',
    rarity: 5,
    region: '稲妻',
    description: '稲妻の名家「神里家」の長女。優美な剣術と氷の力で敵を翻弄する。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202107/ayaka.png'
  },
];

// 最強キャラティア定義
// サイト運営者のみが編集できる固定のデータ
const characterTiers: TierDefinition[] = [
  {
    rank: 'SS',
    name: '最強ランク',
    description: 'メタを支配する最強キャラクター。どんなパーティにも組み込める万能性か、特定の役割において圧倒的な性能を持つ。',
    color: 'bg-red-600',
    characters: [
      characters.find(c => c.id === 'nahida')!,
      characters.find(c => c.id === 'raiden-shogun')!,
    ]
  },
  {
    rank: 'S',
    name: '超強力ランク',
    description: '非常に強力なキャラクターで、ほとんどのコンテンツで活躍できる。適切なパーティ編成で真価を発揮する。',
    color: 'bg-orange-500',
    characters: [
      characters.find(c => c.id === 'kazuha')!,
      characters.find(c => c.id === 'zhongli')!,
      characters.find(c => c.id === 'hutao')!,
    ]
  },
  {
    rank: 'A',
    name: '強力ランク',
    description: '特定の役割や状況で非常に優れた性能を発揮する。適切なパーティ編成が求められるが、十分な強さを持つ。',
    color: 'bg-amber-500',
    characters: [
      characters.find(c => c.id === 'ganyu')!,
      characters.find(c => c.id === 'ayaka')!,
      characters.find(c => c.id === 'xingqiu')!,
    ]
  },
  {
    rank: 'B',
    name: '平均ランク',
    description: '一般的な性能を持ち、特定のパーティ編成や状況で活躍できる。',
    color: 'bg-green-600',
    characters: [
      characters.find(c => c.id === 'xiangling')!,
    ]
  },
  {
    rank: 'C',
    name: '改善待ちランク',
    description: '現状ではやや弱く、活躍の場が限られている。バフや新装備で将来的に強化される可能性がある。',
    color: 'bg-blue-600',
    characters: [
      characters.find(c => c.id === 'bennett')!,
    ]
  },
];

// タブの型定義
type TabType = 'overview' | 'details';

export default function CharacterTierPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const { playSound } = useSound();

  // キャラクターカードクリックのハンドラー
  const handleCharacterClick = (character: Character) => {
    playSound('click');
    setSelectedCharacter(character);
    setActiveTab('details');
  };

  // タブ切り替えのハンドラー
  const handleTabChange = (tab: TabType) => {
    playSound('click');
    setActiveTab(tab);
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

      {/* タブメニュー */}
      <div className="flex border-b border-amber-200 dark:border-amber-800/40 mb-6">
        <button
          className={`px-4 py-2 font-medium text-lg ${
            activeTab === 'overview'
              ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-500'
          }`}
          onClick={() => handleTabChange('overview')}
        >
          <i className="fas fa-list-ol mr-2"></i>ティア一覧
        </button>
        <button
          className={`px-4 py-2 font-medium text-lg ${
            activeTab === 'details'
              ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-500'
          } ${!selectedCharacter && 'opacity-50 cursor-not-allowed'}`}
          onClick={() => selectedCharacter && handleTabChange('details')}
          disabled={!selectedCharacter}
        >
          <i className="fas fa-user-circle mr-2"></i>キャラ詳細
        </button>
      </div>

      {/* タブコンテンツ */}
      {activeTab === 'overview' ? (
        // ティア一覧
        <div className="space-y-8 mb-8">
          {characterTiers.map((tier) => (
            <div key={tier.rank} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-amber-200/40 dark:border-amber-800/30">
              {/* ティアヘッダー */}
              <div className={`${tier.color} text-white p-4`}>
                <div className="flex items-center">
                  <div className="text-3xl font-bold mr-3">{tier.rank}</div>
                  <div className="text-xl font-medium">{tier.name}</div>
                </div>
                <p className="mt-1 text-white/90 text-sm">{tier.description}</p>
              </div>
              
              {/* キャラクター一覧 */}
              <div className="p-4">
                <div className="flex flex-wrap gap-4">
                  {tier.characters.map((character) => (
                    <div 
                      key={character.id}
                      className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg border border-amber-100 dark:border-amber-900/30 w-24 sm:w-28 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      onClick={() => handleCharacterClick(character)}
                    >
                      <div className="relative h-24 sm:h-28">
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
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // キャラ詳細
        selectedCharacter ? (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-amber-200 dark:border-amber-900 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 flex justify-center">
                <div className="relative w-60 h-72 overflow-hidden rounded-lg shadow-md">
                  <div className={`absolute inset-0 ${elementColors[selectedCharacter.element].bg} ${elementColors[selectedCharacter.element].darkBg} opacity-30`}></div>
                  <Image
                    src={selectedCharacter.imageUrl}
                    alt={selectedCharacter.name}
                    width={240}
                    height={288}
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{selectedCharacter.name}</h2>
                  <span className={`px-2 py-1 rounded ${elementColors[selectedCharacter.element].bg} ${elementColors[selectedCharacter.element].text} ${elementColors[selectedCharacter.element].darkBg} ${elementColors[selectedCharacter.element].darkText}`}>
                    {selectedCharacter.element}
                  </span>
                  
                  {/* ティアランク表示 */}
                  {characterTiers.map((tier) => 
                    tier.characters.some(c => c.id === selectedCharacter.id) && (
                      <span key={tier.rank} className={`${tier.color} text-white px-3 py-1 rounded text-sm font-bold`}>
                        Tier {tier.rank}
                      </span>
                    )
                  )}
                </div>
                
                <p className="text-xl text-amber-600 dark:text-amber-400 mb-4">{selectedCharacter.title}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-gray-600 dark:text-gray-400 mb-1">レアリティ</h3>
                    <div className="text-amber-500">
                      {[...Array(selectedCharacter.rarity)].map((_, i) => (
                        <i key={i} className="fas fa-star mr-1"></i>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-600 dark:text-gray-400 mb-1">武器タイプ</h3>
                    <p className="flex items-center">
                      <i className={`fas ${weaponIcons[selectedCharacter.weapon]} mr-2 text-amber-600 dark:text-amber-500`}></i>
                      <span className="text-gray-800 dark:text-gray-200 capitalize">{selectedCharacter.weapon}</span>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-600 dark:text-gray-400 mb-1">出身地域</h3>
                    <p className="text-gray-800 dark:text-gray-200">{selectedCharacter.region}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-600 dark:text-gray-400 mb-2">キャラクター紹介</h3>
                  <p className="text-gray-800 dark:text-gray-200">{selectedCharacter.description}</p>
                </div>
                
                <div className="mt-6">
                  <Link 
                    href={`/characters?id=${selectedCharacter.id}`}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center"
                    onClick={() => playSound('click')}
                  >
                    <i className="fas fa-book mr-2"></i>
                    詳細な攻略情報を見る
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">キャラクターを選択してください</p>
          </div>
        )
      )}
      
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
                <span>星6武器や聖遺物を必要としない基本性能</span>
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