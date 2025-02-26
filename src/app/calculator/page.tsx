'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSound } from '@/components/SoundService';
import FavoriteButton from '@/components/FavoriteButton';
import CommentSection from '@/components/CommentSection';
import CharacterSelector from '@/components/calculator/CharacterSelector';
import WeaponSelector from '@/components/calculator/WeaponSelector';
import MaterialList from '@/components/calculator/MaterialList';

// データインポート
import { characters, charactersMap, calculateCharacterAscensionMaterials, calculateTalentMaterials } from '@/data/characters';
import { weapons, weaponsMap, calculateWeaponAscensionMaterials } from '@/data/weapons';
import { MaterialRequirement } from '@/data/materials';

// 素材タイプの定義
type MaterialType = 'exp' | 'mora' | 'ascension' | 'talent' | 'weapon';

// キャラクターレベルの型定義
type CharacterLevel = '1' | '20' | '40' | '50' | '60' | '70' | '80' | '90';
type TalentLevel = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
type WeaponLevel = '1' | '20' | '40' | '50' | '60' | '70' | '80' | '90';

// 素材の型定義
interface Material {
  id: string;
  name: string;
  type: MaterialType;
  rarity: 1 | 2 | 3 | 4 | 5;
  imageUrl: string;
}

// 素材計算に必要な数量の型定義
interface MaterialQuantity {
  material: Material;
  quantity: number;
}

// サンプル素材データ
const materials: Material[] = [
  {
    id: 'heros-wit',
    name: '大英雄の経験',
    type: 'exp',
    rarity: 4,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/7/71/Item_Hero%27s_Wit.png'
  },
  {
    id: 'adventurers-experience',
    name: '冒険家の経験',
    type: 'exp',
    rarity: 3,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/2/26/Item_Adventurer%27s_Experience.png'
  },
  {
    id: 'mora',
    name: 'モラ',
    type: 'mora',
    rarity: 3,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/8/84/Item_Mora.png'
  },
  {
    id: 'slime-condensate',
    name: 'スライムの液体',
    type: 'ascension',
    rarity: 1,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/6/6a/Item_Slime_Condensate.png'
  },
  {
    id: 'slime-secretions',
    name: 'スライムの分泌物',
    type: 'ascension',
    rarity: 2,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/b/b3/Item_Slime_Secretions.png'
  },
  {
    id: 'slime-concentrate',
    name: 'スライムの原液',
    type: 'ascension',
    rarity: 3,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a3/Item_Slime_Concentrate.png'
  },
  {
    id: 'teachings-of-freedom',
    name: '「自由」の教え',
    type: 'talent',
    rarity: 2,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/c/c4/Item_Teachings_of_Freedom.png'
  },
  {
    id: 'guide-to-freedom',
    name: '「自由」の導き',
    type: 'talent',
    rarity: 3,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/8/82/Item_Guide_to_Freedom.png'
  },
  {
    id: 'philosophies-of-freedom',
    name: '「自由」の哲学',
    type: 'talent',
    rarity: 4,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/0/0b/Item_Philosophies_of_Freedom.png'
  },
  {
    id: 'tile-of-decarabians-tower',
    name: 'デカラビアンの塔の残欠',
    type: 'weapon',
    rarity: 2,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/4/40/Item_Tile_of_Decarabian%27s_Tower.png'
  },
  {
    id: 'debris-of-decarabians-city',
    name: 'デカラビアンの都の碑',
    type: 'weapon',
    rarity: 3,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/1/1a/Item_Debris_of_Decarabian%27s_City.png'
  },
  {
    id: 'fragment-of-decarabians-epic',
    name: 'デカラビアンの伝説',
    type: 'weapon',
    rarity: 4,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/9/9c/Item_Fragment_of_Decarabian%27s_Epic.png'
  },
  {
    id: 'agnidus-agate-sliver',
    name: '燃願のアゲート・緑',
    type: 'ascension',
    rarity: 2,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/5/57/Item_Agnidus_Agate_Sliver.png'
  },
  {
    id: 'agnidus-agate-fragment',
    name: '燃願のアゲート・欠片',
    type: 'ascension',
    rarity: 3,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/f/f8/Item_Agnidus_Agate_Fragment.png'
  },
  {
    id: 'agnidus-agate-chunk',
    name: '燃願のアゲート・塊',
    type: 'ascension',
    rarity: 4,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/2/2c/Item_Agnidus_Agate_Chunk.png'
  },
  {
    id: 'agnidus-agate-gemstone',
    name: '燃願のアゲート・輝石',
    type: 'ascension',
    rarity: 5,
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/e/ef/Item_Agnidus_Agate_Gemstone.png'
  }
];

// キャラクターレベルとタレントレベルの計算データ
const characterExpData: Record<CharacterLevel, { exp: number; mora: number }> = {
  '1': { exp: 0, mora: 0 },
  '20': { exp: 120175, mora: 24000 },
  '40': { exp: 578325, mora: 115800 },
  '50': { exp: 1195925, mora: 239200 },
  '60': { exp: 2061375, mora: 412400 },
  '70': { exp: 3249950, mora: 650000 },
  '80': { exp: 4819950, mora: 964000 },
  '90': { exp: 8362650, mora: 1673400 }
};

// タレントレベルアップに必要なモラと素材
const talentLevelUpData: Record<TalentLevel, { mora: number; books: number[]; materials: number[] }> = {
  '1': { mora: 0, books: [0, 0, 0], materials: [0, 0, 0] },
  '2': { mora: 12500, books: [3, 0, 0], materials: [6, 0, 0] },
  '3': { mora: 17500, books: [0, 2, 0], materials: [3, 0, 0] },
  '4': { mora: 25000, books: [0, 4, 0], materials: [4, 0, 0] },
  '5': { mora: 30000, books: [0, 6, 0], materials: [6, 0, 0] },
  '6': { mora: 37500, books: [0, 9, 0], materials: [9, 0, 0] },
  '7': { mora: 120000, books: [0, 0, 4], materials: [0, 4, 0] },
  '8': { mora: 260000, books: [0, 0, 6], materials: [0, 6, 0] },
  '9': { mora: 450000, books: [0, 0, 12], materials: [0, 9, 0] },
  '10': { mora: 700000, books: [0, 0, 16], materials: [0, 0, 4] }
};

// 武器レベルアップに必要な素材
const weaponExpData: Record<WeaponLevel, { exp: number; mora: number }> = {
  '1': { exp: 0, mora: 0 },
  '20': { exp: 81000, mora: 16200 },
  '40': { exp: 270475, mora: 54095 },
  '50': { exp: 552550, mora: 110510 },
  '60': { exp: 947425, mora: 189485 },
  '70': { exp: 1485300, mora: 297060 },
  '80': { exp: 2196175, mora: 439235 },
  '90': { exp: 3319625, mora: 663925 }
};

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

export default function CalculatorPage() {
  const [calcType, setCalcType] = useState<'character' | 'talent' | 'weapon'>('character');
  
  // キャラクター関連の状態
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<CharacterLevel>('1');
  const [targetLevel, setTargetLevel] = useState<CharacterLevel>('90');
  
  // 天賦関連の状態
  const [currentTalentLevel, setCurrentTalentLevel] = useState<TalentLevel>('1');
  const [targetTalentLevel, setTargetTalentLevel] = useState<TalentLevel>('10');
  
  // 武器関連の状態
  const [selectedWeaponId, setSelectedWeaponId] = useState<string | null>(null);
  const [currentWeaponLevel, setCurrentWeaponLevel] = useState<WeaponLevel>('1');
  const [targetWeaponLevel, setTargetWeaponLevel] = useState<WeaponLevel>('90');
  
  // 計算結果
  const [requirements, setRequirements] = useState<MaterialRequirement[]>([]);
  
  const { playSound } = useSound();

  // キャラクターまたは武器が選択されたときに適切な計算を実行
  useEffect(() => {
    if (calcType === 'character' && selectedCharacterId) {
      calculateCharacterMaterials();
    } else if (calcType === 'talent' && selectedCharacterId) {
      calculateTalentMats();
    } else if (calcType === 'weapon' && selectedWeaponId) {
      calculateWeaponMaterials();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCharacterId, selectedWeaponId, currentLevel, targetLevel, currentTalentLevel, targetTalentLevel, currentWeaponLevel, targetWeaponLevel]);

  // タブが変更されたときに結果をリセット
  useEffect(() => {
    setRequirements([]);
    // キャラクター選択タブ時は武器選択を、武器選択タブ時はキャラクター選択をリセットする
    if (calcType === 'weapon') {
      setSelectedCharacterId(null);
    } else {
      setSelectedWeaponId(null);
    }
  }, [calcType]);

  // キャラクターのレベルアップに必要な素材を計算
  const calculateCharacterMaterials = () => {
    if (!selectedCharacterId) return;
    
    playSound('click');
    
    const currentLevelNum = parseInt(currentLevel);
    const targetLevelNum = parseInt(targetLevel);
    
    if (targetLevelNum <= currentLevelNum) {
      alert('目標レベルは現在のレベルより高く設定してください。');
      return;
    }
    
    const materials = calculateCharacterAscensionMaterials(
      selectedCharacterId,
      currentLevelNum,
      targetLevelNum
    );
    
    setRequirements(materials);
  };

  // キャラクターの天賦レベルアップに必要な素材を計算
  const calculateTalentMats = () => {
    if (!selectedCharacterId) return;
    
    playSound('click');
    
    const currentLevel = parseInt(currentTalentLevel);
    const targetLevel = parseInt(targetTalentLevel);
    
    if (targetLevel <= currentLevel) {
      alert('目標レベルは現在のレベルより高く設定してください。');
      return;
    }
    
    const materials = calculateTalentMaterials(
      selectedCharacterId,
      currentLevel,
      targetLevel
    );
    
    setRequirements(materials);
  };

  // 武器のレベルアップに必要な素材を計算
  const calculateWeaponMaterials = () => {
    if (!selectedWeaponId) return;
    
    playSound('click');
    
    const currentLevel = parseInt(currentWeaponLevel);
    const targetLevel = parseInt(targetWeaponLevel);
    
    if (targetLevel <= currentLevel) {
      alert('目標レベルは現在のレベルより高く設定してください。');
      return;
    }
    
    const materials = calculateWeaponAscensionMaterials(
      selectedWeaponId,
      currentLevel,
      targetLevel
    );
    
    setRequirements(materials);
  };

  return (
    <main className="max-w-6xl mx-auto">
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
        キャラクターと武器の育成に必要な素材を計算します。育てたいキャラクターや武器を選択して、現在のレベルと目標レベルを入力してください。
      </p>

      {/* 計算タイプタブ */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button
              onClick={() => setCalcType('character')}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                calcType === 'character'
                  ? 'text-amber-600 border-amber-600 dark:text-amber-400 dark:border-amber-400'
                  : 'border-transparent hover:text-amber-600 hover:border-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <i className="fas fa-user mr-2"></i>キャラクターレベルアップ
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setCalcType('talent')}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                calcType === 'talent'
                  ? 'text-amber-600 border-amber-600 dark:text-amber-400 dark:border-amber-400'
                  : 'border-transparent hover:text-amber-600 hover:border-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <i className="fas fa-book-open mr-2"></i>天賦レベルアップ
            </button>
          </li>
          <li>
            <button
              onClick={() => setCalcType('weapon')}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                calcType === 'weapon'
                  ? 'text-amber-600 border-amber-600 dark:text-amber-400 dark:border-amber-400'
                  : 'border-transparent hover:text-amber-600 hover:border-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <i className="fas fa-sword mr-2"></i>武器レベルアップ
            </button>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左カラム: キャラクター/武器選択 */}
        <div className="md:col-span-2">
          {calcType !== 'weapon' ? (
            <>
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                キャラクター選択
              </h2>
              <CharacterSelector
                characters={characters}
                selectedCharacterId={selectedCharacterId}
                onSelectCharacter={setSelectedCharacterId}
              />
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                武器選択
              </h2>
              <WeaponSelector
                weapons={weapons}
                selectedWeaponId={selectedWeaponId}
                onSelectWeapon={setSelectedWeaponId}
              />
            </>
          )}
        </div>

        {/* 右カラム: レベル設定 */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            {calcType === 'character' && 'キャラクターレベル設定'}
            {calcType === 'talent' && '天賦レベル設定'}
            {calcType === 'weapon' && '武器レベル設定'}
          </h2>
          
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-md p-4">
            {/* キャラクターレベル設定 */}
            {calcType === 'character' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    現在のレベル:
                  </label>
                  <select
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value as CharacterLevel)}
                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <option value="1">Lv. 1</option>
                    <option value="20">Lv. 20</option>
                    <option value="40">Lv. 40</option>
                    <option value="50">Lv. 50</option>
                    <option value="60">Lv. 60</option>
                    <option value="70">Lv. 70</option>
                    <option value="80">Lv. 80</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    目標レベル:
                  </label>
                  <select
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value as CharacterLevel)}
                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <option value="20">Lv. 20</option>
                    <option value="40">Lv. 40</option>
                    <option value="50">Lv. 50</option>
                    <option value="60">Lv. 60</option>
                    <option value="70">Lv. 70</option>
                    <option value="80">Lv. 80</option>
                    <option value="90">Lv. 90</option>
                  </select>
                </div>
              </>
            )}
            
            {/* 天賦レベル設定 */}
            {calcType === 'talent' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    現在の天賦レベル:
                  </label>
                  <select
                    value={currentTalentLevel}
                    onChange={(e) => setCurrentTalentLevel(e.target.value as TalentLevel)}
                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <option value="1">Lv. 1</option>
                    <option value="2">Lv. 2</option>
                    <option value="3">Lv. 3</option>
                    <option value="4">Lv. 4</option>
                    <option value="5">Lv. 5</option>
                    <option value="6">Lv. 6</option>
                    <option value="7">Lv. 7</option>
                    <option value="8">Lv. 8</option>
                    <option value="9">Lv. 9</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    目標の天賦レベル:
                  </label>
                  <select
                    value={targetTalentLevel}
                    onChange={(e) => setTargetTalentLevel(e.target.value as TalentLevel)}
                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <option value="2">Lv. 2</option>
                    <option value="3">Lv. 3</option>
                    <option value="4">Lv. 4</option>
                    <option value="5">Lv. 5</option>
                    <option value="6">Lv. 6</option>
                    <option value="7">Lv. 7</option>
                    <option value="8">Lv. 8</option>
                    <option value="9">Lv. 9</option>
                    <option value="10">Lv. 10</option>
                  </select>
                </div>
              </>
            )}
            
            {/* 武器レベル設定 */}
            {calcType === 'weapon' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    現在のレベル:
                  </label>
                  <select
                    value={currentWeaponLevel}
                    onChange={(e) => setCurrentWeaponLevel(e.target.value as WeaponLevel)}
                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <option value="1">Lv. 1</option>
                    <option value="20">Lv. 20</option>
                    <option value="40">Lv. 40</option>
                    <option value="50">Lv. 50</option>
                    <option value="60">Lv. 60</option>
                    <option value="70">Lv. 70</option>
                    <option value="80">Lv. 80</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    目標レベル:
                  </label>
                  <select
                    value={targetWeaponLevel}
                    onChange={(e) => setTargetWeaponLevel(e.target.value as WeaponLevel)}
                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <option value="20">Lv. 20</option>
                    <option value="40">Lv. 40</option>
                    <option value="50">Lv. 50</option>
                    <option value="60">Lv. 60</option>
                    <option value="70">Lv. 70</option>
                    <option value="80">Lv. 80</option>
                    <option value="90">Lv. 90</option>
                  </select>
                </div>
              </>
            )}

            {/* 選択情報とボタン */}
            <div className="mt-6">
              {calcType !== 'weapon' && selectedCharacterId && (
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 mr-3">
                    <Image
                      src={charactersMap.get(selectedCharacterId)?.imageUrl.replace('.png', '-icon.png') || ''}
                      alt={charactersMap.get(selectedCharacterId)?.name || ''}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-bold">{charactersMap.get(selectedCharacterId)?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {charactersMap.get(selectedCharacterId)?.element} / {charactersMap.get(selectedCharacterId)?.weapon}
                    </p>
                  </div>
                </div>
              )}
              
              {calcType === 'weapon' && selectedWeaponId && (
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 mr-3">
                    <Image
                      src={weaponsMap.get(selectedWeaponId)?.imageUrl || ''}
                      alt={weaponsMap.get(selectedWeaponId)?.name || ''}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-bold">{weaponsMap.get(selectedWeaponId)?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {weaponsMap.get(selectedWeaponId)?.type} / {'★'.repeat(weaponsMap.get(selectedWeaponId)?.rarity || 0)}
                    </p>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => {
                  if (calcType === 'character') calculateCharacterMaterials();
                  else if (calcType === 'talent') calculateTalentMats();
                  else calculateWeaponMaterials();
                }}
                disabled={
                  (calcType !== 'weapon' && !selectedCharacterId) || 
                  (calcType === 'weapon' && !selectedWeaponId)
                }
                className={`
                  w-full py-3 rounded-lg text-white font-medium transition-colors
                  ${
                    ((calcType !== 'weapon' && !selectedCharacterId) || (calcType === 'weapon' && !selectedWeaponId))
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }
                `}
              >
                <i className="fas fa-calculator mr-2"></i>
                素材を計算する
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 計算結果 */}
      {requirements.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            必要素材一覧
          </h2>
          <MaterialList 
            requirements={requirements} 
            title={
              calcType === 'character'
                ? 'キャラクターレベルアップ素材'
                : calcType === 'talent'
                ? '天賦レベルアップ素材'
                : '武器レベルアップ素材'
            }
          />
        </div>
      )}

      {/* 注意事項とヘルプ */}
      <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800 text-sm">
        <h3 className="font-bold mb-2 text-amber-800 dark:text-amber-400">素材計算についての注意</h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <i className="fas fa-info-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
            <span>経験値計算では大英雄の経験のみを使用した場合の数値を表示しています。冒険家の経験などを組み合わせると必要数が変わる場合があります。</span>
          </li>
          <li className="flex items-start">
            <i className="fas fa-info-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
            <span>天賦レベルアップでは、1つの天賦に対する素材を表示しています。3つの天賦すべてを上げる場合は、表示された量の3倍が必要です。</span>
          </li>
          <li className="flex items-start">
            <i className="fas fa-info-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
            <span>この計算機はゲーム内のデータに基づいていますが、アップデートによって変更される場合があります。</span>
          </li>
        </ul>
      </div>

      {/* コメントセクション */}
      <CommentSection pageId="calculator" />
    </main>
  );
} 