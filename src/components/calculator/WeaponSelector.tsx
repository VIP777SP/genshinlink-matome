'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Weapon } from '@/data/weapons';

// 武器選択コンポーネントのプロパティ
interface WeaponSelectorProps {
  weapons: Weapon[];
  selectedWeaponId: string | null;
  onSelectWeapon: (weaponId: string) => void;
}

export default function WeaponSelector({
  weapons,
  selectedWeaponId,
  onSelectWeapon
}: WeaponSelectorProps) {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 武器タイプフィルターオプション
  const weaponFilters = [
    { id: 'all', name: 'すべて', icon: 'fa-th-large' },
    { id: 'sword', name: '片手剣', icon: 'fa-khanda' },
    { id: 'claymore', name: '両手剣', icon: 'fa-gavel' },
    { id: 'polearm', name: '長柄武器', icon: 'fa-hockey-stick' },
    { id: 'bow', name: '弓', icon: 'fa-bullseye' },
    { id: 'catalyst', name: '法器', icon: 'fa-book' },
  ];

  // レアリティフィルターオプション
  const rarityFilters = [
    { id: 'all', name: 'すべて' },
    { id: '5', name: '★★★★★' },
    { id: '4', name: '★★★★' },
    { id: '3', name: '★★★' },
  ];

  // 武器をフィルタリング
  const filteredWeapons = weapons.filter(weapon => {
    // 武器タイプフィルター
    const typeMatch = filter === 'all' || weapon.type === filter;
    
    // レアリティフィルター
    const rarityMatch = filter === 'all' || weapon.rarity.toString() === filter;
    
    // 検索クエリフィルター
    const searchMatch = weapon.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return (typeMatch || rarityMatch) && searchMatch;
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
            placeholder="武器名で検索..."
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
        
        {/* 武器タイプフィルター */}
        <div className="flex flex-wrap gap-2">
          {weaponFilters.map(weaponFilter => (
            <button
              key={weaponFilter.id}
              onClick={() => setFilter(weaponFilter.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === weaponFilter.id
                  ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-medium' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <i className={`fas ${weaponFilter.icon} mr-1`}></i>
              {weaponFilter.name}
            </button>
          ))}
        </div>
        
        {/* レアリティフィルター */}
        <div className="flex flex-wrap gap-2">
          {rarityFilters.map(rarityFilter => (
            <button
              key={rarityFilter.id}
              onClick={() => setFilter(rarityFilter.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === rarityFilter.id
                  ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-medium' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {rarityFilter.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* 武器グリッド */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {filteredWeapons.map((weapon) => (
          <div 
            key={weapon.id}
            onClick={() => onSelectWeapon(weapon.id)}
            className={`
              relative cursor-pointer rounded-lg overflow-hidden
              transform transition-all duration-200 hover:scale-105
              ${selectedWeaponId === weapon.id ? 'ring-2 ring-amber-500 scale-105' : ''}
            `}
          >
            <div className="relative w-full pb-[125%]"> {/* 武器画像のアスペクト比を維持 */}
              <Image
                src={weapon.imageUrl}
                alt={weapon.name}
                fill
                className="object-contain"
              />
              {/* レアリティ表示 */}
              <div className={`
                absolute bottom-0 left-0 right-0 
                text-xs text-center text-white py-1
                ${weapon.rarity === 5 ? 'bg-amber-500/80' : weapon.rarity === 4 ? 'bg-purple-500/80' : 'bg-blue-500/80'}
              `}>
                {'★'.repeat(weapon.rarity)}
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 transition-opacity">
              <span className="text-white text-sm font-medium text-center px-1">{weapon.name}</span>
            </div>
          </div>
        ))}
        
        {filteredWeapons.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            選択条件に一致する武器が見つかりませんでした
          </div>
        )}
      </div>
    </div>
  );
}