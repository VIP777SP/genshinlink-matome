import { ElementType, WeaponType, RarityType, RoleType } from '@/utils/characters';

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

// キャラクター詳細情報の型
export type CharacterDetails = {
  id: string;
  region?: string;
  description?: string;
  stats?: CharacterStats;
  talents?: CharacterTalent[];
  constellations?: Constellation[];
};

// キャラクター詳細データ
export const characterDetails: CharacterDetails[] = [
  {
    id: 'raiden-shogun',
    region: '稲妻',
    description: '稲妻の雷神であり、稲妻幕府の最高指導者。「永遠」を追い求め、「まぼろしの永遠」という方針を打ち出した。',
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
    id: 'ganyu',
    region: '璃月',
    description: '璃月七星の秘書。半人半仙獣の血を引く。几帳面で真面目な性格。',
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
  }
];

// IDからキャラクター詳細情報を取得する便利関数
export function getCharacterDetailsById(id: string): CharacterDetails | undefined {
  return characterDetails.find(character => character.id === id);
} 
