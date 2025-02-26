'use client';

import Image from 'next/image';
import { MaterialRequirement } from '@/data/materials';
import { materialsMap } from '@/data/materials';

// 素材リストのプロパティ
interface MaterialListProps {
  requirements: MaterialRequirement[];
  title?: string;
}

export default function MaterialList({ requirements, title }: MaterialListProps) {
  // レアリティでソートして表示 (高レアリティが先)
  const sortedRequirements = [...requirements].sort((a, b) => {
    const materialA = materialsMap.get(a.materialId);
    const materialB = materialsMap.get(b.materialId);
    
    if (!materialA || !materialB) return 0;
    
    // レアリティが高い順に並べる
    return materialB.rarity - materialA.rarity;
  });

  // レアリティに応じたCSS色クラス
  const rarityColors: Record<number, { bg: string; text: string; border: string; darkBg: string; darkText: string; darkBorder: string }> = {
    1: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-300',
      darkBg: 'dark:bg-gray-700',
      darkText: 'dark:text-gray-200',
      darkBorder: 'dark:border-gray-500'
    },
    2: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      darkBg: 'dark:bg-green-900',
      darkText: 'dark:text-green-200',
      darkBorder: 'dark:border-green-700'
    },
    3: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300',
      darkBg: 'dark:bg-blue-900',
      darkText: 'dark:text-blue-200',
      darkBorder: 'dark:border-blue-700'
    },
    4: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-300',
      darkBg: 'dark:bg-purple-900',
      darkText: 'dark:text-purple-200',
      darkBorder: 'dark:border-purple-700'
    },
    5: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-300',
      darkBg: 'dark:bg-amber-900',
      darkText: 'dark:text-amber-200',
      darkBorder: 'dark:border-amber-700'
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-md p-4">
      {title && (
        <h3 className="text-lg font-bold mb-4 text-amber-700 dark:text-amber-400">{title}</h3>
      )}
      
      {requirements.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          必要な素材はありません
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {sortedRequirements.map((requirement) => {
            const material = materialsMap.get(requirement.materialId);
            if (!material) return null;
            
            const rarity = material.rarity;
            const colorClasses = rarityColors[rarity];
            
            return (
              <div
                key={requirement.materialId}
                className={`rounded-lg border ${colorClasses.border} ${colorClasses.darkBorder} 
                          ${colorClasses.bg} ${colorClasses.darkBg} p-2 text-center relative
                          hover:shadow-md transition-shadow`}
              >
                <div className="relative h-16 w-16 mx-auto mb-2">
                  <Image
                    src={material.imageUrl}
                    alt={material.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="overflow-hidden">
                  <p className={`text-sm font-medium ${colorClasses.text} ${colorClasses.darkText} truncate`}>
                    {material.name}
                  </p>
                  <p className="text-lg font-bold mt-1">
                    {requirement.amount.toLocaleString()}
                  </p>
                </div>
                
                {/* レアリティ表示 */}
                <div className="absolute top-0 right-0 bg-white/80 dark:bg-gray-900/80 rounded-bl rounded-tr px-1 text-xs">
                  {'★'.repeat(rarity)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}