// 属性タイプの定義
export type ElementType = 'pyro' | 'hydro' | 'anemo' | 'electro' | 'dendro' | 'cryo' | 'geo';
export type WeaponType = 'sword' | 'claymore' | 'polearm' | 'bow' | 'catalyst';
export type RarityType = 4 | 5;

// 武器データの型定義
export interface Weapon {
  id: string;
  name: string;
  type: WeaponType;
  rarity: 3 | 4 | 5;
  baseAtk: number;
  subStat: string;
  passive: string;
  imageUrl: string;
  iconUrl: string;
}

// キャラクター型の定義
export interface Character {
  id: string;
  name: string;
  element: ElementType;
  weapon: WeaponType;
  rarity: RarityType;
  region: string;
  description?: string;
  imageUrl?: string;
  iconUrl: string;
}

// ドラッグアイテムの型定義
export interface DragItem {
  id: string;
}

// ドラッグアイテムタイプの定義
export const ItemTypes = {
  CHARACTER: 'character',
  WEAPON: 'weapon'
}; 