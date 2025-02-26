'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSound } from '@/components/SoundService';
import FavoriteButton from '@/components/FavoriteButton';
import CommentSection from '@/components/CommentSection';
import CharacterSelector from '@/components/calculator/CharacterSelector';
import WeaponSelector from '@/components/calculator/WeaponSelector';
import MaterialList from '@/components/calculator/MaterialList';
import MaterialInventory from '@/components/calculator/MaterialInventory';
import SavedCalculation, { SavedCalculation as SavedCalculationType } from '@/components/calculator/SavedCalculation';

// データインポート
import { characters, charactersMap, calculateCharacterAscensionMaterials, calculateTalentMaterials, calculateCharacterAllMaterials } from '@/data/characters';
import { weapons, weaponsMap, calculateWeaponAscensionMaterials, calculateWeaponAscensionMaterialsWithInventory } from '@/data/weapons';
import { MaterialRequirement, materialsMap } from '@/data/materials';

// 素材タイプの定義
type MaterialType = 'exp' | 'mora' | 'ascension' | 'talent' | 'weapon';

// キャラクターレベルの型定義
type CharacterLevel = '1' | '20' | '40' | '50' | '60' | '70' | '80' | '90';
type TalentLevel = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
type WeaponLevel = '1' | '20' | '40' | '50' | '60' | '70' | '80' | '90';

// 計算タブの型定義
type CalcTab = 'character' | 'weapon' | 'inventory' | 'saved';

// レベル表示をユーザーフレンドリーに
const levelLabels: Record<string, string> = {
  '1': 'Lv.1',
  '20': 'Lv.20',
  '40': 'Lv.40',
  '50': 'Lv.50',
  '60': 'Lv.60',
  '70': 'Lv.70',
  '80': 'Lv.80',
  '90': 'Lv.90'
};

// キャラレベル突破上限を考慮したリスト
const characterLevelBreakpoints = ['1', '20', '40', '50', '60', '70', '80', '90'];

// 天賦レベルリスト
const talentLevels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default function CalculatorPage() {
  const { playSound } = useSound();
  const [activeTab, setActiveTab] = useState<CalcTab>('character');
  
  // キャラクター関連の状態
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<CharacterLevel>('1');
  const [targetLevel, setTargetLevel] = useState<CharacterLevel>('90');
  const [currentTalentLevels, setCurrentTalentLevels] = useState<[TalentLevel, TalentLevel, TalentLevel]>(['1', '1', '1']);
  const [targetTalentLevels, setTargetTalentLevels] = useState<[TalentLevel, TalentLevel, TalentLevel]>(['10', '10', '10']);
  
  // 武器関連の状態
  const [selectedWeaponId, setSelectedWeaponId] = useState<string | null>(null);
  const [currentWeaponLevel, setCurrentWeaponLevel] = useState<WeaponLevel>('1');
  const [targetWeaponLevel, setTargetWeaponLevel] = useState<WeaponLevel>('90');
  
  // 計算結果
  const [calculationResults, setCalculationResults] = useState<MaterialRequirement[]>([]);
  
  // 素材在庫
  const [materialInventory, setMaterialInventory] = useState<Record<string, number>>({});
  
  // 保存された計算結果
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculationType[]>([]);
  const [calculationName, setCalculationName] = useState<string>('');
  
  // ローカルストレージから保存された計算結果と在庫を読み込む
  useEffect(() => {
    const savedCalcs = localStorage.getItem('savedCalculations');
    if (savedCalcs) {
      try {
        setSavedCalculations(JSON.parse(savedCalcs));
      } catch (error) {
        console.error('Error loading saved calculations:', error);
      }
    }
    
    const inventory = localStorage.getItem('materialInventory');
    if (inventory) {
      try {
        setMaterialInventory(JSON.parse(inventory));
      } catch (error) {
        console.error('Error loading material inventory:', error);
      }
    }
  }, []);
  
  // 保存された計算結果をローカルストレージに保存
  useEffect(() => {
    if (savedCalculations.length > 0) {
      localStorage.setItem('savedCalculations', JSON.stringify(savedCalculations));
    }
  }, [savedCalculations]);
  
  // 素材在庫をローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('materialInventory', JSON.stringify(materialInventory));
  }, [materialInventory]);
  
  // 天賦レベルの更新
  const updateTalentLevel = (index: 0 | 1 | 2, isCurrentLevel: boolean, value: TalentLevel) => {
    if (isCurrentLevel) {
      setCurrentTalentLevels(prev => {
        const newLevels = [...prev] as [TalentLevel, TalentLevel, TalentLevel];
        newLevels[index] = value;
        return newLevels;
      });
    } else {
      setTargetTalentLevels(prev => {
        const newLevels = [...prev] as [TalentLevel, TalentLevel, TalentLevel];
        newLevels[index] = value;
        return newLevels;
      });
    }
  };
  
  // キャラクター素材計算
  const calculateCharacterMaterials = () => {
    if (!selectedCharacterId) {
      alert('キャラクターを選択してください');
      return;
    }
    
    const currentLevelNum = parseInt(currentLevel);
    const targetLevelNum = parseInt(targetLevel);
    
    if (currentLevelNum >= targetLevelNum && 
        currentTalentLevels.every((level, i) => parseInt(level) >= parseInt(targetTalentLevels[i]))) {
      alert('目標レベルは現在のレベルより高く設定してください');
      return;
    }
    
    // レベルと天賦を一括で計算
    const requirements = calculateCharacterAllMaterials(
      selectedCharacterId,
      currentLevelNum,
      targetLevelNum,
      currentTalentLevels.map(l => parseInt(l)) as [number, number, number],
      targetTalentLevels.map(l => parseInt(l)) as [number, number, number],
      materialInventory
    );
    
    setCalculationResults(requirements);
    
    // 計算名のデフォルト値を設定
    const character = charactersMap.get(selectedCharacterId);
    if (character) {
      setCalculationName(`${character.name} ${currentLevel}→${targetLevel} 天賦${currentTalentLevels.join('/')}→${targetTalentLevels.join('/')}`);
    }
  };
  
  // 武器素材計算
  const calculateWeaponMaterials = () => {
    if (!selectedWeaponId) {
      alert('武器を選択してください');
      return;
    }
    
    const currentLevelNum = parseInt(currentWeaponLevel);
    const targetLevelNum = parseInt(targetWeaponLevel);
    
    if (currentLevelNum >= targetLevelNum) {
      alert('目標レベルは現在のレベルより高く設定してください');
      return;
    }
    
    const requirements = calculateWeaponAscensionMaterialsWithInventory(
      selectedWeaponId,
      currentLevelNum,
      targetLevelNum,
      materialInventory
    );
    
    setCalculationResults(requirements);
    
    // 計算名のデフォルト値を設定
    const weapon = weaponsMap.get(selectedWeaponId);
    if (weapon) {
      setCalculationName(`${weapon.name} ${currentWeaponLevel}→${targetWeaponLevel}`);
    }
  };
  
  // 計算結果を保存
  const saveCalculation = () => {
    if (calculationResults.length === 0) {
      alert('先に素材を計算してください');
      return;
    }
    
    if (!calculationName.trim()) {
      alert('計算名を入力してください');
      return;
    }
    
    const newCalculation: SavedCalculationType = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      name: calculationName,
      currentLevel: parseInt(selectedCharacterId ? currentLevel : currentWeaponLevel),
      targetLevel: parseInt(selectedCharacterId ? targetLevel : targetWeaponLevel),
      requirements: calculationResults,
    };
    
    if (selectedCharacterId) {
      newCalculation.characterId = selectedCharacterId;
      newCalculation.currentTalentLevels = currentTalentLevels.map(l => parseInt(l)) as [number, number, number];
      newCalculation.targetTalentLevels = targetTalentLevels.map(l => parseInt(l)) as [number, number, number];
    } else if (selectedWeaponId) {
      newCalculation.weaponId = selectedWeaponId;
    }
    
    setSavedCalculations([...savedCalculations, newCalculation]);
    
    // サウンド再生と通知
    playSound('click');
    alert('計算結果を保存しました');
  };
  
  // 保存した計算結果を削除
  const deleteCalculation = (calculationId: string) => {
    setSavedCalculations(savedCalculations.filter(calc => calc.id !== calculationId));
  };
  
  // 複数の計算結果を合算
  const combineCalculations = (calculationIds: string[]) => {
    if (calculationIds.length < 2) return;
    
    // 選択された計算結果を取得
    const selectedCalculations = savedCalculations.filter(calc => 
      calculationIds.includes(calc.id)
    );
    
    // 素材要件を合算
    const combinedRequirements: Record<string, MaterialRequirement> = {};
    
    selectedCalculations.forEach(calc => {
      calc.requirements.forEach(req => {
        if (combinedRequirements[req.materialId]) {
          combinedRequirements[req.materialId].amount += req.amount;
          if (req.totalAmount) {
            // totalAmountが存在しない場合は初期化
            if (!combinedRequirements[req.materialId].totalAmount) {
              combinedRequirements[req.materialId].totalAmount = 0;
            }
            combinedRequirements[req.materialId].totalAmount! += req.totalAmount;
          }
        } else {
          combinedRequirements[req.materialId] = { ...req };
        }
      });
    });
    
    // 合算の名前を生成
    const names = selectedCalculations.map(calc => calc.name);
    let combinedName = '合算: ';
    if (names.length > 3) {
      combinedName += names.slice(0, 2).join('、') + `＋他${names.length - 2}件`;
    } else {
      combinedName += names.join('、');
    }
    
    // 新しい計算結果として保存
    const newCalculation: SavedCalculationType = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      name: combinedName,
      currentLevel: 1,  // 合算の場合は意味を持たない
      targetLevel: 90,  // 合算の場合は意味を持たない
      requirements: Object.values(combinedRequirements),
    };
    
    setSavedCalculations([...savedCalculations, newCalculation]);
    
    // サウンド再生と通知
    playSound('click');
    alert('選択した計算結果を合算しました');
  };
  
  // ページ上部のタブリンク
  const TabLink = ({ tab, label, icon }: { tab: CalcTab; label: string; icon: string }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        playSound('click');
      }}
      className={`flex items-center px-4 py-3 border-b-2 text-sm sm:text-base transition-all ${
        activeTab === tab
          ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-medium'
          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-300 hover:border-amber-300'
      }`}
    >
      <i className={`fas ${icon} mr-2`}></i>
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-700 dark:text-amber-500">
          【素材計算機】
        </h1>
        <FavoriteButton 
          id="calculator-page"
          title="素材計算機"
          url="/calculator"
          category="ツール"
        />
      </div>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        キャラクターや武器の育成に必要な素材を計算できます。レベルや天賦の目標を設定して、必要な素材を効率的に集めましょう。
      </p>
      
      {/* タブナビゲーション */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex overflow-x-auto">
          <TabLink tab="character" label="キャラクター" icon="fa-user" />
          <TabLink tab="weapon" label="武器" icon="fa-gavel" />
          <TabLink tab="inventory" label="素材在庫" icon="fa-warehouse" />
          <TabLink tab="saved" label="保存済み計算" icon="fa-save" />
        </div>
      </div>
      
      {/* キャラクタータブ */}
      {activeTab === 'character' && (
        <div className="space-y-8">
          {/* キャラクター選択 */}
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              キャラクター選択
            </h2>
            <CharacterSelector 
              characters={characters}
              selectedCharacterId={selectedCharacterId}
              onSelectCharacter={(id) => {
                setSelectedCharacterId(id);
                playSound('click');
              }}
            />
          </div>
          
          {/* レベル設定 */}
          {selectedCharacterId && (
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                レベル・天賦設定
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* レベル設定 */}
                <div>
                  <h3 className="font-medium text-amber-700 dark:text-amber-400 mb-3">キャラクターレベル</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">現在のレベル</label>
                      <select
                        value={currentLevel}
                        onChange={(e) => setCurrentLevel(e.target.value as CharacterLevel)}
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {characterLevelBreakpoints.map(level => (
                          <option key={`current-${level}`} value={level}>{levelLabels[level]}</option>
                        ))}
                      </select>
                    </div>
                    <div className="px-4 text-gray-500 dark:text-gray-400">→</div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">目標レベル</label>
                      <select
                        value={targetLevel}
                        onChange={(e) => setTargetLevel(e.target.value as CharacterLevel)}
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {characterLevelBreakpoints.map(level => (
                          <option key={`target-${level}`} value={level}>{levelLabels[level]}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* 天賦設定 */}
                <div>
                  <h3 className="font-medium text-amber-700 dark:text-amber-400 mb-3">天賦レベル</h3>
                  <div className="space-y-3">
                    {['通常攻撃', '元素スキル', '元素爆発'].map((talent, index) => (
                      <div key={`talent-${index}`} className="flex items-center">
                        <div className="w-24 shrink-0">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{talent}</span>
                        </div>
                        <div className="flex items-center flex-grow">
                          <select
                            value={currentTalentLevels[index as 0 | 1 | 2]}
                            onChange={(e) => updateTalentLevel(index as 0 | 1 | 2, true, e.target.value as TalentLevel)}
                            className="w-16 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            {talentLevels.map(level => (
                              <option key={`current-talent-${index}-${level}`} value={level}>{level}</option>
                            ))}
                          </select>
                          <div className="px-2 text-gray-500 dark:text-gray-400">→</div>
                          <select
                            value={targetTalentLevels[index as 0 | 1 | 2]}
                            onChange={(e) => updateTalentLevel(index as 0 | 1 | 2, false, e.target.value as TalentLevel)}
                            className="w-16 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            {talentLevels.map(level => (
                              <option key={`target-talent-${index}-${level}`} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={calculateCharacterMaterials}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors shadow-md"
                >
                  <i className="fas fa-calculator mr-2"></i>
                  素材を計算する
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* 武器タブ */}
      {activeTab === 'weapon' && (
        <div className="space-y-8">
          {/* 武器選択 */}
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              武器選択
            </h2>
            <WeaponSelector 
              weapons={weapons}
              selectedWeaponId={selectedWeaponId}
              onSelectWeapon={(id) => {
                setSelectedWeaponId(id);
                playSound('click');
              }}
            />
          </div>
          
          {/* レベル設定 */}
          {selectedWeaponId && (
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                レベル設定
              </h2>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">現在のレベル</label>
                  <select
                    value={currentWeaponLevel}
                    onChange={(e) => setCurrentWeaponLevel(e.target.value as WeaponLevel)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {characterLevelBreakpoints.map(level => (
                      <option key={`current-${level}`} value={level}>{levelLabels[level]}</option>
                    ))}
                  </select>
                </div>
                <div className="px-4 text-gray-500 dark:text-gray-400">→</div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">目標レベル</label>
                  <select
                    value={targetWeaponLevel}
                    onChange={(e) => setTargetWeaponLevel(e.target.value as WeaponLevel)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {characterLevelBreakpoints.map(level => (
                      <option key={`target-${level}`} value={level}>{levelLabels[level]}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={calculateWeaponMaterials}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors shadow-md"
                >
                  <i className="fas fa-calculator mr-2"></i>
                  素材を計算する
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* 素材在庫タブ */}
      {activeTab === 'inventory' && (
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md p-4">
          <MaterialInventory 
            inventory={materialInventory}
            onInventoryChange={setMaterialInventory}
          />
        </div>
      )}
      
      {/* 保存済み計算タブ */}
      {activeTab === 'saved' && (
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md p-4">
          <SavedCalculation 
            savedCalculations={savedCalculations}
            onDelete={deleteCalculation}
            onCombine={combineCalculations}
          />
        </div>
      )}
      
      {/* 計算結果表示 */}
      {calculationResults.length > 0 && (activeTab === 'character' || activeTab === 'weapon') && (
        <div className="mt-8 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              計算結果
            </h2>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={calculationName}
                onChange={(e) => setCalculationName(e.target.value)}
                placeholder="計算名を入力..."
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={saveCalculation}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors shadow-sm"
              >
                <i className="fas fa-save mr-1"></i>
                保存
              </button>
            </div>
          </div>
          
          <MaterialList 
            requirements={calculationResults}
            showDetails={true}
          />
          
          <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30 text-sm text-gray-600 dark:text-gray-400">
            <p className="flex items-center">
              <i className="fas fa-info-circle text-amber-500 mr-2"></i>
              所持している素材は計算から除外されています。素材の所持数は「素材在庫」タブで設定できます。
            </p>
          </div>
        </div>
      )}
      
      {/* コメントセクション */}
      <div className="mt-12">
        <CommentSection pageId="calculator" />
      </div>
    </div>
  );
} 