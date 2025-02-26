// 属性・武器・レアリティ・役割の型定義
export type ElementType = 'pyro' | 'hydro' | 'anemo' | 'electro' | 'dendro' | 'cryo' | 'geo';
export type WeaponType = 'sword' | 'claymore' | 'polearm' | 'bow' | 'catalyst';
export type RarityType = 4 | 5;
export type RoleType = 'attacker' | 'supporter';

// ステータス型定義
export type CharacterStats = {
  hp: number;
  attack: number;
  defense: number;
  specialStat: {
    name: string; // 元素熟知, 会心率, 会心ダメージ, 元素チャージ効率, etc
    value: number;
  };
  ascensionStat: {
    name: string; // 突破ステータス名
    value: number;
  };
};

// 天賦型定義
export type TalentType = 'normal' | 'skill' | 'burst';
export type TalentScaling = {
  name: string;
  value: string; // パーセンテージや値の文字列表現（例: "131.5%", "15.2秒"）
  description?: string;
};

export type CharacterTalent = {
  type: TalentType;
  name: string;
  description: string;
  scalings: TalentScaling[]; // Lv.10での倍率
};

// 命の星座型定義
export type Constellation = {
  level: number; // 1-6
  name: string;
  description: string;
  effect: string;
};

// キャラクター型
export type Character = {
  id: string;
  name: string;
  title: string;
  element: ElementType;
  weapon: WeaponType;
  rarity: RarityType;
  region: string;
  description: string;
  imageUrl: string; // 後方互換性のため残す
  iconUrl: string; // アイコン用小さい画像
  fullImageUrl: string; // 詳細表示用大きい画像
  role: RoleType;
  stats?: CharacterStats; // Lv90ステータス (オプション)
  talents?: CharacterTalent[]; // 天賦情報 (オプション)
  constellations?: Constellation[]; // 命の星座 (オプション)
};

// ティア定義
export type TierRank = 'SS' | 'S' | 'A' | 'B' | 'C';
export type TierDefinition = {
  rank: TierRank;
  name: string;
  description: string;
  color: string;
  characters: Character[];
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
    title: '殲滅の稲妻',
    element: 'electro',
    weapon: 'polearm',
    rarity: 5,
    region: '稲妻',
    description: '稲妻の雷神であり、稲妻幕府の最高指導者。「永遠」を追い求め、「まぼろしの永遠」という方針を打ち出した。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202106/raiden_shogun.png',
    iconUrl: '/images/characters/raiden-shogun-icon.png',
    fullImageUrl: '/images/characters/raiden-shogun.png',
    role: 'supporter',
    stats: {
      hp: 12907,
      attack: 337,
      defense: 789,
      specialStat: {
        name: '元素チャージ効率',
        value: 32.0
      },
      ascensionStat: {
        name: '雷元素ダメージ',
        value: 28.8
      }
    },
    talents: [
      {
        type: 'normal',
        name: '源流の剣術',
        description: '通常攻撃：薙刀を振り最大5段の連続攻撃を行う。\n重撃：一定のスタミナを消費し、前方へ薙刀による攻撃を繰り出す。\n落下攻撃：空中から落下し地面に衝撃を与える。',
        scalings: [
          { name: '1段ダメージ', value: '78.3%' },
          { name: '2段ダメージ', value: '77.9%' },
          { name: '3段ダメージ', value: '97.5%' },
          { name: '4段ダメージ', value: '113.2%' },
          { name: '5段ダメージ', value: '135.7%' },
          { name: '重撃ダメージ', value: '256.1%' },
          { name: '落下期間のダメージ', value: '146.9%' },
          { name: '低空/高空落下ダメージ', value: '293.6% / 367.0%' }
        ]
      },
      {
        type: 'skill',
        name: '神変・悪曜開眼',
        description: '稲光を放ち、近くの敵に雷ダメージを与え、「悪曜の目」を作り出す。',
        scalings: [
          { name: 'スキルダメージ', value: '260.6%' },
          { name: '稲光の円範囲', value: '半径4m' },
          { name: '稲光の剣ダメージバフ(最大)', value: '42%（0.3% x 元素チャージ効率の140%を超える部分）' },
          { name: 'クールタイム', value: '10秒' }
        ]
      },
      {
        type: 'burst',
        name: '奥義・夢想真説',
        description: '無想の一太刀を放ち、魔神の姿で戦場に立ち、凶刃を振るう。',
        scalings: [
          { name: '夢想の一太刀', value: '858.0%' },
          { name: '攻撃ダメージ（通常）', value: '128.7%' },
          { name: '攻撃ダメージ（重撃）', value: '158.0%' },
          { name: '元素爆発時の耐性', value: '50%（割り込み耐性）' },
          { name: '元素エネルギー回復', value: '2.5（ヒット毎）' },
          { name: '持続時間', value: '7秒' },
          { name: 'クールタイム', value: '18秒' },
          { name: '元素エネルギー', value: '90' }
        ]
      }
    ],
    constellations: [
      {
        level: 1,
        name: '鳴雷霹靂の新獄',
        description: '奥義・夢想真説発動時に稲妻将軍は近くのチーム全員（自身を除く）の元素爆発のクールタイムを減少させる。',
        effect: '元素爆発のクールタイム-30%（最大5秒）'
      },
      {
        level: 2,
        name: '斬勢翔破の障壁',
        description: '神願・惑わしの瞬きの効果時間を無視し、奥義・夢想真説の攻撃が敵の元素エネルギーを消費するときのエネルギー回復量+60%、雷元素耐性-60%。',
        effect: '元素エネルギー回復+60%、対象の雷元素耐性-60%（持続時間6秒）'
      },
      {
        level: 3,
        name: '真影の手向かい',
        description: '奥義・夢想真説のスキルレベル+3。最大15まで。',
        effect: '奥義・夢想真説 スキルLv+3'
      },
      {
        level: 4,
        name: '過ちの制裁',
        description: '奥義・夢想真説の通常攻撃、重撃、落下攻撃が敵に命中すると、近距離のチーム全員（雷電将軍を除く）の攻撃力+30%（持続時間10秒）。',
        effect: 'チーム全員の攻撃力+30%（持続時間10秒）'
      },
      {
        level: 5,
        name: '罪なき幻想',
        description: '神変・悪曜開眼のスキルレベル+3。最大15まで。',
        effect: '神変・悪曜開眼 スキルLv+3'
      },
      {
        level: 6,
        name: '願力無限',
        description: '奥義・夢想真説発動時、悪曜の目を所持しているキャラクターの元素爆発の元素エネルギー消費-5。その後、奥義・夢想真説の継続時間中に稲妻将軍自身の通常攻撃、重撃、落下攻撃が敵に命中すると元素エネルギーを1回復する（0.1秒毎に最大1回計算）。',
        effect: '元素爆発のエネルギー消費-5、通常攻撃ヒット時に元素エネルギー+1（0.1秒毎に最大1回）'
      }
    ]
  },
  {
    id: 'kazuha',
    name: '楓原万葉',
    title: '紅葉のいろどり',
    element: 'anemo',
    weapon: 'sword',
    rarity: 5,
    region: '稲妻',
    description: '稲妻の浪人剣士。さすらいの詩人である。若くて、名声もないが、多くの物語と伝説を聞いてきた。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202106/kazuha.png',
    iconUrl: '/images/characters/kazuha-icon.png',
    fullImageUrl: '/images/characters/kazuha.png',
    role: 'supporter'
  },
  {
    id: 'nahida',
    name: 'ナヒーダ',
    title: '白草净华',
    element: 'dendro',
    weapon: 'catalyst',
    rarity: 5,
    region: 'スメール',
    description: 'スメール教令院の主神。知恵を司る草の神。純粋で、優しく、知恵に溢れている。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202210/nahida.png',
    iconUrl: '/images/characters/nahida-icon.png',
    fullImageUrl: '/images/characters/nahida.png',
    role: 'supporter'
  },
  {
    id: 'bennett',
    name: 'ベネット',
    title: '運命の試練',
    element: 'pyro',
    weapon: 'sword',
    rarity: 4,
    region: 'モンド',
    description: 'モンドの冒険者ギルドに所属する若き冒険者。いつも不運に見舞われているが、それでも前向きな性格を持っている。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202001/bennett.png',
    iconUrl: '/images/characters/bennett-icon.png',
    fullImageUrl: '/images/characters/bennett.png',
    role: 'supporter'
  },
  {
    id: 'xingqiu',
    name: '行秋',
    title: '少年春衫薄',
    element: 'hydro',
    weapon: 'sword',
    rarity: 4,
    region: '璃月',
    description: '璃月の有名な商家、飛雲商会の次男坊。本の虫で、武術にも優れた才能を持つ。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202001/xingqiu.png',
    iconUrl: '/images/characters/xingqiu-icon.png',
    fullImageUrl: '/images/characters/xingqiu.png',
    role: 'supporter'
  },
  {
    id: 'zhongli',
    name: '鍾離',
    title: '通じ合う岩',
    element: 'geo',
    weapon: 'polearm',
    rarity: 5,
    region: '璃月',
    description: '往生堂の客人。博識で、長い年月を生きてきたかのような風格がある。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202011/zhongli.png',
    iconUrl: '/images/characters/zhongli-icon.png',
    fullImageUrl: '/images/characters/zhongli.png',
    role: 'supporter'
  },
  {
    id: 'ganyu',
    name: '甘雨',
    title: '循いし理',
    element: 'cryo',
    weapon: 'bow',
    rarity: 5,
    region: '璃月',
    description: '璃月七星の秘書。半人半仙獣の血を引く。几帳面で真面目な性格。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202101/ganyu.png',
    iconUrl: '/images/characters/ganyu-icon.png',
    fullImageUrl: '/images/characters/ganyu.png',
    role: 'attacker',
    stats: {
      hp: 9797,
      attack: 335,
      defense: 630,
      specialStat: {
        name: '会心ダメージ',
        value: 88.4
      },
      ascensionStat: {
        name: '氷元素ダメージ',
        value: 28.8
      }
    },
    talents: [
      {
        type: 'normal',
        name: '流天射術',
        description: '通常攻撃：弓で最大6段の連続射撃を行う。\n重撃：照準状態に入り、エネルギーチャージが溜まるほど、矢のダメージと命中範囲が上昇する。\n凝光矢：1段チャージ -「霜華の矢」を放つ。命中時、氷元素範囲ダメージを与える。\n霜華満開：2段チャージ -「霜華の矢」を放ち、より強力な氷元素範囲ダメージを与える。',
        scalings: [
          { name: '1段ダメージ', value: '58.3%' },
          { name: '2段ダメージ', value: '66.1%' },
          { name: '3段ダメージ', value: '84.1%' },
          { name: '4段ダメージ', value: '84.1%' },
          { name: '5段ダメージ', value: '88.9%' },
          { name: '6段ダメージ', value: '106.8%' },
          { name: '狙い撃ちダメージ', value: '173.6%' },
          { name: '霜華の矢ダメージ', value: '217.0%' },
          { name: '霜華の矢範囲ダメージ', value: '369.0%' },
          { name: '落下期間のダメージ', value: '100.4%' },
          { name: '低空/高空落下ダメージ', value: '200.8% / 251.0%' }
        ]
      },
      {
        type: 'skill',
        name: '山泽麟迹',
        description: '甘雨は氷の蓮の形をした「氷蓮」を残して後ろに素早く退き、周囲の敵を挑発する。\n\n氷蓮\n・周囲の敵を持続的に挑発し、耐久力に応じたHPを持つ\n・甘雨のHPの上限に応じて、氷蓮のHPが決まる\n・敵の攻撃に命中した時、氷元素範囲ダメージを与える',
        scalings: [
          { name: 'スキルダメージ', value: '237.2%' },
          { name: '氷蓮HP', value: '204.0%' },
          { name: 'クールタイム', value: '10秒' }
        ]
      },
      {
        type: 'burst',
        name: '降衆天華',
        description: '聖なる霜氷を降らせて持続的に氷の結晶を作り、範囲内の敵に氷元素範囲ダメージを与える。',
        scalings: [
          { name: '氷結の結晶ダメージ', value: '126.6%' },
          { name: '持続時間', value: '15秒' },
          { name: 'クールタイム', value: '15秒' },
          { name: '元素エネルギー', value: '60' }
        ]
      }
    ],
    constellations: [
      {
        level: 1,
        name: '饮露',
        description: '霜華の矢を放った後6秒間、甘雨の氷元素耐性+15%；また、次の霜華の矢の発動時間-30%。',
        effect: '氷元素耐性+15%、霜華の矢のチャージ時間-30%（持続時間6秒）'
      },
      {
        level: 2,
        name: '获麟',
        description: '「山泽麟迹」使用時、その範囲に一朵の霜華の花を追加で生み出す。霜華の花は「山泽麟迹」と同様にダメージを与える。',
        effect: '「山泽麟迹」のダメージ機会+1'
      },
      {
        level: 3,
        name: '云行',
        description: '「降衆天華」のスキルレベル+3。最大15まで。',
        effect: '降衆天華 スキルLv+3'
      },
      {
        level: 4,
        name: '西月',
        description: '「降衆天華」のスキル範囲内にいる敵は、継続的に氷元素耐性-20%のデバフを受ける。',
        effect: '対象の氷元素耐性-20%（「降衆天華」の範囲内）'
      },
      {
        level: 5,
        name: '折草',
        description: '「山泽麟迹」のスキルレベル+3。最大15まで。',
        effect: '山泽麟迹 スキルLv+3'
      },
      {
        level: 6,
        name: '履云行',
        description: '「霜華の矢」を放った時、30秒間、「霜華満開（重撃の第二段階）」のクリティカルダメージ+30%。この効果は霜華の矢を放った瞬間から有効になる。',
        effect: '霜華満開のクリティカルダメージ+30%（持続時間30秒）'
      }
    ]
  },
  {
    id: 'xiangling',
    name: '香菱',
    title: '万民百味',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 4,
    region: '璃月',
    description: '璃月の料理人。料理に情熱を注ぎ、新しい食材や調理法を常に探求している。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202001/xiangling.png',
    iconUrl: '/images/characters/xiangling-icon.png',
    fullImageUrl: '/images/characters/xiangling.png',
    role: 'attacker'
  },
  {
    id: 'hutao',
    name: '胡桃',
    title: '往生堂七十七代目堂主',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 5,
    region: '璃月',
    description: '璃月の葬儀社「往生堂」の若き堂主。死と生の境界を行き来する力を持つ。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202103/hutao.png',
    iconUrl: '/images/characters/hutao-icon.png',
    fullImageUrl: '/images/characters/hutao.png',
    role: 'attacker'
  },
  {
    id: 'ayaka',
    name: '神里綾華',
    title: '白鷺氷華',
    element: 'cryo',
    weapon: 'sword',
    rarity: 5,
    region: '稲妻',
    description: '稲妻の名家「神里家」の長女。優美な剣術と氷の力で敵を翻弄する。',
    imageUrl: 'https://upload-static.hoyoverse.com/hk4e/upload/officialsites/202107/ayaka.png',
    iconUrl: '/images/characters/ayaka-icon.png',
    fullImageUrl: '/images/characters/ayaka.png',
    role: 'attacker'
  },
];

// IDからキャラクターを取得する便利関数
export function getCharacterById(id: string): Character | undefined {
  return characters.find(character => character.id === id);
}

// C0星4武器前提のティア表
export const tiersC0: TierDefinition[] = [
  {
    rank: 'SS',
    name: '最強ランク',
    description: 'C0・星4武器でも圧倒的な性能を発揮するキャラクター。初心者から上級者まで広く活躍できる。',
    color: 'bg-red-600',
    characters: [
      characters.find(c => c.id === 'bennett')!,
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
    characters: []
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
