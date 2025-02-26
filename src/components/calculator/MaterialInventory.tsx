import { useState, useEffect } from 'react';
import Image from 'next/image';
import { materials, Material, materialsMap, MaterialRequirement } from '@/data/materials';

// 素材在庫コンポーネントのプロパティ
interface MaterialInventoryProps {
  inventory: Record<string, number>;
  onInventoryChange: (inventory: Record<string, number>) => void;
}

export default function MaterialInventory({ inventory, onInventoryChange }: MaterialInventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');

  // 素材タイプフィルターオプション
  const typeFilters = [
    { id: 'all', name: 'すべて', icon: 'fa-th-large' },
    { id: 'mora', name: 'モラ', icon: 'fa-coins' },
    { id: 'exp', name: '経験値', icon: 'fa-book' },
    { id: 'ascension', name: '突破素材', icon: 'fa-gem' },
    { id: 'talent', name: '天賦素材', icon: 'fa-scroll' },
    { id: 'weapon', name: '武器素材', icon: 'fa-gavel' },
    { id: 'boss', name: 'ボス素材', icon: 'fa-skull' },
    { id: 'local_specialty', name: '特産品', icon: 'fa-leaf' },
    { id: 'common', name: '一般素材', icon: 'fa-feather' },
  ];

  // 素材をフィルタリング
  const filteredMaterials = materials.filter(material => {
    // タイプフィルター
    const typeMatch = filter === 'all' || material.type === filter;
    
    // 検索クエリフィルター
    const searchMatch = material.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && searchMatch;
  });

  // 素材の在庫数を更新する
  const updateInventory = (materialId: string, amount: number) => {
    const newInventory = { ...inventory };
    if (amount <= 0) {
      // 0以下の場合、エントリを削除
      delete newInventory[materialId];
    } else {
      newInventory[materialId] = amount;
    }
    onInventoryChange(newInventory);
  };

  // レアリティに応じたCSS色クラス
  const rarityColors: Record<number, { bg: string; text: string; border: string }> = {
    1: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200', border: 'border-gray-300 dark:border-gray-600' },
    2: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', border: 'border-green-300 dark:border-green-700' },
    3: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', border: 'border-blue-300 dark:border-blue-700' },
    4: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200', border: 'border-purple-300 dark:border-purple-700' },
    5: { bg: 'bg-amber-100 dark:bg-amber-900', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-300 dark:border-amber-700' },
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        素材在庫
      </h2>
      
      {/* 検索とフィルター */}
      <div className="mb-4 space-y-3">
        {/* 検索ボックス */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="素材名で検索..."
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
        
        {/* タイプフィルター */}
        <div className="flex flex-wrap gap-2">
          {typeFilters.map(typeFilter => (
            <button
              key={typeFilter.id}
              onClick={() => setFilter(typeFilter.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === typeFilter.id
                  ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-medium' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <i className={`fas ${typeFilter.icon} mr-1`}></i>
              {typeFilter.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* 素材一覧 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredMaterials.map((material) => {
          const rarity = material.rarity;
          const colorClasses = rarityColors[rarity];
          const currentAmount = inventory[material.id] || 0;
          
          return (
            <div
              key={material.id}
              className={`rounded-lg border ${colorClasses.border} ${colorClasses.bg} p-2 text-center relative`}
            >
              <div className="relative h-12 w-12 mx-auto mb-2">
                <Image
                  src={material.imageUrl}
                  alt={material.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className={`text-xs font-medium ${colorClasses.text} truncate mb-1`}>
                {material.name}
              </p>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => updateInventory(material.id, Math.max(0, currentAmount - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-l bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <i className="fas fa-minus text-xs"></i>
                </button>
                <input
                  type="number"
                  min="0"
                  value={currentAmount}
                  onChange={(e) => updateInventory(material.id, parseInt(e.target.value) || 0)}
                  className="w-12 h-8 text-center border-x-0 border-y bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-0"
                />
                <button
                  onClick={() => updateInventory(material.id, currentAmount + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-r bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <i className="fas fa-plus text-xs"></i>
                </button>
              </div>
              
              {/* レアリティ表示 */}
              <div className="absolute top-0 right-0 bg-white/80 dark:bg-gray-900/80 rounded-bl rounded-tr px-1 text-xs">
                {'★'.repeat(rarity)}
              </div>
            </div>
          );
        })}
        
        {filteredMaterials.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            選択条件に一致する素材が見つかりませんでした
          </div>
        )}
      </div>
    </div>
  );
} 