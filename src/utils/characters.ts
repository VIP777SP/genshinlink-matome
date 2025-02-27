// 属性・武器・レアリティ・役割の型定義
export type ElementType = 'pyro' | 'hydro' | 'anemo' | 'electro' | 'dendro' | 'cryo' | 'geo';
export type WeaponType = 'sword' | 'claymore' | 'polearm' | 'bow' | 'catalyst';
export type RarityType = 4 | 5;
export type RoleType = 'attacker' | 'supporter';

// キャラクター型
export type Character = {
  id: string;
  name: string;
  element: ElementType;
  weapon: WeaponType;
  rarity: RarityType;
  iconUrl: string; // アイコン用小さい画像
  fullImageUrl: string; // 詳細表示用大きい画像
  role: RoleType;
};

// 元素カラーのマッピング
export const elementColors: Record<ElementType, { bg: string; text: string; darkBg: string; darkText: string }> = {
  anemo: { bg: 'bg-teal-100', text: 'text-teal-800', darkBg: 'dark:bg-teal-900', darkText: 'dark:text-teal-200' },
  geo: { bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'dark:bg-yellow-900', darkText: 'dark:text-yellow-200' },
  electro: { bg: 'bg-purple-100', text: 'text-purple-800', darkBg: 'dark:bg-purple-900', darkText: 'dark:text-purple-200' },
  dendro: { bg: 'bg-green-100', text: 'text-green-800', darkBg: 'dark:bg-green-900', darkText: 'dark:text-green-200' },
  hydro: { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900', darkText: 'dark:text-blue-200' },
  pyro: { bg: 'bg-red-100', text: 'text-red-800', darkBg: 'dark:bg-red-900', darkText: 'dark:text-red-200' },
  cryo: { bg: 'bg-cyan-100', text: 'text-cyan-800', darkBg: 'dark:bg-cyan-900', darkText: 'dark:text-cyan-200' }
};

// 武器アイコンのマッピング
export const weaponIcons: Record<WeaponType, string> = {
  sword: 'fa-sword',
  claymore: 'fa-axe-battle',
  polearm: 'fa-khanda',
  bow: 'fa-bow-arrow',
  catalyst: 'fa-book-sparkles'
};

// 画像パス生成ヘルパー関数
export const getCharacterIconUrl = (characterId: string): string => {
  return `/images/characters/${characterId}-icon.png`;
};

export const getCharacterFullImageUrl = (characterId: string): string => {
  return `/images/characters/${characterId}.png`;
};

// キャラクターデータ
export const characters: Character[] = [
  {
    id: 'raiden-shogun',
    name: '雷電将軍',
    element: 'electro',
    weapon: 'polearm',
    rarity: 5,
    iconUrl: '/images/characters/raiden-shogun-icon.png',
    fullImageUrl: '/images/characters/raiden-shogun.png',
    role: 'supporter'
  },
  {
    id: 'kazuha',
    name: '楓原万葉',
    element: 'anemo',
    weapon: 'sword',
    rarity: 5,
    iconUrl: '/images/characters/kazuha-icon.png',
    fullImageUrl: '/images/characters/kazuha.png',
    role: 'supporter'
  },
  {
    id: 'nahida',
    name: 'ナヒーダ',
    element: 'dendro',
    weapon: 'catalyst',
    rarity: 5,
    iconUrl: '/images/characters/nahida-icon.png',
    fullImageUrl: '/images/characters/nahida.png',
    role: 'supporter'
  },
  {
    id: 'bennett',
    name: 'ベネット',
    element: 'pyro',
    weapon: 'sword',
    rarity: 4,
    iconUrl: '/images/characters/bennett-icon.png',
    fullImageUrl: '/images/characters/bennett.png',
    role: 'supporter'
  },
  {
    id: 'xingqiu',
    name: '行秋',
    element: 'hydro',
    weapon: 'sword',
    rarity: 4,
    iconUrl: '/images/characters/xingqiu-icon.png',
    fullImageUrl: '/images/characters/xingqiu.png',
    role: 'supporter'
  },
  {
    id: 'zhongli',
    name: '鍾離',
    element: 'geo',
    weapon: 'polearm',
    rarity: 5,
    iconUrl: '/images/characters/zhongli-icon.png',
    fullImageUrl: '/images/characters/zhongli.png',
    role: 'supporter'
  },
  {
    id: 'ganyu',
    name: '甘雨',
    element: 'cryo',
    weapon: 'bow',
    rarity: 5,
    iconUrl: '/images/characters/ganyu-icon.png',
    fullImageUrl: '/images/characters/ganyu.png',
    role: 'attacker'
  },
  {
    id: 'xiangling',
    name: '香菱',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 4,
    iconUrl: '/images/characters/xiangling-icon.png',
    fullImageUrl: '/images/characters/xiangling.png',
    role: 'attacker'
  },
  {
    id: 'hutao',
    name: '胡桃',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 5,
    iconUrl: '/images/characters/hutao-icon.png',
    fullImageUrl: '/images/characters/hutao.png',
    role: 'attacker'
  },
  {
    id: 'ayaka',
    name: '神里綾華',
    element: 'cryo',
    weapon: 'sword',
    rarity: 5,
    iconUrl: '/images/characters/ayaka-icon.png',
    fullImageUrl: '/images/characters/ayaka.png',
    role: 'attacker'
  },
];

// IDからキャラクターを取得する便利関数
export function getCharacterById(id: string): Character | undefined {
  return characters.find(character => character.id === id);
} 
