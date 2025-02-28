import { Character } from '@/utils/characters';

// ティア定義
export type TierRank = 'SS' | 'S' | 'A' | 'B' | 'C';
export type TierDefinition = {
  rank: TierRank;
  name: string;
  description: string;
  color: string;
  characters: Character[];
};

// キャラクターをimportして参照する
import { characters } from '@/utils/characters';

// C0星4武器前提のティア表
export const tiersC0: TierDefinition[] = [
  {
    rank: 'SS',
    name: '最強ランク',
    description: 'C0・星4武器でも圧倒的な性能を発揮するキャラクター。初心者から上級者まで広く活躍できる。',
    color: 'bg-red-600',
    characters: [
      characters.find(c => c.id === 'bennett')!,
      characters.find(c => c.id === 'neuvillette')!,
      characters.find(c => c.id === 'xingqiu')!,
      characters.find(c => c.id === 'xiangling')!,
    ]
  },
  {
    rank: 'S',
    name: '超強力ランク',
    description: 'C0・星4武器でも非常に強力で、ほとんどのコンテンツで活躍できるキャラクター。',
    color: 'bg-orange-500',
    characters: [
      characters.find(c => c.id === 'kazuha')!,
      characters.find(c => c.id === 'nahida')!,
      characters.find(c => c.id === 'zhongli')!,
      characters.find(c => c.id === 'ayaka')!,
    ]
  },
  {
    rank: 'A',
    name: '強力ランク',
    description: 'C0・星4武器でも十分な性能を発揮し、適切なパーティ編成で真価を発揮するキャラクター。',
    color: 'bg-amber-500',
    characters: [
      characters.find(c => c.id === 'ganyu')!,
      characters.find(c => c.id === 'hutao')!,
      characters.find(c => c.id === 'raiden-shogun')!,
    ]
  },
  {
    rank: 'B',
    name: '平均ランク',
    description: 'C0・星4武器では特定の状況でのみ活躍できるキャラクター。凸数や武器によって性能が向上する。',
    color: 'bg-green-600',
    characters: []
  },
  {
    rank: 'C',
    name: '改善待ちランク',
    description: 'C0・星4武器では力を発揮しづらく、凸数や専用武器が必要なキャラクター。',
    color: 'bg-blue-600',
    characters: [
      characters.find(c => c.id === 'diluc')!,
    ]
  },
];

// C2R1前提のティア表
export const tiersC2R1: TierDefinition[] = [
  {
    rank: 'SS',
    name: '最強ランク',
    description: 'C2・専用武器R1で圧倒的性能を持ち、メタを支配するキャラクター。どんなパーティでも主力として活躍できる。',
    color: 'bg-red-600',
    characters: [
      characters.find(c => c.id === 'raiden-shogun')!,
      characters.find(c => c.id === 'nahida')!,
      characters.find(c => c.id === 'hutao')!,
    ]
  },
  {
    rank: 'S',
    name: '超強力ランク',
    description: 'C2・専用武器R1で非常に強力な性能を発揮し、ほとんどのコンテンツで活躍できるキャラクター。',
    color: 'bg-orange-500',
    characters: [
      characters.find(c => c.id === 'ayaka')!,
      characters.find(c => c.id === 'ganyu')!,
      characters.find(c => c.id === 'kazuha')!,
    ]
  },
  {
    rank: 'A',
    name: '強力ランク',
    description: 'C2・専用武器R1で十分な性能を発揮し、特定の役割で優れた活躍をするキャラクター。',
    color: 'bg-amber-500',
    characters: [
      characters.find(c => c.id === 'zhongli')!,
      characters.find(c => c.id === 'xiangling')!,
    ]
  },
  {
    rank: 'B',
    name: '平均ランク',
    description: 'C2・専用武器R1でも一般的な性能を持ち、特定のパーティ編成や状況で活躍できるキャラクター。',
    color: 'bg-green-600',
    characters: [
      characters.find(c => c.id === 'xingqiu')!,
    ]
  },
  {
    rank: 'C',
    name: '改善待ちランク',
    description: 'C2・専用武器R1でもより上位の凸数か高精錬が必要なキャラクター。',
    color: 'bg-blue-600',
    characters: [
      characters.find(c => c.id === 'bennett')!,
    ]
  },
]; 