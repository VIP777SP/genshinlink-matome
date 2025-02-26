import { MaterialRequirement } from './materials';

// 元素タイプの定義
export type ElementType = 'pyro' | 'hydro' | 'anemo' | 'electro' | 'dendro' | 'cryo' | 'geo';

// 武器タイプの定義
export type WeaponType = 'sword' | 'claymore' | 'polearm' | 'bow' | 'catalyst';

// キャラクターの型定義
export interface Character {
  id: string;
  name: string;
  element: ElementType;
  weapon: WeaponType;
  rarity: 4 | 5;
  region: string;
  ascension: {
    gemstone: string; // 元素石のID
    boss: string;     // ボス素材のID
    specialty: string; // 特産品のID
    common: string;   // 敵ドロップ素材のベースID (例: slime -> slime-condensate, slime-secretions, slime-concentrate)
  };
  talent: {
    book: string;     // 天賦本のベースID (例: freedom -> teachings-of-freedom, guide-to-freedom, philosophies-of-freedom)
    weekday: string[];  // 天賦本が入手可能な曜日
    boss: string;     // 週ボス素材のID
  };
  imageUrl: string;  // 後のためにPNG画像パスを保持
}

// キャラクターリスト
export const characters: Character[] = [
  // 5つ星キャラクター
  {
    id: 'hutao',
    name: '胡桃',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 5,
    region: '璃月',
    ascension: {
      gemstone: 'agnidus-agate',
      boss: 'juvenile-jade',
      specialty: 'silk-flower',
      common: 'slime',
    },
    talent: {
      book: 'diligence',
      weekday: ['火', '金', '日'],
      boss: 'shard-of-foul-legacy',
    },
    imageUrl: '/images/characters/hutao.png',
  },
  {
    id: 'ayaka',
    name: '神里綾華',
    element: 'cryo',
    weapon: 'sword',
    rarity: 5,
    region: '稲妻',
    ascension: {
      gemstone: 'shivada-jade',
      boss: 'perpetual-heart',
      specialty: 'sakura-bloom',
      common: 'handguard',
    },
    talent: {
      book: 'elegance',
      weekday: ['火', '金', '日'],
      boss: 'bloodjade-branch',
    },
    imageUrl: '/images/characters/ayaka.png',
  },
  {
    id: 'raiden-shogun',
    name: '雷電将軍',
    element: 'electro',
    weapon: 'polearm',
    rarity: 5,
    region: '稲妻',
    ascension: {
      gemstone: 'vajrada-amethyst',
      boss: 'storm-beads',
      specialty: 'amakumo-fruit',
      common: 'handguard',
    },
    talent: {
      book: 'light',
      weekday: ['水', '土', '日'],
      boss: 'molten-moment',
    },
    imageUrl: '/images/characters/raiden-shogun.png',
  },
  {
    id: 'kazuha',
    name: '楓原万葉',
    element: 'anemo',
    weapon: 'sword',
    rarity: 5,
    region: '稲妻',
    ascension: {
      gemstone: 'vayuda-turquoise',
      boss: 'marionette-core',
      specialty: 'sea-ganoderma',
      common: 'treasure-hoarder-insignia',
    },
    talent: {
      book: 'diligence',
      weekday: ['火', '金', '日'],
      boss: 'gilded-scale',
    },
    imageUrl: '/images/characters/kazuha.png',
  },
  {
    id: 'zhongli',
    name: '鍾離',
    element: 'geo',
    weapon: 'polearm',
    rarity: 5,
    region: '璃月',
    ascension: {
      gemstone: 'prithiva-topaz',
      boss: 'basalt-pillar',
      specialty: 'cor-lapis',
      common: 'slime',
    },
    talent: {
      book: 'gold',
      weekday: ['水', '土', '日'],
      boss: 'tusk-of-monoceros-caeli',
    },
    imageUrl: '/images/characters/zhongli.png',
  },
  
  // 4つ星キャラクター
  {
    id: 'bennett',
    name: 'ベネット',
    element: 'pyro',
    weapon: 'sword',
    rarity: 4,
    region: 'モンド',
    ascension: {
      gemstone: 'agnidus-agate',
      boss: 'everflame-seed',
      specialty: 'windwheel-aster',
      common: 'treasure-hoarder-insignia',
    },
    talent: {
      book: 'resistance',
      weekday: ['火', '金', '日'],
      boss: 'dvalins-plume',
    },
    imageUrl: '/images/characters/bennett.png',
  },
  {
    id: 'xingqiu',
    name: '行秋',
    element: 'hydro',
    weapon: 'sword',
    rarity: 4,
    region: '璃月',
    ascension: {
      gemstone: 'varunada-lazurite',
      boss: 'cleansing-heart',
      specialty: 'silk-flower',
      common: 'mask',
    },
    talent: {
      book: 'gold',
      weekday: ['水', '土', '日'],
      boss: 'tail-of-boreas',
    },
    imageUrl: '/images/characters/xingqiu.png',
  },
  {
    id: 'xiangling',
    name: '香菱',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 4,
    region: '璃月',
    ascension: {
      gemstone: 'agnidus-agate',
      boss: 'everflame-seed',
      specialty: 'jueyun-chili',
      common: 'slime',
    },
    talent: {
      book: 'diligence',
      weekday: ['火', '金', '日'],
      boss: 'dvalins-claw',
    },
    imageUrl: '/images/characters/xiangling.png',
  }
];

// IDをキーとしたマップを作成（検索用）
export const charactersMap = new Map<string, Character>();
characters.forEach(character => {
  charactersMap.set(character.id, character);
});

// キャラクターのレベルアップに必要な素材を計算する関数
export function calculateCharacterAscensionMaterials(
  characterId: string, 
  currentLevel: number, 
  targetLevel: number
): MaterialRequirement[] {
  const character = charactersMap.get(characterId);
  if (!character) return [];

  // レベル範囲に応じた必要素材
  const requirements: MaterialRequirement[] = [];
  
  // 簡易バージョン - 実際はより複雑な計算が必要
  // レベル80→90の場合の必要素材の例:
  if (currentLevel < 80 && targetLevel >= 80) {
    // モラ
    requirements.push({ materialId: 'mora', amount: 120000 });
    
    // 元素石 - 最高レアリティ
    requirements.push({ materialId: character.ascension.gemstone, amount: 6 });
    
    // ボス素材
    requirements.push({ materialId: character.ascension.boss, amount: 20 });
    
    // 特産品
    requirements.push({ materialId: character.ascension.specialty, amount: 60 });
    
    // 敵ドロップ素材 - 最高レアリティ
    requirements.push({ materialId: `${character.ascension.common}-concentrate`, amount: 24 });
  }
  
  return requirements;
}

// キャラクターの天賦レベルアップに必要な素材を計算する関数
export function calculateTalentMaterials(
  characterId: string, 
  currentLevel: number, 
  targetLevel: number
): MaterialRequirement[] {
  const character = charactersMap.get(characterId);
  if (!character) return [];

  // レベル範囲に応じた必要素材
  const requirements: MaterialRequirement[] = [];
  
  // 簡易バージョン - 実際はより複雑な計算が必要
  // レベル8→10の場合の必要素材の例:
  if (currentLevel < 8 && targetLevel >= 8) {
    // モラ
    requirements.push({ materialId: 'mora', amount: 700000 });
    
    // 天賦本 - 最高レアリティ
    requirements.push({ materialId: `philosophies-of-${character.talent.book}`, amount: 12 });
    
    // 週ボス素材
    requirements.push({ materialId: character.talent.boss, amount: 2 });
    
    // 敵ドロップ素材 - 最高レアリティ
    requirements.push({ materialId: `${character.ascension.common}-concentrate`, amount: 18 });
  }
  
  return requirements;
}

// キャラクターのレベルと天賦を統合して計算する関数
export function calculateCharacterAllMaterials(
  characterId: string,
  currentLevel: number,
  targetLevel: number,
  currentTalentLevels: [number, number, number], // [通常攻撃, 元素スキル, 元素爆発]
  targetTalentLevels: [number, number, number],
  inventory: Record<string, number> = {} // 既存の素材所持数
): MaterialRequirement[] {
  // レベルアップ素材を計算
  const levelMaterials = calculateCharacterAscensionMaterials(
    characterId,
    currentLevel,
    targetLevel
  );
  
  // 天賦素材を計算（3つの天賦分）
  const talentMaterials: MaterialRequirement[] = [];
  for (let i = 0; i < 3; i++) {
    if (targetTalentLevels[i] > currentTalentLevels[i]) {
      const singleTalentMaterials = calculateTalentMaterials(
        characterId,
        currentTalentLevels[i],
        targetTalentLevels[i]
      );
      // 天賦素材を統合リストに追加
      singleTalentMaterials.forEach(material => {
        const existingIndex = talentMaterials.findIndex(m => m.materialId === material.materialId);
        if (existingIndex >= 0) {
          talentMaterials[existingIndex].amount += material.amount;
        } else {
          talentMaterials.push({ ...material });
        }
      });
    }
  }
  
  // 全ての素材要件を統合
  const allRequirements: MaterialRequirement[] = [];
  
  // レベルアップ素材を追加
  levelMaterials.forEach(material => {
    const existingIndex = allRequirements.findIndex(m => m.materialId === material.materialId);
    if (existingIndex >= 0) {
      allRequirements[existingIndex].amount += material.amount;
    } else {
      allRequirements.push({ ...material });
    }
  });
  
  // 天賦素材を追加
  talentMaterials.forEach(material => {
    const existingIndex = allRequirements.findIndex(m => m.materialId === material.materialId);
    if (existingIndex >= 0) {
      allRequirements[existingIndex].amount += material.amount;
    } else {
      allRequirements.push({ ...material });
    }
  });
  
  // 所持素材を差し引く
  return allRequirements.map(material => {
    const owned = inventory[material.materialId] || 0;
    const needed = Math.max(0, material.amount - owned);
    return {
      materialId: material.materialId,
      amount: needed,
      totalAmount: material.amount, // 総必要数も保持
      owned: owned // 所持数も保持
    };
  }).filter(material => material.amount > 0); // 所持数で満たされているものは除外
} 