import { MaterialRequirement } from './materials';
import { WeaponType } from './characters';

// 武器の型定義
export interface Weapon {
  id: string;
  name: string;
  type: WeaponType;
  rarity: 3 | 4 | 5;
  baseAtk: number;
  subStat: string;
  subStatValue: number;
  passive: string;
  ascension: {
    material: string;  // 武器素材のベースID (例: decarabian -> tile-of-decarabians-tower, debris-of-decarabians-city, ...)
    elite: string;     // エリート敵素材のベースID
    common: string;    // 通常敵素材のベースID
  };
  imageUrl: string;
}

// 武器リスト
export const weapons: Weapon[] = [
  // 5つ星武器
  {
    id: 'staff-of-homa',
    name: '護摩の杖',
    type: 'polearm',
    rarity: 5,
    baseAtk: 608,
    subStat: '会心ダメージ',
    subStatValue: 66.2,
    passive: 'HP上限が20%増加。さらに、装備キャラクターのHP上限の0.8%分、攻撃力がアップする。HP50%以下の時、この効果は1%分に上昇する。',
    ascension: {
      material: 'aerosiderite',
      elite: 'mist-grass',
      common: 'slime',
    },
    imageUrl: '/images/weapons/staff-of-homa.png',
  },
  {
    id: 'mistsplitter-reforged',
    name: '霧切の廻光',
    type: 'sword',
    rarity: 5,
    baseAtk: 674,
    subStat: '会心ダメージ',
    subStatValue: 44.1,
    passive: '元素ダメージ+12%。元素スキルか元素爆発を発動後、「霧切の巴」効果を獲得。継続時間8秒。「霧切の巴」：通常攻撃によって元素ダメージを与えると、8秒間該当元素のダメージ+8%/16%/28%(スタック1/2/3)。',
    ascension: {
      material: 'distant-sea',
      elite: 'chaos-gear',
      common: 'handguard',
    },
    imageUrl: '/images/weapons/mistsplitter-reforged.png',
  },
  {
    id: 'engulfing-lightning',
    name: '草薙の稲光',
    type: 'polearm',
    rarity: 5,
    baseAtk: 608,
    subStat: '元素チャージ効率',
    subStatValue: 55.1,
    passive: '元素チャージ効率+30%。元素チャージ効率の初期値の100%を超えた分の28%、攻撃力をアップする(最大80%)。元素爆発発動後12秒間、元素チャージ効率+30%。',
    ascension: {
      material: 'mask',
      elite: 'chaos-gear',
      common: 'handguard',
    },
    imageUrl: '/images/weapons/engulfing-lightning.png',
  },
  
  // 4つ星武器
  {
    id: 'the-catch',
    name: '「漁獲」',
    type: 'polearm',
    rarity: 4,
    baseAtk: 510,
    subStat: '元素チャージ効率',
    subStatValue: 45.9,
    passive: '元素爆発のダメージ+16%、元素爆発の会心率+6%。',
    ascension: {
      material: 'mask',
      elite: 'chaos-gear',
      common: 'handguard',
    },
    imageUrl: '/images/weapons/the-catch.png',
  },
  {
    id: 'amenoma-kageuchi',
    name: '波乱月白経津',
    type: 'sword',
    rarity: 4,
    baseAtk: 454,
    subStat: '攻撃力%',
    subStatValue: 55.1,
    passive: '元素スキル発動後、継続時間30秒の「波乱」効果を獲得。「波乱」効果は最大3重まで、重ごとに5秒毎に元素エネルギーを6回復する。',
    ascension: {
      material: 'distant-sea',
      elite: 'chaos-gear',
      common: 'handguard',
    },
    imageUrl: '/images/weapons/amenoma-kageuchi.png',
  },
  {
    id: 'lions-roar',
    name: '匣中龍吟',
    type: 'sword',
    rarity: 4,
    baseAtk: 510,
    subStat: '攻撃力%',
    subStatValue: 41.3,
    passive: '炎元素または雷元素の影響を受けた敵に対するダメージ+20%。',
    ascension: {
      material: 'guyun',
      elite: 'mist-grass',
      common: 'treasure-hoarder-insignia',
    },
    imageUrl: '/images/weapons/lions-roar.png',
  },
  {
    id: 'dragon-bane',
    name: '匣中滅龍',
    type: 'polearm',
    rarity: 4,
    baseAtk: 454,
    subStat: '元素熟知',
    subStatValue: 221,
    passive: '炎元素または水元素の影響を受けた敵に対するダメージ+20%。',
    ascension: {
      material: 'mist-veiled-elixir',
      elite: 'mist-grass',
      common: 'fatui-insignia',
    },
    imageUrl: '/images/weapons/dragon-bane.png',
  },
  
  // 3つ星武器
  {
    id: 'black-tassel',
    name: '黒纓槍',
    type: 'polearm',
    rarity: 3,
    baseAtk: 354,
    subStat: 'HP%',
    subStatValue: 46.9,
    passive: 'スライム敵に対するダメージ+40%。',
    ascension: {
      material: 'aerosiderite',
      elite: 'bone-shard',
      common: 'fatui-insignia',
    },
    imageUrl: '/images/weapons/black-tassel.png',
  },
  {
    id: 'harbinger-of-dawn',
    name: '黎明の神剣',
    type: 'sword',
    rarity: 3,
    baseAtk: 401,
    subStat: '会心ダメージ',
    subStatValue: 46.9,
    passive: 'HP90%以上の時、会心率+14%。',
    ascension: {
      material: 'boreal-wolf',
      elite: 'mist-grass',
      common: 'hilichurl-mask',
    },
    imageUrl: '/images/weapons/harbinger-of-dawn.png',
  }
];

// IDをキーとしたマップを作成（検索用）
export const weaponsMap = new Map<string, Weapon>();
weapons.forEach(weapon => {
  weaponsMap.set(weapon.id, weapon);
});

// 武器のレベルアップに必要な素材を計算する関数
export function calculateWeaponAscensionMaterials(
  weaponId: string, 
  currentLevel: number, 
  targetLevel: number
): MaterialRequirement[] {
  const weapon = weaponsMap.get(weaponId);
  if (!weapon) return [];

  // レベル範囲に応じた必要素材
  const requirements: MaterialRequirement[] = [];
  
  // 簡易バージョン - 実際はより複雑な計算が必要
  // レベル80→90の場合の必要素材の例:
  if (currentLevel < 80 && targetLevel >= 80) {
    // モラ
    requirements.push({ materialId: 'mora', amount: 150000 });
    
    // 武器素材 - 最高レアリティ
    const materialLevel = weapon.rarity >= 4 ? 'epic' : 'chunk';
    requirements.push({ materialId: `fragment-of-${weapon.ascension.material}-${materialLevel}`, amount: 6 });
    
    // エリート敵素材 - 最高レアリティ
    requirements.push({ materialId: `${weapon.ascension.elite}-3`, amount: 14 });
    
    // 通常敵素材 - 最高レアリティ
    requirements.push({ materialId: `${weapon.ascension.common}-3`, amount: 18 });
  }
  
  return requirements;
}

// 武器のレベルアップに必要な素材を計算する関数（所持素材を差し引く機能付き）
export function calculateWeaponAscensionMaterialsWithInventory(
  weaponId: string, 
  currentLevel: number, 
  targetLevel: number,
  inventory: Record<string, number> = {} // 既存の素材所持数
): MaterialRequirement[] {
  const basicRequirements = calculateWeaponAscensionMaterials(weaponId, currentLevel, targetLevel);
  
  // 所持素材を差し引く
  return basicRequirements.map(material => {
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