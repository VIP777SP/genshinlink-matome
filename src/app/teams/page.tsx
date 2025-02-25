'use client';

import { useState } from 'react';
import Image from 'next/image';
import FavoriteButton from '@/components/FavoriteButton';
import CommentSection from '@/components/CommentSection';
import { useSound } from '@/components/SoundService';

// 元素タイプの型定義
type ElementType = '炎' | '水' | '雷' | '氷' | '風' | '岩' | '草';

// キャラクターの型定義
type Character = {
  id: string;
  name: string;
  element: ElementType;
  rarity: number;
  role: string;
  imageUrl: string;
};

// チームの型定義
type Team = {
  id: string;
  name: string;
  description: string;
  characters: Character[];
  strengths: string[];
  weaknesses: string[];
  playstyle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  recommended: boolean;
  variants?: {
    character: Character;
    replaces: string;
    note: string;
  }[];
};

// 元素アイコンのマッピング
const elementIcons: Record<ElementType, string> = {
  '炎': 'pyro',
  '水': 'hydro',
  '雷': 'electro',
  '氷': 'cryo',
  '風': 'anemo',
  '岩': 'geo',
  '草': 'dendro'
};

// キャラクターデータ
const characters: Character[] = [
  // 炎元素
  { id: 'hu-tao', name: '胡桃', element: '炎', rarity: 5, role: 'メインDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a4/Character_Hu_Tao_Portrait.png' },
  { id: 'diluc', name: 'ディルック', element: '炎', rarity: 5, role: 'メインDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/0/0e/Character_Diluc_Portrait.png' },
  { id: 'xiangling', name: '香菱', element: '炎', rarity: 4, role: 'サブDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/3/39/Character_Xiangling_Portrait.png' },
  { id: 'bennett', name: 'ベネット', element: '炎', rarity: 4, role: 'サポート', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/7/7b/Character_Bennett_Portrait.png' },
  
  // 水元素
  { id: 'tartaglia', name: 'タルタリヤ', element: '水', rarity: 5, role: 'メインDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/8/85/Character_Tartaglia_Portrait.png' },
  { id: 'mona', name: 'モナ', element: '水', rarity: 5, role: 'サブDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/4/44/Character_Mona_Portrait.png' },
  { id: 'xingqiu', name: '行秋', element: '水', rarity: 4, role: 'サブDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/c/c2/Character_Xingqiu_Portrait.png' },
  { id: 'kokomi', name: '珊瑚宮心海', element: '水', rarity: 5, role: 'ヒーラー', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/f/ff/Character_Sangonomiya_Kokomi_Portrait.png' },

  // 雷元素
  { id: 'raiden', name: '雷電将軍', element: '雷', rarity: 5, role: 'サブDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/9/9c/Character_Raiden_Shogun_Portrait.png' },
  { id: 'keqing', name: '刻晴', element: '雷', rarity: 5, role: 'メインDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/0/06/Character_Keqing_Portrait.png' },
  { id: 'fischl', name: 'フィッシュル', element: '雷', rarity: 4, role: 'サブDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/9/9a/Character_Fischl_Portrait.png' },
  { id: 'beidou', name: '北斗', element: '雷', rarity: 4, role: 'サブDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/6/61/Character_Beidou_Portrait.png' },

  // 氷元素
  { id: 'ayaka', name: '神里綾華', element: '氷', rarity: 5, role: 'メインDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/f/fd/Character_Kamisato_Ayaka_Portrait.png' },
  { id: 'ganyu', name: '甘雨', element: '氷', rarity: 5, role: 'メインDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/7/79/Character_Ganyu_Portrait.png' },
  { id: 'diona', name: 'ディオナ', element: '氷', rarity: 4, role: 'サポート', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/b/b9/Character_Diona_Portrait.png' },
  { id: 'shenhe', name: '申鶴', element: '氷', rarity: 5, role: 'サポート', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/5/58/Character_Shenhe_Portrait.png' },

  // 風元素
  { id: 'venti', name: 'ウェンティ', element: '風', rarity: 5, role: 'サポート', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/f/f1/Character_Venti_Portrait.png' },
  { id: 'kazuha', name: '楓原万葉', element: '風', rarity: 5, role: 'サポート', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/d/d7/Character_Kaedehara_Kazuha_Portrait.png' },
  { id: 'sucrose', name: 'スクロース', element: '風', rarity: 4, role: 'サポート', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/6/61/Character_Sucrose_Portrait.png' },
  { id: 'jean', name: 'ジン', element: '風', rarity: 5, role: 'ヒーラー', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/8/89/Character_Jean_Portrait.png' },

  // 岩元素
  { id: 'zhongli', name: '鍾離', element: '岩', rarity: 5, role: 'サポート', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a6/Character_Zhongli_Portrait.png' },
  { id: 'albedo', name: 'アルベド', element: '岩', rarity: 5, role: 'サブDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/1/1a/Character_Albedo_Portrait.png' },
  { id: 'itto', name: '荒瀧一斗', element: '岩', rarity: 5, role: 'メインDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/7/7b/Character_Arataki_Itto_Portrait.png' },
  { id: 'gorou', name: 'ゴロー', element: '岩', rarity: 4, role: 'サポート', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/f/fe/Character_Gorou_Portrait.png' },

  // 草元素
  { id: 'nahida', name: 'ナヒーダ', element: '草', rarity: 5, role: 'サブDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/c/cf/Character_Nahida_Portrait.png' },
  { id: 'alhaitham', name: 'アル・ハイゼン', element: '草', rarity: 5, role: 'メインDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/f/f2/Character_Alhaitham_Portrait.png' },
  { id: 'collei', name: 'コレイ', element: '草', rarity: 4, role: 'サブDPS', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a3/Character_Collei_Portrait.png' },
  { id: 'yaoyao', name: 'ヨォーヨ', element: '草', rarity: 4, role: 'ヒーラー', imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/1/15/Character_Yaoyao_Portrait.png' },
];

// チームデータ
const teams: Team[] = [
  {
    id: 'international',
    name: 'インターナショナル',
    description: '強力なバースト火力と元素反応を活かしたチーム。タルタリヤのスキルとベネット、香菱のバーストを組み合わせて、大ダメージを叩き出します。',
    characters: [
      characters.find(c => c.id === 'tartaglia')!,
      characters.find(c => c.id === 'xiangling')!,
      characters.find(c => c.id === 'bennett')!,
      characters.find(c => c.id === 'kazuha')!
    ],
    strengths: [
      '単体と範囲両方に対応できる汎用性',
      '元素エネルギーの循環が良い',
      '強力な蒸発反応でのダメージ'
    ],
    weaknesses: [
      'タルタリヤのスキルのクールタイム管理が必要',
      '香菱のエネルギー問題（ベネットで解決可能）',
      '盾キャラがいないので回避が重要'
    ],
    playstyle: 'ベネットのバースト→香菱のバースト→楓原万葉でスウィープ→タルタリヤのスキルで通常攻撃→繰り返し',
    difficulty: 'medium',
    recommended: true,
    variants: [
      {
        character: characters.find(c => c.id === 'sucrose')!,
        replaces: '楓原万葉',
        note: '元素熟知の共有ができるため、蒸発反応のダメージが向上します。'
      }
    ]
  },
  {
    id: 'morgana',
    name: 'モルガナ',
    description: '凍結反応を活用した制御とダメージのバランスに優れたチーム。甘雨の強力な範囲攻撃と、モナ、ヴェンティの補助で敵を凍結状態に保ちます。',
    characters: [
      characters.find(c => c.id === 'ganyu')!,
      characters.find(c => c.id === 'mona')!,
      characters.find(c => c.id === 'venti')!,
      characters.find(c => c.id === 'diona')!
    ],
    strengths: [
      '強力な凍結コントロール能力',
      '甘雨の範囲ダメージが優秀',
      'ディオナによる回復と盾で生存力が高い'
    ],
    weaknesses: [
      '凍結できない敵（ボスなど）に対して効率が落ちる',
      '甘雨のチャージ攻撃の操作が苦手な人には難しい',
      'モナのバフ時間中にダメージを出し切る必要がある'
    ],
    playstyle: 'ディオナの盾→ヴェンティのバースト→モナのバースト→甘雨のバーストとチャージ攻撃の繰り返し',
    difficulty: 'medium',
    recommended: true,
    variants: [
      {
        character: characters.find(c => c.id === 'ayaka')!,
        replaces: '甘雨',
        note: '綾華バージョンは「モルヤカ」と呼ばれることもあります。より移動しやすいプレイスタイルになります。'
      },
      {
        character: characters.find(c => c.id === 'kokomi')!,
        replaces: 'モナ',
        note: '心海を使うとより回復力が高まりますが、バフ能力はモナより低下します。'
      }
    ]
  },
  {
    id: 'raiden-national',
    name: '雷電ナショナル',
    description: '雷電将軍を中心とした元素爆発の連携が特徴のチーム。エネルギー回復と強力なバースト火力で敵を粉砕します。',
    characters: [
      characters.find(c => c.id === 'raiden')!,
      characters.find(c => c.id === 'xiangling')!,
      characters.find(c => c.id === 'xingqiu')!,
      characters.find(c => c.id === 'bennett')!
    ],
    strengths: [
      '雷電将軍によるチーム全体のエネルギー回復',
      '強力な元素反応の連鎖（蒸発、過負荷）',
      'シングルターゲットへの高いダメージ'
    ],
    weaknesses: [
      '全員のバーストを管理する必要がある',
      '雷電将軍のバースト時間中に火力を出し切る必要がある',
      '過負荷反応で敵が弾かれる問題'
    ],
    playstyle: 'ベネットのバースト→行秋のバースト→香菱のバースト→雷電将軍のバーストでの攻撃→循環',
    difficulty: 'easy',
    recommended: true
  },
  {
    id: 'hu-tao-vape',
    name: '胡桃蒸発',
    description: '胡桃の強力な単体ダメージと行秋の水元素連携による蒸発反応を最大限に活用するチーム。HPの管理が重要です。',
    characters: [
      characters.find(c => c.id === 'hu-tao')!,
      characters.find(c => c.id === 'xingqiu')!,
      characters.find(c => c.id === 'zhongli')!,
      characters.find(c => c.id === 'albedo')!
    ],
    strengths: [
      '単体に対する極めて高いダメージ',
      '鍾離の盾による安全なプレイ',
      'アルベドと鍾離の岩共鳴による追加ダメージ'
    ],
    weaknesses: [
      '胡桃のHP管理が必要',
      '範囲攻撃には不向き',
      '厳しいスタミナ管理（チャージ攻撃を多用）'
    ],
    playstyle: '鍾離の盾→アルベドのスキル→行秋のスキルとバースト→胡桃のスキルで攻撃（チャージ攻撃）→繰り返し',
    difficulty: 'medium',
    recommended: true,
    variants: [
      {
        character: characters.find(c => c.id === 'sucrose')!,
        replaces: 'アルベド',
        note: '風元素で抵抗ダウンと元素熟知を上げることで、蒸発ダメージを大幅に上昇できます。'
      },
      {
        character: characters.find(c => c.id === 'kazuha')!,
        replaces: 'アルベド',
        note: '楓原万葉は抵抗ダウンと元素ダメージボーナスを提供し、より高い火力を実現します。'
      }
    ]
  },
  {
    id: 'itto-geo',
    name: '一斗ジオ',
    description: '荒瀧一斗を中心とした岩元素パーティ。ゴローのサポートで岩元素ダメージを最大化し、鍾離の盾で安全に戦えます。',
    characters: [
      characters.find(c => c.id === 'itto')!,
      characters.find(c => c.id === 'gorou')!,
      characters.find(c => c.id === 'zhongli')!,
      characters.find(c => c.id === 'albedo')!
    ],
    strengths: [
      '元素反応に依存しないため、どんな敵にも安定したダメージ',
      '鍾離とゴローによる岩元素ダメージの大幅強化',
      '高い防御力と耐久力'
    ],
    weaknesses: [
      '岩元素以外の盾には効率が落ちる',
      '一斗のバースト管理が必要',
      '特定の元素に対する対策がない'
    ],
    playstyle: '鍾離の盾→アルベドのスキル→ゴローのスキルとバースト→一斗のバーストと荒瀧スラッシュの連携',
    difficulty: 'easy',
    recommended: false
  },
  {
    id: 'hyperbloom',
    name: 'ハイパーブルーム',
    description: '草元素と水元素で種を生成し、雷元素で爆発させる新しい反応系。ナヒーダの草元素応用でチームの火力が大きく向上します。',
    characters: [
      characters.find(c => c.id === 'nahida')!,
      characters.find(c => c.id === 'xingqiu')!,
      characters.find(c => c.id === 'fischl')!,
      characters.find(c => c.id === 'kokomi')!
    ],
    strengths: [
      '持続的な範囲ダメージ',
      '心海による安定した回復',
      '反応に頼るため、キャラクターの育成要求が比較的低い'
    ],
    weaknesses: [
      '単体ダメージはやや物足りない',
      '元素熟知の調整が必要',
      '草元素の付着管理が複雑'
    ],
    playstyle: 'ナヒーダのスキル→フィッシュルのスキル→行秋のスキルとバースト→心海のスキル→通常攻撃でブルーム反応を起こす',
    difficulty: 'medium',
    recommended: true,
    variants: [
      {
        character: characters.find(c => c.id === 'yaoyao')!,
        replaces: '心海',
        note: 'ヨォーヨも回復を提供でき、さらに草元素共鳴を得られます。'
      },
      {
        character: characters.find(c => c.id === 'raiden')!,
        replaces: 'フィッシュル',
        note: '雷電将軍に変更するとエネルギー管理が楽になり、バースト中の火力も上がります。'
      }
    ]
  },
  {
    id: 'ayaka-freeze',
    name: '綾華フリーズ',
    description: '神里綾華の高い火力と凍結反応を組み合わせたチーム。敵を凍結状態に保ちながら、綾華の疾い攻撃で削りつくします。',
    characters: [
      characters.find(c => c.id === 'ayaka')!,
      characters.find(c => c.id === 'kokomi')!,
      characters.find(c => c.id === 'shenhe')!,
      characters.find(c => c.id === 'kazuha')!
    ],
    strengths: [
      '凍結によるコントロール能力',
      '申鶴による氷元素ダメージの大幅強化',
      '心海による安定した回復'
    ],
    weaknesses: [
      '凍結できない敵には効率が下がる',
      '申鶴のバフは一定回数しか適用されない',
      '単一元素に依存するため、氷元素耐性の敵には弱い'
    ],
    playstyle: '楓原万葉のスウィープ→申鶴のスキルとバースト→心海のスキル→綾華のダッシュと通常攻撃からのバースト',
    difficulty: 'medium',
    recommended: true
  },
];

export default function TeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [elementFilter, setElementFilter] = useState<ElementType | 'all'>('all');
  const { playSound } = useSound();

  // 元素フィルター適用
  const handleFilterChange = (element: ElementType | 'all') => {
    setElementFilter(element);
    playSound('click');
  };

  // 難易度に基づく表示情報取得
  const getDifficultyInfo = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return { 
          label: '初心者向け', 
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
        };
      case 'medium':
        return { 
          label: '中級者向け', 
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
        };
      case 'hard':
        return { 
          label: '上級者向け', 
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
        };
    }
  };

  // フィルター適用されたチーム一覧
  const filteredTeams = elementFilter === 'all' 
    ? teams 
    : teams.filter(team => team.characters.some(char => char.element === elementFilter));

  return (
    <main className="max-w-6xl mx-auto relative">
      {/* 背景装飾パターン */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02] pointer-events-none overflow-hidden">
        {/* 直接SVGパターンを描画 */}
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="genshin-pattern-teams" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
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
          <rect width="100%" height="100%" fill="url(#genshin-pattern-teams)"/>
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
            【パーティー編成ガイド】
          </h1>
        </div>
        <FavoriteButton 
          id="teams-page"
          title="パーティー編成"
          url="/teams"
          category="攻略情報"
        />
      </div>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        効率的で強力なパーティー編成を紹介します。様々な状況に対応できるチーム構成を見つけて、あなたの冒険をさらに充実させましょう。
      </p>

      {selectedTeam ? (
        <div className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-amber-200/40 dark:border-amber-800/30 animate-fadeIn">
          <div className="flex justify-between mb-6">
            <button 
              onClick={() => {
                setSelectedTeam(null);
                playSound('click');
              }}
              className="text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-300 flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>チーム一覧に戻る
            </button>
            <FavoriteButton 
              id={`team-${selectedTeam.id}`}
              title={selectedTeam.name}
              url={`/teams?id=${selectedTeam.id}`}
              category="パーティー編成"
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-400 mr-3">
                {selectedTeam.name}
              </h2>
              {selectedTeam.recommended && (
                <span className="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded">
                  <i className="fas fa-star mr-1"></i>おすすめ
                </span>
              )}
              <span className={`ml-2 px-2 py-1 text-xs rounded ${getDifficultyInfo(selectedTeam.difficulty).color}`}>
                {getDifficultyInfo(selectedTeam.difficulty).label}
              </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {selectedTeam.description}
            </p>
          </div>

          {/* チームメンバー */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
              <i className="fas fa-users mr-2 text-amber-600 dark:text-amber-500"></i>
              チームメンバー
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {selectedTeam.characters.map(character => (
                <div 
                  key={character.id}
                  className="bg-gradient-to-br from-amber-50/90 to-white/90 dark:from-gray-800/90 dark:to-gray-700/90 rounded-lg shadow-md p-4 border border-amber-100 dark:border-amber-900/30"
                >
                  <div className="relative h-32 flex justify-center mb-3">
                    <Image
                      src={character.imageUrl}
                      alt={character.name}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8">
                      <Image
                        src={`/elements/${elementIcons[character.element]}.png`}
                        alt={character.element}
                        width={32}
                        height={32}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-amber-800 dark:text-amber-400">
                      {character.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex justify-center items-center">
                      {'★'.repeat(character.rarity)}
                    </div>
                    <div className="mt-1 text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-800 dark:text-amber-300 inline-block">
                      {character.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* バリエーション */}
            {selectedTeam.variants && selectedTeam.variants.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-medium mb-2 text-amber-700 dark:text-amber-400">
                  バリエーション
                </h4>
                <div className="space-y-3">
                  {selectedTeam.variants.map((variant, index) => (
                    <div 
                      key={index}
                      className="bg-white/70 dark:bg-gray-700/70 rounded-lg p-3 border border-amber-100 dark:border-amber-900/30"
                    >
                      <div className="flex items-center">
                        <div className="relative w-12 h-12 mr-3">
                          <Image
                            src={variant.character.imageUrl}
                            alt={variant.character.name}
                            width={48}
                            height={48}
                            className="object-contain rounded-full"
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium text-amber-800 dark:text-amber-400">{variant.character.name}</span>
                            <span className="mx-2 text-gray-400">→</span>
                            <span className="text-gray-700 dark:text-gray-300">{variant.replaces}の代わり</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {variant.note}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 戦術ガイド */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
                <i className="fas fa-gamepad mr-2 text-amber-600 dark:text-amber-500"></i>
                プレイスタイル
              </h3>
              <div className="bg-gradient-to-br from-amber-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-700/80 p-4 rounded-lg shadow-md border border-amber-100 dark:border-amber-900/30">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedTeam.playstyle}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
                <i className="fas fa-balance-scale mr-2 text-amber-600 dark:text-amber-500"></i>
                長所と短所
              </h3>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-3 rounded-lg shadow-sm border border-green-200 dark:border-green-900/30">
                  <h4 className="font-medium text-green-800 dark:text-green-400 mb-2">
                    <i className="fas fa-plus-circle mr-2"></i>長所
                  </h4>
                  <ul className="space-y-1">
                    {selectedTeam.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                        <span className="text-green-600 dark:text-green-500 mr-2">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 p-3 rounded-lg shadow-sm border border-red-200 dark:border-red-900/30">
                  <h4 className="font-medium text-red-800 dark:text-red-400 mb-2">
                    <i className="fas fa-minus-circle mr-2"></i>短所
                  </h4>
                  <ul className="space-y-1">
                    {selectedTeam.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                        <span className="text-red-600 dark:text-red-500 mr-2">•</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 装備推奨 */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
              <i className="fas fa-gem mr-2 text-amber-600 dark:text-amber-500"></i>
              装備推奨
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 p-4 bg-amber-50/80 dark:bg-gray-800/80 rounded-lg border border-amber-100 dark:border-amber-900/30">
              <p>各キャラクターの詳細な聖遺物・武器構成は「聖遺物攻略ページ」を参照してください。</p>
              <p className="mt-2">このチームの基本的な装備指針:</p>
              <ul className="mt-1 list-disc list-inside ml-2 space-y-1">
                <li>メインDPSには攻撃力%、会心率/ダメージ、元素ダメージ%の聖遺物を</li>
                <li>サブDPSには元素チャージ効率と元素熟知のバランスを</li>
                <li>サポートキャラには元素チャージ効率を重視した構成を</li>
                <li>盾キャラには HP% を、回復役には回復効果上昇または HP% を</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* フィルターセクション */}
          <div className="mb-6 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md border border-amber-200/40 dark:border-amber-800/30">
            <h2 className="text-xl font-semibold mb-4 text-amber-800 dark:text-amber-400 flex items-center">
              <i className="fas fa-filter mr-2 text-amber-600 dark:text-amber-500"></i>
              元素でフィルター
            </h2>
            
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  elementFilter === 'all'
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                }`}
                onClick={() => handleFilterChange('all')}
              >
                すべて表示
              </button>
              
              {(['炎', '水', '雷', '氷', '風', '岩', '草'] as ElementType[]).map(element => (
                <button
                  key={element}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center ${
                    elementFilter === element
                      ? 'bg-amber-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                  }`}
                  onClick={() => handleFilterChange(element)}
                >
                  <div className="w-4 h-4 mr-1">
                    <Image
                      src={`/elements/${elementIcons[element]}.png`}
                      alt={element}
                      width={16}
                      height={16}
                    />
                  </div>
                  {element}
                </button>
              ))}
            </div>
          </div>

          {/* チームリスト */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTeams.map(team => (
              <div
                key={team.id}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl 
                         border border-amber-200/40 dark:border-amber-800/30 transition-all duration-300 
                         hover:scale-102 cursor-pointer"
                onClick={() => {
                  setSelectedTeam(team);
                  playSound('click');
                }}
              >
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400">
                      {team.name}
                    </h3>
                    <div className="flex space-x-2">
                      {team.recommended && (
                        <span className="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded flex items-center">
                          <i className="fas fa-star mr-1"></i>おすすめ
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded ${getDifficultyInfo(team.difficulty).color}`}>
                        {getDifficultyInfo(team.difficulty).label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-around">
                    {team.characters.map(character => (
                      <div key={character.id} className="relative">
                        <div className="w-16 h-16 relative">
                          <Image
                            src={character.imageUrl}
                            alt={character.name}
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6">
                            <Image
                              src={`/elements/${elementIcons[character.element]}.png`}
                              alt={character.element}
                              width={24}
                              height={24}
                            />
                          </div>
                        </div>
                        <div className="text-center text-xs mt-1 text-gray-700 dark:text-gray-300">
                          {character.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {team.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {team.strengths.slice(0, 2).map((strength, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-800 dark:text-green-300">
                        <i className="fas fa-plus text-xs mr-1"></i>{strength}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="px-4 py-2 bg-amber-50 dark:bg-gray-700/50 border-t border-amber-100 dark:border-amber-900/30 text-sm text-amber-600 dark:text-amber-400 flex justify-end items-center">
                  詳細を見る <i className="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* パーティー編成のコツ */}
      <div className="mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-amber-200/40 dark:border-amber-800/30">
        <h2 className="text-2xl font-bold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
          <i className="fas fa-lightbulb mr-2 text-amber-600 dark:text-amber-500"></i>
          パーティー編成のコツ
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-amber-700 dark:text-amber-400">
              チーム構成の基本
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span><strong>メインDPS</strong>: チームの主要なダメージソース。フィールドで最も多くの時間を過ごすキャラクター。</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span><strong>サブDPS</strong>: フィールドにいなくてもスキルやバーストでダメージを与えられるキャラクター。</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span><strong>サポート</strong>: シールド、回復、バフなどでチームをサポートするキャラクター。</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span><strong>フレックス</strong>: 状況に応じて変更可能な枠。特定の元素反応や敵に対応するために調整。</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-amber-700 dark:text-amber-400">
              強力なチームを作るには
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span><strong>元素反応を最大化</strong>: 蒸発、溶解、過負荷など、強力な元素反応を活用しましょう。</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span><strong>元素共鳴を活用</strong>: 同じ元素のキャラクターを2人以上入れることで、追加効果が得られます。</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span><strong>エネルギー管理</strong>: チーム全体でエネルギーを効率的に生成し、元素爆発を頻繁に使えるようにしましょう。</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span><strong>バランス</strong>: 攻撃力、防御力、回復のバランスがとれたチームを目指しましょう。</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* コメントセクション */}
      <CommentSection pageId="teams" />
    </main>
  );
} 