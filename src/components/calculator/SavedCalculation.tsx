import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Character, charactersMap } from '@/data/characters';
import { Weapon, weaponsMap } from '@/data/weapons';
import { MaterialRequirement } from '@/data/materials';
import MaterialList from './MaterialList';

// 保存された計算結果の型
export interface SavedCalculation {
  id: string;
  timestamp: number;
  name: string; // 計算の名前（ユーザー指定）
  characterId?: string;
  weaponId?: string;
  currentLevel: number;
  targetLevel: number;
  currentTalentLevels?: [number, number, number];
  targetTalentLevels?: [number, number, number];
  requirements: MaterialRequirement[];
}

// 保存計算コンポーネントのプロパティ
interface SavedCalculationProps {
  savedCalculations: SavedCalculation[];
  onDelete: (calculationId: string) => void;
  onCombine: (calculationIds: string[]) => void;
}

export default function SavedCalculation({
  savedCalculations,
  onDelete,
  onCombine
}: SavedCalculationProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // 計算結果を選択/選択解除
  const toggleSelection = (calculationId: string) => {
    if (selectedIds.includes(calculationId)) {
      setSelectedIds(selectedIds.filter(id => id !== calculationId));
    } else {
      setSelectedIds([...selectedIds, calculationId]);
    }
  };
  
  // 全選択/全解除
  const toggleSelectAll = () => {
    if (selectedIds.length === savedCalculations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(savedCalculations.map(calc => calc.id));
    }
  };
  
  // 選択した計算結果を合算
  const combineSelected = () => {
    if (selectedIds.length > 1) {
      onCombine(selectedIds);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          保存された計算結果
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleSelectAll}
            className="px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {selectedIds.length === savedCalculations.length ? '全解除' : '全選択'}
          </button>
          <button
            onClick={combineSelected}
            disabled={selectedIds.length < 2}
            className={`px-3 py-1 text-sm rounded-md ${
              selectedIds.length < 2
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            選択した結果を合算
          </button>
        </div>
      </div>
      
      {savedCalculations.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg">
          <i className="fas fa-calculator text-3xl mb-3 text-gray-400"></i>
          <p>保存された計算結果はありません</p>
          <p className="text-sm mt-2">キャラクターや武器の素材計算を行い、結果を保存してください</p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedCalculations.map((calculation) => (
            <div
              key={calculation.id}
              className={`bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md overflow-hidden 
                        ${selectedIds.includes(calculation.id) 
                          ? 'border-2 border-amber-500' 
                          : 'border border-gray-200 dark:border-gray-700'}`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(calculation.id)}
                      onChange={() => toggleSelection(calculation.id)}
                      className="mr-3 h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex-shrink-0 mr-3">
                      {calculation.characterId && (
                        <div className="relative w-12 h-12">
                          <Image
                            src={(charactersMap.get(calculation.characterId)?.imageUrl || '').replace('.png', '-icon.png')}
                            alt={charactersMap.get(calculation.characterId)?.name || ''}
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                      )}
                      {calculation.weaponId && !calculation.characterId && (
                        <div className="relative w-12 h-12">
                          <Image
                            src={weaponsMap.get(calculation.weaponId)?.imageUrl || ''}
                            alt={weaponsMap.get(calculation.weaponId)?.name || ''}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">
                        {calculation.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {calculation.characterId && (
                          <>
                            {charactersMap.get(calculation.characterId)?.name || '不明なキャラクター'} 
                            {' Lv.'}{calculation.currentLevel}→{calculation.targetLevel}
                            {calculation.currentTalentLevels && calculation.targetTalentLevels && (
                              <> / 天賦 {calculation.currentTalentLevels.join('/')}→{calculation.targetTalentLevels.join('/')}</>
                            )}
                          </>
                        )}
                        {calculation.weaponId && !calculation.characterId && (
                          <>
                            {weaponsMap.get(calculation.weaponId)?.name || '不明な武器'} 
                            {' Lv.'}{calculation.currentLevel}→{calculation.targetLevel}
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(calculation.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(calculation.id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">必要素材</h4>
                    <button
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={() => {
                        const detailsEl = document.getElementById(`details-${calculation.id}`);
                        if (detailsEl) {
                          detailsEl.classList.toggle('hidden');
                        }
                      }}
                    >
                      詳細を表示/非表示
                    </button>
                  </div>
                  <div id={`details-${calculation.id}`} className="hidden">
                    <MaterialList 
                      requirements={calculation.requirements}
                      showDetails={true}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {calculation.requirements.slice(0, 5).map(req => {
                      const material = req.materialId;
                      return (
                        <div key={material} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-xs">
                          <div className="relative w-4 h-4 mr-1">
                            <Image
                              src={`/images/materials/${material}.png`}
                              alt={material}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span>{req.amount.toLocaleString()}</span>
                        </div>
                      );
                    })}
                    {calculation.requirements.length > 5 && (
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-xs">
                        +{calculation.requirements.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 