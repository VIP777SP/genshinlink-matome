'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSound } from '@/components/SoundService';
import FavoriteButton from '@/components/FavoriteButton';
import CommentSection from '@/components/CommentSection';

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
  const [currentLevel, setCurrentLevel] = useState<CharacterLevel>('1');
  const [targetLevel, setTargetLevel] = useState<CharacterLevel>('90');
  const [currentTalentLevel, setCurrentTalentLevel] = useState<TalentLevel>('1');
  const [targetTalentLevel, setTargetTalentLevel] = useState<TalentLevel>('10');
  const [currentWeaponLevel, setCurrentWeaponLevel] = useState<WeaponLevel>('1');
  const [targetWeaponLevel, setTargetWeaponLevel] = useState<WeaponLevel>('90');
  const [results, setResults] = useState<MaterialQuantity[]>([]);
  const { playSound } = useSound();

  // 計算タイプが変更されたときに結果をリセット
  useEffect(() => {
    setResults([]);
  }, [calcType]);

  // キャラクターレベルアップに必要な素材を計算
  const calculateCharacterMaterials = () => {
    playSound('click');
    
    const currentLevelIndex = parseInt(currentLevel);
    const targetLevelIndex = parseInt(targetLevel);
    
    if (targetLevelIndex <= currentLevelIndex) {
      alert('目標レベルは現在のレベルより高く設定してください。');
      return;
    }
    
    const currentExp = characterExpData[currentLevel].exp;
    const targetExp = characterExpData[targetLevel].exp;
    const expNeeded = targetExp - currentExp;
    
    const currentMora = characterExpData[currentLevel].mora;
    const targetMora = characterExpData[targetLevel].mora;
    const moraNeeded = targetMora - currentMora;
    
    // 大英雄の経験1つで20000の経験値
    const heroWitCount = Math.ceil(expNeeded / 20000);
    // モラ
    const moraCount = moraNeeded;
    
    const heroWit = materials.find(m => m.id === 'heros-wit')!;
    const mora = materials.find(m => m.id === 'mora')!;
    
    setResults([
      { material: heroWit, quantity: heroWitCount },
      { material: mora, quantity: moraCount }
    ]);
  };

  // タレントレベルアップに必要な素材を計算
  const calculateTalentMaterials = () => {
    playSound('click');
    
    const currentLevel = parseInt(currentTalentLevel);
    const targetLevel = parseInt(targetTalentLevel);
    
    if (targetLevel <= currentLevel) {
      alert('目標レベルは現在のレベルより高く設定してください。');
      return;
    }
    
    let totalMora = 0;
    const totalBooks = [0, 0, 0]; // 教え、導き、哲学の順
    const totalMaterials = [0, 0, 0]; // 通常、レア、ボス素材の順
    
    // 現在のレベルから目標レベルまで各レベルの必要素材を加算
    for (let level = currentLevel + 1; level <= targetLevel; level++) {
      const levelAsString = level.toString() as TalentLevel;
      const levelData = talentLevelUpData[levelAsString];
      totalMora += levelData.mora;
      
      for (let i = 0; i < 3; i++) {
        totalBooks[i] += levelData.books[i];
        totalMaterials[i] += levelData.materials[i];
      }
    }
    
    // 結果を素材オブジェクトの配列に変換
    const result: MaterialQuantity[] = [];
    
    // モラを追加
    const mora = materials.find(m => m.id === 'mora')!;
    result.push({ material: mora, quantity: totalMora });
    
    // 天賦本を追加
    if (totalBooks[0] > 0) {
      const teachingsOfFreedom = materials.find(m => m.id === 'teachings-of-freedom')!;
      result.push({ material: teachingsOfFreedom, quantity: totalBooks[0] });
    }
    
    if (totalBooks[1] > 0) {
      const guideToFreedom = materials.find(m => m.id === 'guide-to-freedom')!;
      result.push({ material: guideToFreedom, quantity: totalBooks[1] });
    }
    
    if (totalBooks[2] > 0) {
      const philosophiesOfFreedom = materials.find(m => m.id === 'philosophies-of-freedom')!;
      result.push({ material: philosophiesOfFreedom, quantity: totalBooks[2] });
    }
    
    // 素材を追加
    if (totalMaterials[0] > 0) {
      const slimeCondensate = materials.find(m => m.id === 'slime-condensate')!;
      result.push({ material: slimeCondensate, quantity: totalMaterials[0] });
    }
    
    if (totalMaterials[1] > 0) {
      const slimeSecretions = materials.find(m => m.id === 'slime-secretions')!;
      result.push({ material: slimeSecretions, quantity: totalMaterials[1] });
    }
    
    if (totalMaterials[2] > 0) {
      const slimeConcentrate = materials.find(m => m.id === 'slime-concentrate')!;
      result.push({ material: slimeConcentrate, quantity: totalMaterials[2] });
    }
    
    setResults(result);
  };

  // 武器レベルアップに必要な素材を計算
  const calculateWeaponMaterials = () => {
    playSound('click');
    
    const currentLevelIndex = parseInt(currentWeaponLevel);
    const targetLevelIndex = parseInt(targetWeaponLevel);
    
    if (targetLevelIndex <= currentLevelIndex) {
      alert('目標レベルは現在のレベルより高く設定してください。');
      return;
    }
    
    // const currentExp = weaponExpData[currentWeaponLevel].exp;
    // const targetExp = weaponExpData[targetWeaponLevel].exp;
    // const expNeeded = targetExp - currentExp;
    
    const currentMora = weaponExpData[currentWeaponLevel].mora;
    const targetMora = weaponExpData[targetWeaponLevel].mora;
    const moraNeeded = targetMora - currentMora;
    
    // 武器素材の必要数を簡易計算（実際のゲームではもっと複雑）
    // const weaponMaterialCount = Math.ceil(expNeeded / 10000);
    const ascensionMaterialCount = Math.ceil((targetLevelIndex - currentLevelIndex) / 20);
    
    const result: MaterialQuantity[] = [];
    
    // モラ
    const mora = materials.find(m => m.id === 'mora')!;
    result.push({ material: mora, quantity: moraNeeded });
    
    // 武器強化素材（デカラビアンシリーズを例として）
    if (ascensionMaterialCount > 0) {
      const tileOfDecarabiansTower = materials.find(m => m.id === 'tile-of-decarabians-tower')!;
      result.push({ material: tileOfDecarabiansTower, quantity: ascensionMaterialCount * 3 });
      
      const debrisOfDecarabiansCity = materials.find(m => m.id === 'debris-of-decarabians-city')!;
      result.push({ material: debrisOfDecarabiansCity, quantity: ascensionMaterialCount * 2 });
      
      const fragmentOfDecarabiansEpic = materials.find(m => m.id === 'fragment-of-decarabians-epic')!;
      result.push({ material: fragmentOfDecarabiansEpic, quantity: ascensionMaterialCount });
    }
    
    setResults(result);
  };

  // 計算を実行
  const handleCalculate = () => {
    switch (calcType) {
      case 'character':
        calculateCharacterMaterials();
        break;
      case 'talent':
        calculateTalentMaterials();
        break;
      case 'weapon':
        calculateWeaponMaterials();
        break;
    }
  };

  // タブ切り替え
  const handleTabChange = (type: 'character' | 'talent' | 'weapon') => {
    setCalcType(type);
    playSound('click');
  };

  return (
    <main className="max-w-6xl mx-auto relative">
      {/* 背景装飾パターン */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02] pointer-events-none overflow-hidden">
        {/* 直接SVGパターンを描画 */}
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="genshin-pattern-calculator" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              {/* 元素記号：風 */}
              <path d="M20,20 C25,15 35,15 40,20 C45,25 45,35 40,40 C35,45 25,45 20,40 C15,35 15,25 20,20 Z" 
                   fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              
              {/* 元素記号：岩 */}
              <path d="M70,20 L90,20 L80,40 Z" 
                   fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              
              {/* 元素記号：雷 */}
              <path d="M20,70 L25,80 L30,70 L35,90 L20,70" 
                   fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              
              {/* 元素記号：氷 */}
              <path d="M70,70 L90,70 M80,60 L80,80 M75,65 L85,75 M75,75 L85,65" 
                   fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              
              {/* 装飾的な円形 */}
              <circle cx="50" cy="50" r="20" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="#D4AF37" strokeWidth="0.3" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#genshin-pattern-calculator)"/>
        </svg>
        
        {/* カラフルなグラデーションの円 */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {/* SVGロゴを直接描画 */}
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              {/* 外側円 */}
              <circle cx="50" cy="50" r="48" fill="none" stroke="#FFB13B" strokeWidth="2" opacity="0.9"/>
              
              {/* 内側円 */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#FFB13B" strokeWidth="1.5" opacity="0.7"/>
              
              {/* 十字の星模様 */}
              <path d="M50,10 L50,90 M10,50 L90,50 M25,25 L75,75 M25,75 L75,25" 
                    stroke="#FFB13B" strokeWidth="1.5" opacity="0.8" strokeLinecap="round"/>
              
              {/* 装飾的な円 */}
              <circle cx="50" cy="50" r="20" fill="none" stroke="#FFB13B" strokeWidth="1" opacity="0.6"/>
              
              {/* 中央のシンボル */}
              <circle cx="50" cy="50" r="10" fill="#FFB13B" opacity="0.8"/>
              <circle cx="50" cy="50" r="6" fill="#FFF5E6" opacity="0.9"/>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-500 drop-shadow-sm">
            【素材計算機】
          </h1>
        </div>
        <FavoriteButton 
          id="calculator-page"
          title="素材計算機"
          url="/calculator"
          category="攻略情報"
        />
      </div>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        キャラクターや武器のレベルアップに必要な素材を計算できます。効率的な育成計画を立てましょう。
      </p>

      {/* 計算タイプタブ */}
      <div className="mb-6">
        <div className="flex border-b border-amber-300 dark:border-amber-700">
          <button
            className={`px-4 py-2 font-medium ${
              calcType === 'character'
                ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-b-2 border-amber-500'
                : 'text-gray-600 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => handleTabChange('character')}
          >
            キャラクターレベル
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              calcType === 'talent'
                ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-b-2 border-amber-500'
                : 'text-gray-600 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => handleTabChange('talent')}
          >
            天賦レベル
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              calcType === 'weapon'
                ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-b-2 border-amber-500'
                : 'text-gray-600 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => handleTabChange('weapon')}
          >
            武器レベル
          </button>
        </div>
      </div>

      {/* 計算フォーム */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-amber-200 dark:border-amber-900">
        {/* キャラクターレベル計算 */}
        {calcType === 'character' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-amber-800 dark:text-amber-400">
              キャラクターレベル計算
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">現在のレベル</label>
                <select
                  value={currentLevel}
                  onChange={(e) => {
                    setCurrentLevel(e.target.value as CharacterLevel);
                    playSound('click');
                  }}
                  className="w-full p-2 border border-amber-300 dark:border-amber-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
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
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">目標レベル</label>
                <select
                  value={targetLevel}
                  onChange={(e) => {
                    setTargetLevel(e.target.value as CharacterLevel);
                    playSound('click');
                  }}
                  className="w-full p-2 border border-amber-300 dark:border-amber-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
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
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              ※ 突破素材は含まれていません。この計算はキャラクターレベルアップに必要な経験値とモラのみ対象です。
            </div>
          </div>
        )}

        {/* 天賦レベル計算 */}
        {calcType === 'talent' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-amber-800 dark:text-amber-400">
              天賦レベル計算
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">現在の天賦レベル</label>
                <select
                  value={currentTalentLevel}
                  onChange={(e) => {
                    setCurrentTalentLevel(e.target.value as TalentLevel);
                    playSound('click');
                  }}
                  className="w-full p-2 border border-amber-300 dark:border-amber-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
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
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">目標の天賦レベル</label>
                <select
                  value={targetTalentLevel}
                  onChange={(e) => {
                    setTargetTalentLevel(e.target.value as TalentLevel);
                    playSound('click');
                  }}
                  className="w-full p-2 border border-amber-300 dark:border-amber-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
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
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              ※ これは1つの天賦に対する計算です。通常攻撃、元素スキル、元素爆発それぞれに同じ量の素材が必要です。
            </div>
          </div>
        )}

        {/* 武器レベル計算 */}
        {calcType === 'weapon' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-amber-800 dark:text-amber-400">
              武器レベル計算
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">現在の武器レベル</label>
                <select
                  value={currentWeaponLevel}
                  onChange={(e) => {
                    setCurrentWeaponLevel(e.target.value as WeaponLevel);
                    playSound('click');
                  }}
                  className="w-full p-2 border border-amber-300 dark:border-amber-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
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
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">目標の武器レベル</label>
                <select
                  value={targetWeaponLevel}
                  onChange={(e) => {
                    setTargetWeaponLevel(e.target.value as WeaponLevel);
                    playSound('click');
                  }}
                  className="w-full p-2 border border-amber-300 dark:border-amber-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
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
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              ※ この計算はサンプルで、実際のゲーム内での必要素材とは異なる場合があります。武器の種類やレアリティによって必要な素材も変わります。
            </div>
          </div>
        )}

        {/* 計算ボタン */}
        <button
          onClick={handleCalculate}
          className="mt-6 px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
        >
          <i className="fas fa-calculator mr-2"></i>計算する
        </button>
      </div>

      {/* 計算結果 */}
      {results.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-amber-200 dark:border-amber-900">
          <h2 className="text-xl font-semibold mb-4 text-amber-800 dark:text-amber-400">
            計算結果
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {results.map((result, index) => {
              const colors = rarityColors[result.material.rarity];
              
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${colors.bg} ${colors.border} ${colors.darkBg} ${colors.darkBorder} flex items-center`}
                >
                  <div className="w-12 h-12 mr-4 flex-shrink-0 relative">
                    <Image 
                      src={result.material.imageUrl} 
                      alt={result.material.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${colors.text} ${colors.darkText}`}>
                      {result.material.name}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      必要数: <span className="font-bold">{result.quantity.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/30 rounded text-amber-800 dark:text-amber-200 text-sm">
            <p className="flex items-start">
              <i className="fas fa-info-circle mt-1 mr-2"></i>
              <span>
                これは概算です。実際のゲーム内では、すでに持っている素材や異なる素材の組み合わせによって必要数が変わる場合があります。
                また、キャラクターや武器の突破に必要なボス素材や特殊素材は含まれていません。
              </span>
            </p>
          </div>
        </div>
      )}
      
      {/* コメントセクション */}
      <CommentSection pageId="calculator" />
    </main>
  );
} 