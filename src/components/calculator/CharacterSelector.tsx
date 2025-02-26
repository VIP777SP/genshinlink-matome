'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Character } from '@/data/characters';
import { Weapon } from '@/data/weapons';

// キャラクター選択コンポーネントのプロパティ
interface CharacterSelectorProps {
  characters: Character[];
  selectedCharacterId: string | null;
  onSelectCharacter: (characterId: string) => void;
}

export default function CharacterSelector({
  characters,
  selectedCharacterId,
  onSelectCharacter
}: CharacterSelectorProps) {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 元素フィルターオプション
  const elementFilters = [
    { id: 'all', name: 'すべて', color: 'bg-gray-200 dark:bg-gray-700' },
    { id: 'pyro', name: '炎', color: 'bg-red-100 dark:bg-red-900' },
    { id: 'hydro', name: '水', color: 'bg-blue-100 dark:bg-blue-900' },
    { id: 'anemo', name: '風', color: 'bg-teal-100 dark:bg-teal-900' },
    { id: 'electro', name: '雷', color: 'bg-purple-100 dark:bg-purple-900' },
    { id: 'cryo', name: '氷', color: 'bg-cyan-100 dark:bg-cyan-900' },
    { id: 'geo', name: '岩', color: 'bg-yellow-100 dark:bg-yellow-900' },
    { id: 'dendro', name: '草', color: 'bg-green-100 dark:bg-green-900' },
  ];

  // キャラクターをフィルタリング
  const filteredCharacters = characters.filter(character => {
    // 元素フィルター
    const elementMatch = filter === 'all' || character.element === filter;
    
    // 検索クエリフィルター
    const searchMatch = character.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return elementMatch && searchMatch;
  });

  return (
    <div className="w-full">
      {/* 検索とフィルター */}
      <div className="mb-4 space-y-3">
        {/* 検索ボックス */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="キャラクター名で検索..."
            className="w-full px-4 py-2 pl-10 bg-white/90 dark:bg-gray-800/90 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <i className="fas fa-search"></i>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        
        {/* 元素フィルター */}
        <div className="flex flex-wrap gap-2">
          {elementFilters.map(elementFilter => (
            <button
              key={elementFilter.id}
              onClick={() => setFilter(elementFilter.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === elementFilter.id
                  ? `${elementFilter.color} font-medium` 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {elementFilter.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* キャラクターグリッド */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {filteredCharacters.map((character) => (
          <div 
            key={character.id}
            onClick={() => onSelectCharacter(character.id)}
            className={`
              relative cursor-pointer rounded-lg overflow-hidden
              transform transition-all duration-200 hover:scale-105
              ${selectedCharacterId === character.id ? 'ring-2 ring-amber-500 scale-105' : ''}
            `}
          >
            <div className="relative w-full pb-[100%]"> {/* 正方形のアスペクト比を維持 */}
              <Image
                src={character.imageUrl.replace('.png', '-icon.png')}
                alt={character.name}
                fill
                className="object-cover"
              />
              {/* レアリティ表示 */}
              <div className={`
                absolute bottom-0 left-0 right-0 
                text-xs text-center text-white py-1
                ${character.rarity === 5 ? 'bg-amber-500/80' : 'bg-purple-500/80'}
              `}>
                {'★'.repeat(character.rarity)}
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 transition-opacity">
              <span className="text-white text-sm font-medium">{character.name}</span>
            </div>
          </div>
        ))}
        
        {filteredCharacters.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            選択条件に一致するキャラクターが見つかりませんでした
          </div>
        )}
      </div>
    </div>
  );
} 