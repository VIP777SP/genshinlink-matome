'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSound } from '@/components/SoundService';
import FavoriteButton from '@/components/FavoriteButton';
import CommentSection from '@/components/CommentSection';

// キャラクター情報の型定義
type ElementType = 'anemo' | 'geo' | 'electro' | 'dendro' | 'hydro' | 'pyro' | 'cryo';
type WeaponType = 'sword' | 'claymore' | 'polearm' | 'bow' | 'catalyst';
type RarityType = 4 | 5;

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

// キャラクターデータ（実際のアプリでは外部APIから取得するかもしれません）
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
  }
];

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

export default function CharactersPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [filters, setFilters] = useState({
    element: 'all',
    weapon: 'all',
    rarity: 'all',
    region: 'all'
  });
  const { playSound } = useSound();

  // フィルター項目とユニークな値を取得
  const elements = ['all', ...new Set(characters.map(char => char.element))];
  const weapons = ['all', ...new Set(characters.map(char => char.weapon))];
  const rarities = ['all', ...new Set(characters.map(char => char.rarity.toString()))];
  const regions = ['all', ...new Set(characters.map(char => char.region))];

  // フィルター適用された結果
  const filteredCharacters = characters.filter(char => {
    return (
      (filters.element === 'all' || char.element === filters.element) &&
      (filters.weapon === 'all' || char.weapon === filters.weapon) &&
      (filters.rarity === 'all' || char.rarity.toString() === filters.rarity) &&
      (filters.region === 'all' || char.region === filters.region)
    );
  });

  // フィルター変更ハンドラー
  const handleFilterChange = (filterType: string, value: string) => {
    playSound('click');
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  // キャラクター選択ハンドラー
  const handleCharacterSelect = (char: Character) => {
    playSound('click');
    setSelectedCharacter(char);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-700 dark:text-amber-500">
          【キャラクター図鑑】
        </h1>
        <FavoriteButton 
          id="characters-page"
          title="キャラクター図鑑"
          url="/characters"
          category="攻略情報"
        />
      </div>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        原神の魅力的なキャラクターたちの情報をご紹介します。属性や武器タイプでフィルタリングできます。
      </p>

      {/* 選択されたキャラクターの詳細表示 */}
      {selectedCharacter && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-amber-200 dark:border-amber-900 animate-fadeIn">
          <div className="flex justify-between mb-4">
            <button 
              onClick={() => {
                setSelectedCharacter(null);
                playSound('click');
              }}
              className="text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-300"
            >
              <i className="fas fa-arrow-left mr-2"></i>戻る
            </button>
            <FavoriteButton 
              id={`character-${selectedCharacter.id}`}
              title={selectedCharacter.name}
              url={`/characters?id=${selectedCharacter.id}`}
              category="キャラクター"
            />
          </div>
          
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
              <div className="flex items-center mb-2">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mr-3">{selectedCharacter.name}</h2>
                <span className={`px-2 py-1 rounded ${elementColors[selectedCharacter.element].bg} ${elementColors[selectedCharacter.element].text} ${elementColors[selectedCharacter.element].darkBg} ${elementColors[selectedCharacter.element].darkText}`}>
                  {selectedCharacter.element}
                </span>
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
            </div>
          </div>
        </div>
      )}

      {/* フィルター */}
      <div className="mb-6 p-4 bg-amber-50 dark:bg-gray-900 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-amber-800 dark:text-amber-400">キャラクターを絞り込む</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 元素フィルター */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">元素</label>
            <select
              value={filters.element}
              onChange={(e) => handleFilterChange('element', e.target.value)}
              className="w-full p-2 border border-amber-300 dark:border-amber-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              {elements.map((element) => (
                <option key={element} value={element}>
                  {element === 'all' ? 'すべての元素' : element}
                </option>
              ))}
            </select>
          </div>
          
          {/* 武器フィルター */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">武器タイプ</label>
            <select
              value={filters.weapon}
              onChange={(e) => handleFilterChange('weapon', e.target.value)}
              className="w-full p-2 border border-amber-300 dark:border-amber-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              {weapons.map((weapon) => (
                <option key={weapon} value={weapon}>
                  {weapon === 'all' ? 'すべての武器' : weapon}
                </option>
              ))}
            </select>
          </div>
          
          {/* レアリティフィルター */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">レアリティ</label>
            <select
              value={filters.rarity}
              onChange={(e) => handleFilterChange('rarity', e.target.value)}
              className="w-full p-2 border border-amber-300 dark:border-amber-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              {rarities.map((rarity) => (
                <option key={rarity} value={rarity}>
                  {rarity === 'all' ? 'すべてのレアリティ' : `${rarity}★`}
                </option>
              ))}
            </select>
          </div>
          
          {/* 地域フィルター */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">出身地域</label>
            <select
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              className="w-full p-2 border border-amber-300 dark:border-amber-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region === 'all' ? 'すべての地域' : region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* キャラクターカードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCharacters.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            <i className="fas fa-search text-4xl mb-4"></i>
            <p>条件に一致するキャラクターが見つかりませんでした。</p>
            <button
              onClick={() => {
                setFilters({ element: 'all', weapon: 'all', rarity: 'all', region: 'all' });
                playSound('click');
              }}
              className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
            >
              フィルターをリセット
            </button>
          </div>
        ) : (
          filteredCharacters.map((char) => (
            <div
              key={char.id}
              onClick={() => handleCharacterSelect(char)}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg border border-amber-100 dark:border-amber-900 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <div className="relative h-48">
                <div className={`absolute inset-0 ${elementColors[char.element].bg} ${elementColors[char.element].darkBg} opacity-30`}></div>
                <Image
                  src={char.imageUrl}
                  alt={char.name}
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute top-0 right-0 m-2">
                  <span className={`p-1 text-xs rounded ${elementColors[char.element].bg} ${elementColors[char.element].text} ${elementColors[char.element].darkBg} ${elementColors[char.element].darkText}`}>
                    {char.element}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 m-2 text-amber-500">
                  {[...Array(char.rarity)].map((_, i) => (
                    <i key={i} className="fas fa-star text-xs"></i>
                  ))}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{char.name}</h3>
                <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">{char.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{char.region}</span>
                  <i className={`fas ${weaponIcons[char.weapon]} text-gray-600 dark:text-gray-400`}></i>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* コメントセクション */}
      <CommentSection pageId="characters" pageTitle="キャラクター図鑑" />
    </main>
  );
} 