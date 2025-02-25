'use client';

import { useState } from 'react';
import Image from 'next/image';
import FavoriteButton from '@/components/FavoriteButton';
import CommentSection from '@/components/CommentSection';
import { useSound } from '@/components/SoundService';

// 聖遺物セットの型定義
type ArtifactSet = {
  id: string;
  name: string;
  rarity: number[];
  pieces: number[];
  bonus: {
    [key: string]: string;
  };
  recommendedFor: string[];
  domain: string;
  location: string;
  imageUrl: string;
};

// 聖遺物セットのデータ
const artifactSets: ArtifactSet[] = [
  {
    id: 'viridescent-venerer',
    name: '翠緑の影',
    rarity: [4, 5],
    pieces: [2, 4],
    bonus: {
      '2': '風元素ダメージ+15%',
      '4': '拡散反応によるダメージ+60%。また、拡散する元素タイプに対する敵の耐性-40%、継続時間10秒。'
    },
    recommendedFor: ['風主人公', '楓原万葉', '魈', 'ウェンティ'],
    domain: '深境の塔 谷妄の森の秘境',
    location: 'モンド',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/0/0f/Item_Viridescent_Venerer%27s_Determination.png'
  },
  {
    id: 'emblem-of-severed-fate',
    name: '絶縁の旗印',
    rarity: [4, 5],
    pieces: [2, 4],
    bonus: {
      '2': '元素チャージ効率+20%',
      '4': '元素爆発のダメージが、元素チャージ効率の25%分アップする。この方法で獲得したダメージボーナスは最大75%まで。'
    },
    recommendedFor: ['雷電将軍', '行秋', '香菱', '神里綾人'],
    domain: '顕仆之室 椛狩の忍道場',
    location: '稲妻',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/e/e8/Item_Magnificent_Tsuba.png'
  },
  {
    id: 'noblesse-oblige',
    name: '旧貴族のしつけ',
    rarity: [4, 5],
    pieces: [2, 4],
    bonus: {
      '2': '元素爆発のダメージ+20%',
      '4': '元素爆発を使用した後、チーム全員の攻撃力+20%、継続時間12秒。この効果は重ね掛け不可。'
    },
    recommendedFor: ['ベネット', 'モナ', 'ディオナ', '鍾離'],
    domain: '仮面の老翁 火の渓谷の秘境',
    location: '璃月',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/9/9f/Item_Royal_Flora.png'
  },
  {
    id: 'heart-of-depth',
    name: '沈淪の心',
    rarity: [4, 5],
    pieces: [2, 4],
    bonus: {
      '2': '水元素ダメージ+15%',
      '4': '元素スキルを使用した後、通常攻撃と重撃のダメージ+30%、継続時間15秒。'
    },
    recommendedFor: ['タルタリヤ', '珊瑚宮心海', '莫娜', '夜蘭'],
    domain: '霧海砦 華金の谷の峰の秘境',
    location: '璃月',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/e/e3/Item_Gilded_Corsage.png'
  },
  {
    id: 'crimson-witch-of-flames',
    name: '燃え盛る炎の魔女',
    rarity: [4, 5],
    pieces: [2, 4],
    bonus: {
      '2': '炎元素ダメージ+15%',
      '4': '過負荷、燃焼反応によるダメージ+40%、蒸発、溶解反応による効果+15%。元素スキルを使用した後10秒間、2セット効果が50%アップし、最大3回まで重ね掛け可能。'
    },
    recommendedFor: ['胡桃', '香菱', 'ディルック', '煙緋'],
    domain: '仮面の老翁 火の渓谷の秘境',
    location: '璃月',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/e/e6/Item_Witch%27s_Flower_of_Blaze.png'
  },
  {
    id: 'blizzard-strayer',
    name: '氷風を彷徨う勇士',
    rarity: [4, 5],
    pieces: [2, 4],
    bonus: {
      '2': '氷元素ダメージ+15%',
      '4': '氷元素の影響を受けた敵に対して会心率+20%。敵が凍結状態の場合、会心率は更に+20%。'
    },
    recommendedFor: ['甘雨', '神里綾華', 'アーロイ', '申鶴'],
    domain: '霧海砦 華金の谷の峰の秘境',
    location: '璃月',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/6/69/Item_Snowswept_Memory.png'
  }
];

// 聖遺物部位の名前マッピング
const pieceNames = {
  flower: '生の花',
  plume: '死の羽',
  sands: '時の砂',
  goblet: '空の杯',
  circlet: '理の冠'
};

export default function ArtifactsPage() {
  const [selectedSet, setSelectedSet] = useState<ArtifactSet | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const { playSound } = useSound();

  // 聖遺物セットをフィルタリング
  const filteredSets = filter === 'all' 
    ? artifactSets 
    : artifactSets.filter(set => set.recommendedFor.some(char => char.includes(filter)));

  // キャラクター名のリストを取得（重複を排除）
  const characters = Array.from(new Set(
    artifactSets.flatMap(set => set.recommendedFor)
  )).sort();

  return (
    <main className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-700 dark:text-amber-500">
          【聖遺物攻略ガイド】
        </h1>
        <FavoriteButton 
          id="artifacts-page"
          title="聖遺物攻略"
          url="/artifacts"
          category="攻略情報"
        />
      </div>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        最適な聖遺物セットとキャラクターの組み合わせを見つけて、戦闘力を最大化しましょう。このガイドでは人気のある聖遺物セットとその入手方法を紹介します。
      </p>

      {selectedSet ? (
        <div className="mb-8 relative overflow-hidden">
          {/* 選択された聖遺物セットの詳細表示 */}
          <div className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-amber-200/40 dark:border-amber-800/30 animate-fadeIn">
            <div className="flex justify-between mb-4">
              <button 
                onClick={() => {
                  setSelectedSet(null);
                  playSound('click');
                }}
                className="text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-300 flex items-center"
              >
                <i className="fas fa-arrow-left mr-2"></i>戻る
              </button>
              <FavoriteButton 
                id={`artifact-${selectedSet.id}`}
                title={selectedSet.name}
                url={`/artifacts?id=${selectedSet.id}`}
                category="聖遺物"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg shadow-md border border-amber-100 dark:border-amber-900/30 flex justify-center">
                  <div className="relative w-48 h-48">
                    <Image
                      src={selectedSet.imageUrl}
                      alt={selectedSet.name}
                      fill
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                </div>
                
                <div className="mt-4 bg-amber-50 dark:bg-gray-700/50 rounded-lg p-4 shadow-md border border-amber-100 dark:border-amber-900/30">
                  <h3 className="text-lg font-semibold mb-2 text-amber-800 dark:text-amber-400">
                    <i className="fas fa-map-marker-alt mr-2 text-amber-600 dark:text-amber-500"></i>
                    入手場所
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-1">
                    <span className="font-medium">秘境:</span> {selectedSet.domain}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">地域:</span> {selectedSet.location}
                  </p>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-2 text-amber-700 dark:text-amber-400 flex items-center">
                  <i className="fas fa-gem mr-2 text-amber-600/80 dark:text-amber-500/80"></i>
                  {selectedSet.name}
                </h2>
                
                <div className="flex mb-4">
                  {selectedSet.rarity.map(r => (
                    <div key={r} className="mr-2 px-2 py-1 text-xs rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                      {r}★
                    </div>
                  ))}
                  {selectedSet.pieces.map(p => (
                    <div key={p} className="mr-2 px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                      {p}セット
                    </div>
                  ))}
                </div>
                
                <div className="bg-gradient-to-br from-amber-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-700/80 p-4 rounded-lg shadow-md mb-4 border border-amber-100 dark:border-amber-900/30">
                  <h3 className="text-lg font-semibold mb-3 text-amber-800 dark:text-amber-400">
                    <i className="fas fa-puzzle-piece mr-2 text-amber-600 dark:text-amber-500"></i>
                    セット効果
                  </h3>
                  
                  {Object.entries(selectedSet.bonus).map(([pieces, effect]) => (
                    <div key={pieces} className="mb-3 last:mb-0">
                      <div className="font-medium text-amber-700 dark:text-amber-400 mb-1">{pieces}セット:</div>
                      <div className="pl-5 text-gray-700 dark:text-gray-300">{effect}</div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gradient-to-br from-amber-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-700/80 p-4 rounded-lg shadow-md border border-amber-100 dark:border-amber-900/30">
                  <h3 className="text-lg font-semibold mb-3 text-amber-800 dark:text-amber-400">
                    <i className="fas fa-user-check mr-2 text-amber-600 dark:text-amber-500"></i>
                    おすすめキャラクター
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedSet.recommendedFor.map(char => (
                      <span 
                        key={char}
                        className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full shadow-sm text-amber-700 dark:text-amber-300 text-sm border border-amber-200 dark:border-amber-800/30"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 背景の装飾 */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-300/10 dark:bg-amber-700/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-300/10 dark:bg-orange-700/5 rounded-full blur-3xl -z-10"></div>
        </div>
      ) : (
        <div className="mb-8">
          {/* フィルター */}
          <div className="mb-6 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md border border-amber-200/40 dark:border-amber-800/30">
            <h2 className="text-xl font-semibold mb-4 text-amber-800 dark:text-amber-400 flex items-center">
              <i className="fas fa-filter mr-2 text-amber-600 dark:text-amber-500"></i>
              キャラクターでフィルター
            </h2>
            
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  filter === 'all'
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                }`}
                onClick={() => {
                  setFilter('all');
                  playSound('click');
                }}
              >
                すべて表示
              </button>
              
              {characters.map(character => (
                <button
                  key={character}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    filter === character
                      ? 'bg-amber-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                  }`}
                  onClick={() => {
                    setFilter(character);
                    playSound('click');
                  }}
                >
                  {character}
                </button>
              ))}
            </div>
          </div>
          
          {/* 聖遺物セットのリスト */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSets.map(set => (
              <div
                key={set.id}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl 
                         border border-amber-200/40 dark:border-amber-800/30 transition-all duration-300 
                         hover:scale-105 cursor-pointer group"
                onClick={() => {
                  setSelectedSet(set);
                  playSound('click');
                }}
              >
                <div className="relative h-48 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Image
                      src={set.imageUrl}
                      alt={set.name}
                      width={120}
                      height={120}
                      className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="absolute top-0 right-0 m-2 flex space-x-1">
                    {set.rarity.map(r => (
                      <span key={r} className="px-2 py-1 text-xs bg-amber-100/80 dark:bg-amber-900/80 rounded text-amber-800 dark:text-amber-300 backdrop-blur-sm">
                        {r}★
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    {set.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {set.bonus['2']}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {set.recommendedFor.slice(0, 3).map(char => (
                      <span key={char} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300">
                        {char}
                      </span>
                    ))}
                    {set.recommendedFor.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300">
                        +{set.recommendedFor.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="px-4 py-2 bg-amber-50 dark:bg-gray-700/50 border-t border-amber-100 dark:border-amber-900/30 text-sm text-gray-700 dark:text-gray-300 flex justify-between items-center">
                  <span>{set.location}</span>
                  <span className="text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                    詳細を見る <i className="fas fa-arrow-right ml-1"></i>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 聖遺物ガイド */}
      <div className="mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-amber-200/40 dark:border-amber-800/30">
        <h2 className="text-2xl font-bold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
          <i className="fas fa-book mr-2 text-amber-600 dark:text-amber-500"></i>
          聖遺物の基本ガイド
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-amber-700 dark:text-amber-400">
              聖遺物システム
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              聖遺物は強力な装備セットで、各キャラクターは最大5つの異なる部位を装備できます。聖遺物セットからのボーナス効果を得るには、同じセットのアイテムを2つまたは4つ装備する必要があります。
            </p>
            
            <h3 className="text-lg font-semibold mb-3 text-amber-700 dark:text-amber-400">
              ステータスの優先順位
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              多くのDPSキャラクターには、会心率と会心ダメージが重要です。サポートキャラクターの場合は、元素チャージ効率や元素熟知が優先されることがあります。キャラクターの役割に応じて、ステータスの優先順位を考慮しましょう。
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-amber-700 dark:text-amber-400">
              聖遺物の部位と主要ステータス
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><span className="font-medium">生の花:</span> 常にHP（固定）</li>
              <li><span className="font-medium">死の羽:</span> 常に攻撃力（固定）</li>
              <li><span className="font-medium">時の砂:</span> 攻撃力%、防御力%、HP%、元素チャージ効率%、元素熟知</li>
              <li><span className="font-medium">空の杯:</span> 攻撃力%、防御力%、HP%、元素熟知、元素ダメージ%</li>
              <li><span className="font-medium">理の冠:</span> 攻撃力%、防御力%、HP%、会心率%、会心ダメージ%、元素熟知、治療効果</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* コメントセクション */}
      <CommentSection pageId="artifacts" />
    </main>
  );
} 