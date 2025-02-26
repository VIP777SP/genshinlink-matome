// 素材タイプの定義
export type MaterialType = 'exp' | 'mora' | 'ascension' | 'talent' | 'weapon' | 'boss' | 'local_specialty' | 'common';

// レアリティの型定義
export type RarityType = 1 | 2 | 3 | 4 | 5;

// 素材の型定義
export interface Material {
  id: string;
  name: string;
  type: MaterialType;
  rarity: RarityType;
  day?: string[]; // 曜日指定がある場合（武器・天賦素材）
  location?: string; // 入手場所
  imageUrl: string;
}

// 素材リスト
export const materials: Material[] = [
  // モラ
  {
    id: 'mora',
    name: 'モラ',
    type: 'mora',
    rarity: 3,
    imageUrl: '/images/materials/mora.png'
  },
  
  // キャラクター経験値
  {
    id: 'heros-wit',
    name: '大英雄の経験',
    type: 'exp',
    rarity: 4,
    imageUrl: '/images/materials/heros-wit.png'
  },
  {
    id: 'adventurers-experience',
    name: '冒険家の経験',
    type: 'exp',
    rarity: 3,
    imageUrl: '/images/materials/adventurers-experience.png'
  },
  
  // 元素石
  {
    id: 'agnidus-agate',
    name: '燃願のアゲート',
    type: 'ascension',
    rarity: 4,
    imageUrl: '/images/materials/agnidus-agate.png'
  },
  {
    id: 'varunada-lazurite',
    name: '浄水のラズライト',
    type: 'ascension',
    rarity: 4,
    imageUrl: '/images/materials/varunada-lazurite.png'
  },
  {
    id: 'vajrada-amethyst',
    name: '最勝紫晶',
    type: 'ascension',
    rarity: 4,
    imageUrl: '/images/materials/vajrada-amethyst.png'
  },
  {
    id: 'vayuda-turquoise',
    name: '自由のターコイズ',
    type: 'ascension',
    rarity: 4,
    imageUrl: '/images/materials/vayuda-turquoise.png'
  },
  {
    id: 'shivada-jade',
    name: '哀叙氷玉',
    type: 'ascension',
    rarity: 4,
    imageUrl: '/images/materials/shivada-jade.png'
  },
  {
    id: 'prithiva-topaz',
    name: '堅牢なトパーズ',
    type: 'ascension',
    rarity: 4,
    imageUrl: '/images/materials/prithiva-topaz.png'
  },
  {
    id: 'nagadus-emerald',
    name: '生長のエメラルド',
    type: 'ascension',
    rarity: 4,
    imageUrl: '/images/materials/nagadus-emerald.png'
  },
  
  // ボス素材（キャラクター突破素材）
  {
    id: 'everflame-seed',
    name: '常燃の火種',
    type: 'boss',
    rarity: 4,
    location: '無相の炎',
    imageUrl: '/images/materials/everflame-seed.png'
  },
  {
    id: 'hoarfrost-core',
    name: '霜の核',
    type: 'boss',
    rarity: 4,
    location: '無相の氷',
    imageUrl: '/images/materials/hoarfrost-core.png'
  },
  {
    id: 'lightning-prism',
    name: '雷光のプリズム',
    type: 'boss',
    rarity: 4,
    location: '無相の雷',
    imageUrl: '/images/materials/lightning-prism.png'
  },
  {
    id: 'hurricane-seed',
    name: '暴風の種',
    type: 'boss',
    rarity: 4,
    location: '無相の風',
    imageUrl: '/images/materials/hurricane-seed.png'
  },
  {
    id: 'basalt-pillar',
    name: '玄岩の柱',
    type: 'boss',
    rarity: 4,
    location: '無相の岩',
    imageUrl: '/images/materials/basalt-pillar.png'
  },
  {
    id: 'cleansing-heart',
    name: '浄水の心',
    type: 'boss',
    rarity: 4,
    location: '無相の水',
    imageUrl: '/images/materials/cleansing-heart.png'
  },
  {
    id: 'juvenile-jade',
    name: '未熟の玉',
    type: 'boss',
    rarity: 4,
    location: '古岩龍・地中の盾',
    imageUrl: '/images/materials/juvenile-jade.png'
  },
  
  // キャラクター特産品
  {
    id: 'wolfhook',
    name: 'ウォルフフック',
    type: 'local_specialty',
    rarity: 1,
    location: 'モンド',
    imageUrl: '/images/materials/wolfhook.png'
  },
  {
    id: 'valberry',
    name: 'ヴァルベリー',
    type: 'local_specialty',
    rarity: 1,
    location: 'モンド',
    imageUrl: '/images/materials/valberry.png'
  },
  {
    id: 'cecilia',
    name: 'セシリアの花',
    type: 'local_specialty',
    rarity: 1,
    location: 'モンド',
    imageUrl: '/images/materials/cecilia.png'
  },
  {
    id: 'windwheel-aster',
    name: '風車アスター',
    type: 'local_specialty',
    rarity: 1,
    location: 'モンド',
    imageUrl: '/images/materials/windwheel-aster.png'
  },
  {
    id: 'silk-flower',
    name: '絹花',
    type: 'local_specialty',
    rarity: 1,
    location: '璃月',
    imageUrl: '/images/materials/silk-flower.png'
  },
  {
    id: 'cor-lapis',
    name: '石珀',
    type: 'local_specialty',
    rarity: 1,
    location: '璃月',
    imageUrl: '/images/materials/cor-lapis.png'
  },
  {
    id: 'jueyun-chili',
    name: '絶雲の唐辛子',
    type: 'local_specialty',
    rarity: 1,
    location: '璃月',
    imageUrl: '/images/materials/jueyun-chili.png'
  },
  {
    id: 'noctilucous-jade',
    name: '夜泊石',
    type: 'local_specialty',
    rarity: 1,
    location: '璃月',
    imageUrl: '/images/materials/noctilucous-jade.png'
  },
  
  // 一般的な敵ドロップ素材
  {
    id: 'slime-condensate',
    name: 'スライムの液体',
    type: 'common',
    rarity: 1,
    imageUrl: '/images/materials/slime-condensate.png'
  },
  {
    id: 'slime-secretions',
    name: 'スライムの分泌物',
    type: 'common',
    rarity: 2,
    imageUrl: '/images/materials/slime-secretions.png'
  },
  {
    id: 'slime-concentrate',
    name: 'スライムの原液',
    type: 'common',
    rarity: 3,
    imageUrl: '/images/materials/slime-concentrate.png'
  },
  {
    id: 'damaged-mask',
    name: '破損した仮面',
    type: 'common',
    rarity: 1,
    imageUrl: '/images/materials/damaged-mask.png'
  },
  {
    id: 'stained-mask',
    name: '汚れた仮面',
    type: 'common',
    rarity: 2,
    imageUrl: '/images/materials/stained-mask.png'
  },
  {
    id: 'ominous-mask',
    name: '不気味な仮面',
    type: 'common',
    rarity: 3,
    imageUrl: '/images/materials/ominous-mask.png'
  },
  
  // 天賦素材
  {
    id: 'teachings-of-freedom',
    name: '「自由」の教え',
    type: 'talent',
    rarity: 2,
    day: ['月', '木', '日'],
    location: '忘却の峡谷',
    imageUrl: '/images/materials/teachings-of-freedom.png'
  },
  {
    id: 'guide-to-freedom',
    name: '「自由」の導き',
    type: 'talent',
    rarity: 3,
    day: ['月', '木', '日'],
    location: '忘却の峡谷',
    imageUrl: '/images/materials/guide-to-freedom.png'
  },
  {
    id: 'philosophies-of-freedom',
    name: '「自由」の哲学',
    type: 'talent',
    rarity: 4,
    day: ['月', '木', '日'],
    location: '忘却の峡谷',
    imageUrl: '/images/materials/philosophies-of-freedom.png'
  },
  {
    id: 'teachings-of-prosperity',
    name: '「繁栄」の教え',
    type: 'talent',
    rarity: 2,
    day: ['月', '木', '日'],
    location: '太山府',
    imageUrl: '/images/materials/teachings-of-prosperity.png'
  },
  {
    id: 'guide-to-prosperity',
    name: '「繁栄」の導き',
    type: 'talent',
    rarity: 3,
    day: ['月', '木', '日'],
    location: '太山府',
    imageUrl: '/images/materials/guide-to-prosperity.png'
  },
  {
    id: 'philosophies-of-prosperity',
    name: '「繁栄」の哲学',
    type: 'talent',
    rarity: 4,
    day: ['月', '木', '日'],
    location: '太山府',
    imageUrl: '/images/materials/philosophies-of-prosperity.png'
  },
  
  // 武器素材
  {
    id: 'tile-of-decarabians-tower',
    name: 'デカラビアンの塔の残欠',
    type: 'weapon',
    rarity: 2,
    day: ['月', '木', '日'],
    location: 'セシリア庭園',
    imageUrl: '/images/materials/tile-of-decarabians-tower.png'
  },
  {
    id: 'debris-of-decarabians-city',
    name: 'デカラビアンの都の碑',
    type: 'weapon',
    rarity: 3,
    day: ['月', '木', '日'],
    location: 'セシリア庭園',
    imageUrl: '/images/materials/debris-of-decarabians-city.png'
  },
  {
    id: 'fragment-of-decarabians-epic',
    name: 'デカラビアンの伝説',
    type: 'weapon',
    rarity: 4,
    day: ['月', '木', '日'],
    location: 'セシリア庭園',
    imageUrl: '/images/materials/fragment-of-decarabians-epic.png'
  },
  {
    id: 'boreal-wolfs-milk-tooth',
    name: '凍てついた狼の乳歯',
    type: 'weapon',
    rarity: 2,
    day: ['火', '金', '日'],
    location: 'セシリア庭園',
    imageUrl: '/images/materials/boreal-wolfs-milk-tooth.png'
  },
  {
    id: 'boreal-wolfs-cracked-tooth',
    name: '凍てついた狼の砕牙',
    type: 'weapon',
    rarity: 3,
    day: ['火', '金', '日'],
    location: 'セシリア庭園',
    imageUrl: '/images/materials/boreal-wolfs-cracked-tooth.png'
  },
  {
    id: 'boreal-wolfs-broken-fang',
    name: '凍てついた狼の砕けた牙',
    type: 'weapon',
    rarity: 4,
    day: ['火', '金', '日'],
    location: 'セシリア庭園',
    imageUrl: '/images/materials/boreal-wolfs-broken-fang.png'
  }
];

// 素材IDをキーとしたマップを作成（検索用）
export const materialsMap = new Map<string, Material>();
materials.forEach(material => {
  materialsMap.set(material.id, material);
});

// 必要素材と数量の型定義
export interface MaterialRequirement {
  materialId: string;
  amount: number;
} 