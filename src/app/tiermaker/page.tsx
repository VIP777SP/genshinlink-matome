'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { MultiBackend, TouchTransition } from 'react-dnd-multi-backend';
import React from 'react';
import CustomDragLayer from './CustomDragLayer';
import { Character, Weapon, ItemTypes, DragItem, ElementType, WeaponType, RarityType } from './types';
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Tab } from '@headlessui/react';
import { FiEdit3, FiSave, FiPlusCircle, FiTrash2, FiArrowUp, FiArrowDown, FiX } from 'react-icons/fi';
import { TwitterShareButton, TwitterIcon } from 'react-share';

// react-dnd用のシンプルなバックエンド設定 
// マルチバックエンドは一時的に無効化し、シンプルな設定を使用

// より単純な設定を使用するため、直接HTML5Backendを指定
const backendOptions = {
  enableMouseEvents: true,
  delayTouchStart: 0
};

// 属性タイプの定義
// これらの型定義は削除して、types.tsからインポートしたものを使用
// ... existing code ...

// 武器データの型定義
// interface Weapon {
//   id: string;
//   name: string;
//   type: WeaponType;
//   rarity: 3 | 4 | 5;
//   baseAtk: number;
//   subStat: string;
//   passive: string;
//   imageUrl: string;
//   iconUrl: string;
// }

// キャラクター型の定義
// interface Character {
//   id: string;
//   name: string;
//   element: ElementType;
//   weapon: WeaponType;
//   rarity: RarityType;
//   region: string;
//   description?: string;
//   imageUrl?: string;
//   iconUrl: string;
// }

// キャラクターデータ
const characters: Character[] = [
  // 5つ星キャラクター
  {
    id: 'albedo',
    name: 'アルベド',
    element: 'geo',
    weapon: 'sword',
    rarity: 5,
    region: 'モンド',
    iconUrl: '/images/characters/albedo-icon.png'
  },
  {
    id: 'alhaitham',
    name: 'アルハイゼン',
    element: 'dendro',
    weapon: 'sword',
    rarity: 5,
    region: 'スメール',
    iconUrl: '/images/characters/alhaitham-icon.png'
  },
  {
    id: 'ayaka',
    name: '神里綾華',
    element: 'cryo',
    weapon: 'sword',
    rarity: 5,
    region: '稲妻',
    iconUrl: '/images/characters/ayaka-icon.png'
  },
  {
    id: 'baizhu',
    name: '白朮',
    element: 'dendro',
    weapon: 'catalyst',
    rarity: 5,
    region: '璃月',
    iconUrl: '/images/characters/baizhu-icon.png'
  },
  {
    id: 'hutao',
    name: '胡桃',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 5,
    region: '璃月',
    iconUrl: '/images/characters/hutao-icon.png'
  },
  {
    id: 'nahida',
    name: 'ナヒーダ',
    element: 'dendro',
    weapon: 'catalyst',
    rarity: 5,
    region: 'スメール',
    iconUrl: '/images/characters/nahida-icon.png'
  },
  {
    id: 'raiden-shogun',
    name: '雷電将軍',
    element: 'electro',
    weapon: 'polearm',
    rarity: 5,
    region: '稲妻',
    iconUrl: '/images/characters/raiden-shogun-icon.png'
  },
  {
    id: 'kazuha',
    name: '楓原万葉',
    element: 'anemo',
    weapon: 'sword',
    rarity: 5,
    region: '稲妻',
    iconUrl: '/images/characters/kazuha-icon.png'
  },
  {
    id: 'zhongli',
    name: '鍾離',
    element: 'geo',
    weapon: 'polearm',
    rarity: 5,
    region: '璃月',
    iconUrl: '/images/characters/zhongli-icon.png'
  },
  // 4つ星キャラクター
  {
    id: 'beidou',
    name: '北斗',
    element: 'electro',
    weapon: 'claymore',
    rarity: 4,
    region: '璃月',
    iconUrl: '/images/characters/beidou-icon.png'
  },
  {
    id: 'bennett',
    name: 'ベネット',
    element: 'pyro',
    weapon: 'sword',
    rarity: 4,
    region: 'モンド',
    iconUrl: '/images/characters/bennett-icon.png'
  },
  {
    id: 'candace',
    name: 'キャンディス',
    element: 'hydro',
    weapon: 'polearm',
    rarity: 4,
    region: 'スメール',
    iconUrl: '/images/characters/candace-icon.png'
  },
  {
    id: 'charlotte',
    name: 'シャルロット',
    element: 'cryo',
    weapon: 'catalyst',
    rarity: 4,
    region: 'フォンテーヌ',
    iconUrl: '/images/characters/charlotte-icon.png'
  },
  {
    id: 'chevreuse',
    name: 'シュヴルーズ',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 4,
    region: 'フォンテーヌ',
    iconUrl: '/images/characters/chevreuse-icon.png'
  },
  {
    id: 'chiori',
    name: '千織',
    element: 'geo',
    weapon: 'sword',
    rarity: 5,
    region: '稲妻',
    iconUrl: '/images/characters/chiori-icon.png'
  },
  {
    id: 'chongyun',
    name: '重雲',
    element: 'cryo',
    weapon: 'claymore',
    rarity: 4,
    region: '璃月',
    iconUrl: '/images/characters/chongyun-icon.png'
  },
  {
    id: 'collei',
    name: 'コレイ',
    element: 'dendro',
    weapon: 'bow',
    rarity: 4,
    region: 'スメール',
    iconUrl: '/images/characters/collei-icon.png'
  },
  {
    id: 'cyno',
    name: 'セノ',
    element: 'electro',
    weapon: 'polearm',
    rarity: 5,
    region: 'スメール',
    iconUrl: '/images/characters/cyno-icon.png'
  },
  {
    id: 'dehya',
    name: 'デヒヤ',
    element: 'pyro',
    weapon: 'claymore',
    rarity: 5,
    region: 'スメール',
    iconUrl: '/images/characters/dehya-icon.png'
  },
  {
    id: 'diluc',
    name: 'ディルック',
    element: 'pyro',
    weapon: 'claymore',
    rarity: 5,
    region: 'モンド',
    iconUrl: '/images/characters/diluc-icon.png'
  },
  {
    id: 'diona',
    name: 'ディオナ',
    element: 'cryo',
    weapon: 'bow',
    rarity: 4,
    region: 'モンド',
    iconUrl: '/images/characters/diona-icon.png'
  },
  {
    id: 'dori',
    name: 'ドリー',
    element: 'electro',
    weapon: 'claymore',
    rarity: 4,
    region: 'スメール',
    iconUrl: '/images/characters/dori-icon.png'
  },
  {
    id: 'eula',
    name: 'エウルア',
    element: 'cryo',
    weapon: 'claymore',
    rarity: 5,
    region: 'モンド',
    iconUrl: '/images/characters/eula-icon.png'
  },
  {
    id: 'faruzan',
    name: 'ファルザン',
    element: 'anemo',
    weapon: 'bow',
    rarity: 4,
    region: 'スメール',
    iconUrl: '/images/characters/faruzan-icon.png'
  },
  {
    id: 'fischl',
    name: 'フィッシュル',
    element: 'electro',
    weapon: 'bow',
    rarity: 4,
    region: 'モンド',
    iconUrl: '/images/characters/fischl-icon.png'
  },
  {
    id: 'freminet',
    name: 'フレミネ',
    element: 'cryo',
    weapon: 'claymore',
    rarity: 4,
    region: 'フォンテーヌ',
    iconUrl: '/images/characters/freminet-icon.png'
  },
  {
    id: 'furina',
    name: 'フリーナ',
    element: 'hydro',
    weapon: 'sword',
    rarity: 5,
    region: 'フォンテーヌ',
    iconUrl: '/images/characters/furina-icon.png'
  },
  {
    id: 'ganyu',
    name: '甘雨',
    element: 'cryo',
    weapon: 'bow',
    rarity: 5,
    region: '璃月',
    iconUrl: '/images/characters/ganyu-icon.png'
  },
  {
    id: 'gorou',
    name: 'ゴロー',
    element: 'geo',
    weapon: 'bow',
    rarity: 4,
    region: '稲妻',
    iconUrl: '/images/characters/gorou-icon.png'
  },
  {
    id: 'heizou',
    name: '鹿野院平蔵',
    element: 'anemo',
    weapon: 'catalyst',
    rarity: 4,
    region: '稲妻',
    iconUrl: '/images/characters/heizou-icon.png'
  },
  {
    id: 'itto',
    name: '荒瀧一斗',
    element: 'geo',
    weapon: 'claymore',
    rarity: 5,
    region: '稲妻',
    iconUrl: '/images/characters/itto-icon.png'
  },
  {
    id: 'jean',
    name: 'ジン',
    element: 'anemo',
    weapon: 'sword',
    rarity: 5,
    region: 'モンド',
    iconUrl: '/images/characters/jean-icon.png'
  },
  {
    id: 'kaeya',
    name: 'ガイア',
    element: 'cryo',
    weapon: 'sword',
    rarity: 4,
    region: 'モンド',
    iconUrl: '/images/characters/kaeya-icon.png'
  },
  {
    id: 'kaveh',
    name: 'カーヴェ',
    element: 'dendro',
    weapon: 'claymore',
    rarity: 4,
    region: 'スメール',
    iconUrl: '/images/characters/kaveh-icon.png'
  },
  {
    id: 'keqing',
    name: '刻晴',
    element: 'electro',
    weapon: 'sword',
    rarity: 5,
    region: '璃月',
    iconUrl: '/images/characters/keqing-icon.png'
  },
  {
    id: 'kirara',
    name: 'キララ',
    element: 'dendro',
    weapon: 'sword',
    rarity: 4,
    region: '稲妻',
    iconUrl: '/images/characters/kirara-icon.png'
  },
  {
    id: 'klee',
    name: 'クレー',
    element: 'pyro',
    weapon: 'catalyst',
    rarity: 5,
    region: 'モンド',
    iconUrl: '/images/characters/klee-icon.png'
  },
  {
    id: 'kokomi',
    name: '珊瑚宮心海',
    element: 'hydro',
    weapon: 'catalyst',
    rarity: 5,
    region: '稲妻',
    iconUrl: '/images/characters/kokomi-icon.png'
  },
  {
    id: 'kuki-shinobu',
    name: '久岐忍',
    element: 'electro',
    weapon: 'sword',
    rarity: 4,
    region: '稲妻',
    iconUrl: '/images/characters/kuki-shinobu-icon.png'
  },
  {
    id: 'layla',
    name: 'レイラ',
    element: 'cryo',
    weapon: 'sword',
    rarity: 4,
    region: 'スメール',
    iconUrl: '/images/characters/layla-icon.png'
  },
  {
    id: 'lisa',
    name: 'リサ',
    element: 'electro',
    weapon: 'catalyst',
    rarity: 4,
    region: 'モンド',
    iconUrl: '/images/characters/lisa-icon.png'
  },
  {
    id: 'lynette',
    name: 'リネット',
    element: 'anemo',
    weapon: 'sword',
    rarity: 4,
    region: 'フォンテーヌ',
    iconUrl: '/images/characters/lynette-icon.png'
  },
  {
    id: 'lyney',
    name: 'リネ',
    element: 'pyro',
    weapon: 'bow',
    rarity: 5,
    region: 'フォンテーヌ',
    iconUrl: '/images/characters/lyney-icon.png'
  },
  {
    id: 'mika',
    name: 'ミカ',
    element: 'cryo',
    weapon: 'polearm',
    rarity: 4,
    region: 'モンド',
    iconUrl: '/images/characters/mika-icon.png'
  },
  {
    id: 'mona',
    name: 'モナ',
    element: 'hydro',
    weapon: 'catalyst',
    rarity: 5,
    region: 'モンド',
    iconUrl: '/images/characters/mona-icon.png'
  },
  {
    id: 'neuvillette',
    name: 'ヌヴィレット',
    element: 'hydro',
    weapon: 'catalyst',
    rarity: 5,
    region: 'フォンテーヌ',
    iconUrl: '/images/characters/neuvillette-icon.png'
  },
  {
    id: 'nilou',
    name: 'ニィロウ',
    element: 'hydro',
    weapon: 'sword',
    rarity: 5,
    region: 'スメール',
    iconUrl: '/images/characters/nilou-icon.png'
  },
  {
    id: 'ningguang',
    name: '凝光',
    element: 'geo',
    weapon: 'catalyst',
    rarity: 4,
    region: '璃月',
    iconUrl: '/images/characters/ningguang-icon.png'
  },
  {
    id: 'noelle',
    name: 'ノエル',
    element: 'geo',
    weapon: 'claymore',
    rarity: 4,
    region: 'モンド',
    iconUrl: '/images/characters/noelle-icon.png'
  },
  {
    id: 'qiqi',
    name: '七七',
    element: 'cryo',
    weapon: 'sword',
    rarity: 5,
    region: '璃月',
    iconUrl: '/images/characters/qiqi-icon.png'
  },
  {
    id: 'razor',
    name: 'レザー',
    element: 'electro',
    weapon: 'claymore',
    rarity: 4,
    region: 'モンド',
    iconUrl: '/images/characters/razor-icon.png'
  },
  {
    id: 'rosaria',
    name: 'ロサリア',
    element: 'cryo',
    weapon: 'polearm',
    rarity: 4,
    region: 'モンド',
    iconUrl: '/images/characters/rosaria-icon.png'
  },
  {
    id: 'sara',
    name: '九条裟羅',
    element: 'electro',
    weapon: 'bow',
    rarity: 4,
    region: '稲妻',
    iconUrl: '/images/characters/sara-icon.png'
  },
  {
    id: 'sayu',
    name: '早柚',
    element: 'anemo',
    weapon: 'claymore',
    rarity: 4,
    region: '稲妻',
    iconUrl: '/images/characters/sayu-icon.png'
  },
  {
    id: 'shenhe',
    name: '申鶴',
    element: 'cryo',
    weapon: 'polearm',
    rarity: 5,
    region: '璃月',
    iconUrl: '/images/characters/shenhe-icon.png'
  },
  {
    id: 'sucrose',
    name: 'スクロース',
    element: 'anemo',
    weapon: 'catalyst',
    rarity: 4,
    region: 'モンド',
    iconUrl: '/images/characters/sucrose-icon.png'
  },
  {
    id: 'tartaglia',
    name: 'タルタリヤ',
    element: 'hydro',
    weapon: 'bow',
    rarity: 5,
    region: 'スネージナヤ',
    iconUrl: '/images/characters/tartaglia-icon.png'
  },
  {
    id: 'thoma',
    name: 'トーマ',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 4,
    region: '稲妻',
    iconUrl: '/images/characters/thoma-icon.png'
  },
  {
    id: 'tighnari',
    name: 'ティナリ',
    element: 'dendro',
    weapon: 'bow',
    rarity: 5,
    region: 'スメール',
    iconUrl: '/images/characters/tighnari-icon.png'
  },
  {
    id: 'venti',
    name: 'ウェンティ',
    element: 'anemo',
    weapon: 'bow',
    rarity: 5,
    region: 'モンド',
    iconUrl: '/images/characters/venti-icon.png'
  },
  {
    id: 'wanderer',
    name: '放浪者',
    element: 'anemo',
    weapon: 'catalyst',
    rarity: 5,
    region: 'スメール',
    iconUrl: '/images/characters/wanderer-icon.png'
  },
  {
    id: 'xiangling',
    name: '香菱',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 4,
    region: '璃月',
    iconUrl: '/images/characters/xiangling-icon.png'
  },
  {
    id: 'xiao',
    name: '魈',
    element: 'anemo',
    weapon: 'polearm',
    rarity: 5,
    region: '璃月',
    iconUrl: '/images/characters/xiao-icon.png'
  },
  {
    id: 'xingqiu',
    name: '行秋',
    element: 'hydro',
    weapon: 'sword',
    rarity: 4,
    region: '璃月',
    iconUrl: '/images/characters/xingqiu-icon.png'
  },
  {
    id: 'xinyan',
    name: '辛炎',
    element: 'pyro',
    weapon: 'claymore',
    rarity: 4,
    region: '璃月',
    iconUrl: '/images/characters/xinyan-icon.png'
  },
  {
    id: 'yae-miko',
    name: '八重神子',
    element: 'electro',
    weapon: 'catalyst',
    rarity: 5,
    region: '稲妻',
    iconUrl: '/images/characters/yae-miko-icon.png'
  },
  {
    id: 'yanfei',
    name: '煙緋',
    element: 'pyro',
    weapon: 'catalyst',
    rarity: 4,
    region: '璃月',
    iconUrl: '/images/characters/yanfei-icon.png'
  },
  {
    id: 'yaoyao',
    name: '瑶瑶',
    element: 'dendro',
    weapon: 'polearm',
    rarity: 4,
    region: '璃月',
    iconUrl: '/images/characters/yaoyao-icon.png'
  },
  {
    id: 'yelan',
    name: '夜蘭',
    element: 'hydro',
    weapon: 'bow',
    rarity: 5,
    region: '璃月',
    iconUrl: '/images/characters/yelan-icon.png'
  },
  {
    id: 'yoimiya',
    name: '宵宮',
    element: 'pyro',
    weapon: 'bow',
    rarity: 5,
    region: '稲妻',
    iconUrl: '/images/characters/yoimiya-icon.png'
  },
  {
    id: 'yunjin',
    name: '雲菫',
    element: 'geo',
    weapon: 'polearm',
    rarity: 4,
    region: '璃月',
    iconUrl: '/images/characters/yunjin-icon.png'
  }
];

// 武器データ
const weapons: Weapon[] = [
  {
    id: 'mistsplitter',
    name: '霧切の廻光',
    type: 'sword',
    rarity: 5,
    baseAtk: 48,
    subStat: '会心ダメージ',
    passive: '霧切の極意：元素ダメージバフ最大12%/24%/28%(3層)、元素スキル使用後+12%',
    imageUrl: '/images/weapons/mistsplitter.png',
    iconUrl: '/images/weapons/mistsplitter-icon.png'
  },
  {
    id: 'homa',
    name: '護摩の杖',
    type: 'polearm',
    rarity: 5,
    baseAtk: 46,
    subStat: '会心ダメージ',
    passive: '無攬の従容：HP上限20%アップ、HP上限の0.8%分攻撃力アップ、HP50%以下で1.8%',
    imageUrl: '/images/weapons/homa.png',
    iconUrl: '/images/weapons/homa-icon.png'
  },
  {
    id: 'thundering-pulse',
    name: '飛雷の鼓槌',
    type: 'bow',
    rarity: 5,
    baseAtk: 46,
    subStat: '会心ダメージ',
    passive: '飛雷の巴紋：通常攻撃ダメージ最大40%アップ(3層)、攻撃力20%アップ',
    imageUrl: '/images/weapons/thundering_pulse.png',
    iconUrl: '/images/weapons/thundering-pulse-icon.png'
  },
  {
    id: 'wolf-gravestone',
    name: '狼の末路',
    type: 'claymore',
    rarity: 5,
    baseAtk: 46,
    subStat: '攻撃力%',
    passive: '狼の渇望：攻撃力20%アップ、HP30%以下の敵を攻撃すると、チーム全員の攻撃力40%アップ',
    imageUrl: '/images/weapons/wolf_gravestone.png',
    iconUrl: '/images/weapons/wolf-gravestone-icon.png'
  },
  {
    id: 'lost-prayer',
    name: '四風原典',
    type: 'catalyst',
    rarity: 5,
    baseAtk: 46,
    subStat: '会心率',
    passive: '無辺際の祝詞：移動速度10%アップ、戦闘中4秒毎に元素ダメージ8%アップ(最大4層)',
    imageUrl: '/images/weapons/lost_prayer.png',
    iconUrl: '/images/weapons/lost-prayer-icon.png'
  },
  // 5★武器の追加データ
  {
    id: 'engulfing-lightning',
    name: '草薙の稲光',
    type: 'polearm',
    rarity: 5,
    baseAtk: 46,
    subStat: '元素チャージ効率',
    passive: '非時の夢・常世竈食：元素チャージ効率に基づいて攻撃力アップ(最大80%)、元素爆発後エネルギー回復速度アップ',
    imageUrl: '/images/weapons/engulfing-lightning.png',
    iconUrl: '/images/weapons/engulfing-lightning-icon.png'
  },
  {
    id: 'aqua-simulacra',
    name: '若水',
    type: 'bow',
    rarity: 5,
    baseAtk: 44,
    subStat: '会心ダメージ',
    passive: '潜形の浪：HPが20%アップ、周囲に敵がいる時、全ダメージ20%アップ',
    imageUrl: '/images/weapons/aqua-simulacra.png',
    iconUrl: '/images/weapons/aqua-simulacra-icon.png'
  },
  {
    id: 'jade-cutter',
    name: '磐岩結緑',
    type: 'sword',
    rarity: 5,
    baseAtk: 44,
    subStat: '会心率',
    passive: '護国の無垢：HP上限20%アップ、HP上限の1.2%分、攻撃力アップ',
    imageUrl: '/images/weapons/jade-cutter.png',
    iconUrl: '/images/weapons/jade-cutter-icon.png'
  },
  {
    id: 'skyward-harp',
    name: '天空の翼',
    type: 'bow',
    rarity: 5,
    baseAtk: 48,
    subStat: '会心率',
    passive: '回響長天の歌：会心ダメージ20%アップ、攻撃時60%の確率で物理ダメージを追加',
    imageUrl: '/images/weapons/skyward-harp.png',
    iconUrl: '/images/weapons/skyward-harp-icon.png'
  },
  {
    id: 'redhorn-stonethresher',
    name: '赤角石塵滅砕',
    type: 'claymore',
    rarity: 5,
    baseAtk: 44,
    subStat: '会心ダメージ',
    passive: '古き役目の残光：防御力40%アップ、通常攻撃と重撃のダメージは防御力の40%分アップ',
    imageUrl: '/images/weapons/redhorn-stonethresher.png',
    iconUrl: '/images/weapons/redhorn-stonethresher-icon.png'
  },
  {
    id: 'skyward-blade',
    name: '天空の刃',
    type: 'sword',
    rarity: 5,
    baseAtk: 46,
    subStat: '元素チャージ効率',
    passive: '穿流・雲間の月：会心率4%アップ、元素爆発使用後、移動速度・攻撃速度・通常攻撃と重撃ダメージアップ',
    imageUrl: '/images/weapons/skyward-blade.png',
    iconUrl: '/images/weapons/skyward-blade-icon.png'
  },
  {
    id: 'skyward-spine',
    name: '天空の脊',
    type: 'polearm',
    rarity: 5,
    baseAtk: 48,
    subStat: '元素チャージ効率',
    passive: '流月の針：会心率8%、通常攻撃速度12%アップ、通常攻撃と重撃が50%の確率で追加ダメージを与える',
    imageUrl: '/images/weapons/skyward-spine.png',
    iconUrl: '/images/weapons/skyward-spine-icon.png'
  },
  {
    id: 'skyward-pride',
    name: '天空の傲',
    type: 'claymore',
    rarity: 5,
    baseAtk: 48,
    subStat: '元素チャージ効率',
    passive: '揺籃の雲：全ダメージ8%アップ、元素爆発使用後、通常攻撃と重撃が真空ブレードを放つ',
    imageUrl: '/images/weapons/skyward-pride.png',
    iconUrl: '/images/weapons/skyward-pride-icon.png'
  },
  {
    id: 'skyward-atlas',
    name: '天空の巻',
    type: 'catalyst',
    rarity: 5,
    baseAtk: 48,
    subStat: '攻撃力%',
    passive: '浮遊の星雲：元素ダメージ12%アップ、通常攻撃時、50%の確率で追尾の雲をまとう',
    imageUrl: '/images/weapons/skyward-atlas.png',
    iconUrl: '/images/weapons/skyward-atlas-icon.png'
  },
  {
    id: 'primordial-jade-winged-spear',
    name: '和璞鳶',
    type: 'polearm',
    rarity: 5,
    baseAtk: 48,
    subStat: '会心率',
    passive: '昭質の鷹羽：攻撃命中時、攻撃力と全ダメージがアップ(7段階まで)',
    imageUrl: '/images/weapons/primordial-jade-winged-spear.png',
    iconUrl: '/images/weapons/primordial-jade-winged-spear-icon.png'
  },
  {
    id: 'amos-bow',
    name: 'アモスの弓',
    type: 'bow',
    rarity: 5,
    baseAtk: 46,
    subStat: '攻撃力%',
    passive: '強い弓：通常攻撃と重撃のダメージ12%アップ、矢が放たれてから0.1秒ごとにダメージ8%アップ(最大5回)',
    imageUrl: '/images/weapons/amos-bow.png',
    iconUrl: '/images/weapons/amos-bow-icon.png'
  },
  {
    id: 'polar-star',
    name: '冬極の白星',
    type: 'bow',
    rarity: 5,
    baseAtk: 45,
    subStat: '会心率',
    passive: '極夜の寒星：元素スキルと元素爆発のダメージ12%アップ、様々な攻撃で攻撃力バフ獲得(最大4スタック)',
    imageUrl: '/images/weapons/polar-star.png',
    iconUrl: '/images/weapons/polar-star-icon.png'
  },
  {
    id: 'memory-of-dust',
    name: '塵世の錫杖',
    type: 'catalyst',
    rarity: 5,
    baseAtk: 46,
    subStat: '攻撃力%',
    passive: '金璋添玉：シールド強化20%、攻撃命中時に攻撃力アップ(最大5重複)、シールド状態だと効果2倍',
    imageUrl: '/images/weapons/memory-of-dust.png',
    iconUrl: '/images/weapons/memory-of-dust-icon.png'
  },
  {
    id: 'unforged',
    name: '無工の剣',
    type: 'claymore',
    rarity: 5,
    baseAtk: 46,
    subStat: '攻撃力%',
    passive: '金璋匣暮：シールド強化20%、攻撃命中時に攻撃力アップ(最大5重複)、シールド状態だと効果2倍',
    imageUrl: '/images/weapons/unforged.png',
    iconUrl: '/images/weapons/unforged-icon.png'
  },
  {
    id: 'freedom-sworn',
    name: '蒼古なる自由への誓い',
    type: 'sword',
    rarity: 5,
    baseAtk: 44,
    subStat: '元素熟知',
    passive: '永続の森：元素ダメージ10%アップ、元素反応で印を獲得、2層で通常攻撃・重撃・追撃ダメージ16%と攻撃力20%アップ',
    imageUrl: '/images/weapons/freedom-sworn.png',
    iconUrl: '/images/weapons/freedom-sworn-icon.png'
  },
  // 4★武器
  {
    id: 'widsith',
    name: '流浪楽章',
    type: 'catalyst',
    rarity: 4,
    baseAtk: 42,
    subStat: '会心ダメージ',
    passive: '登場の間奏：キャラ登場時、ランダムなテーマ曲を演奏、各種バフを付与(10秒)',
    imageUrl: '/images/weapons/widsith.png',
    iconUrl: '/images/weapons/widsith-icon.png'
  },
  {
    id: 'rust',
    name: '弓蔵',
    type: 'bow',
    rarity: 4,
    baseAtk: 42,
    subStat: '攻撃力%',
    passive: '速射強弓：通常攻撃のダメージ40%アップ、重撃のダメージ10%ダウン',
    imageUrl: '/images/weapons/rust.png',
    iconUrl: '/images/weapons/rust-icon.png'
  },
  {
    id: 'sacrificial-sword',
    name: '祭礼の剣',
    type: 'sword',
    rarity: 4,
    baseAtk: 41,
    subStat: '元素チャージ効率',
    passive: '気息of生死の間：元素スキルが敵にダメージを与えた時、40%の確率で元素スキルのCDがリセット',
    imageUrl: '/images/weapons/sacrificial-sword.png',
    iconUrl: '/images/weapons/sacrificial-sword-icon.png'
  },
  {
    id: 'dragon-bane',
    name: '匣中滅龍',
    type: 'polearm',
    rarity: 4,
    baseAtk: 41,
    subStat: '元素熟知',
    passive: '破龍の断章：炎元素または水元素の影響を受けた敵に対するダメージ20%アップ',
    imageUrl: '/images/weapons/dragon-bane.png',
    iconUrl: '/images/weapons/dragon-bane-icon.png'
  },
  {
    id: 'serpent-spine',
    name: '螭龍の剣',
    type: 'claymore',
    rarity: 4,
    baseAtk: 42,
    subStat: '会心率',
    passive: '波セレナーデ：戦闘中、4秒毎にダメージ6%アップ(最大5重複)、被ダメージでスタック減少',
    imageUrl: '/images/weapons/serpent-spine.png',
    iconUrl: '/images/weapons/serpent-spine-icon.png'
  },
  {
    id: 'favonius-lance',
    name: '西風長槍',
    type: 'polearm',
    rarity: 4,
    baseAtk: 44,
    subStat: '元素チャージ効率',
    passive: '風呂循環：会心攻撃時、60%の確率で少量の元素粒子を生成(CD6秒)',
    imageUrl: '/images/weapons/favonius-lance.png',
    iconUrl: '/images/weapons/favonius-lance-icon.png'
  },
  {
    id: 'favonius-sword',
    name: '西風剣',
    type: 'sword',
    rarity: 4,
    baseAtk: 41,
    subStat: '元素チャージ効率',
    passive: '風呂循環：会心攻撃時、60%の確率で少量の元素粒子を生成(CD6秒)',
    imageUrl: '/images/weapons/favonius-sword.png',
    iconUrl: '/images/weapons/favonius-sword-icon.png'
  },
  {
    id: 'favonius-greatsword',
    name: '西風大剣',
    type: 'claymore',
    rarity: 4,
    baseAtk: 41,
    subStat: '元素チャージ効率',
    passive: '風呂循環：会心攻撃時、60%の確率で少量の元素粒子を生成(CD6秒)',
    imageUrl: '/images/weapons/favonius-greatsword.png',
    iconUrl: '/images/weapons/favonius-greatsword-icon.png'
  },
  {
    id: 'favonius-warbow',
    name: '西風猟弓',
    type: 'bow',
    rarity: 4,
    baseAtk: 41,
    subStat: '元素チャージ効率',
    passive: '風呂循環：会心攻撃時、60%の確率で少量の元素粒子を生成(CD6秒)',
    imageUrl: '/images/weapons/favonius-warbow.png',
    iconUrl: '/images/weapons/favonius-warbow-icon.png'
  },
  {
    id: 'favonius-codex',
    name: '西風秘典',
    type: 'catalyst',
    rarity: 4,
    baseAtk: 42,
    subStat: '元素チャージ効率',
    passive: '風呂循環：会心攻撃時、60%の確率で少量の元素粒子を生成(CD6秒)',
    imageUrl: '/images/weapons/favonius-codex.png',
    iconUrl: '/images/weapons/favonius-codex-icon.png'
  },
  {
    id: 'lions-roar',
    name: '匣中龍吟',
    type: 'sword',
    rarity: 4,
    baseAtk: 42,
    subStat: '攻撃力%',
    passive: '破雷の巻：炎元素または雷元素の影響を受けた敵に対するダメージ20%アップ',
    imageUrl: '/images/weapons/lions-roar.png',
    iconUrl: '/images/weapons/lions-roar-icon.png'
  },
  {
    id: 'rainslasher',
    name: '雨裁',
    type: 'claymore',
    rarity: 4,
    baseAtk: 42,
    subStat: '元素熟知',
    passive: '止水の巻：水元素または雷元素の影響を受けた敵に対するダメージ20%アップ',
    imageUrl: '/images/weapons/rainslasher.png',
    iconUrl: '/images/weapons/rainslasher-icon.png'
  },
  {
    id: 'stringless',
    name: '絶弦',
    type: 'bow',
    rarity: 4,
    baseAtk: 42,
    subStat: '元素熟知',
    passive: '無矢の歌：元素スキルと元素爆発のダメージ24%アップ',
    imageUrl: '/images/weapons/stringless.png',
    iconUrl: '/images/weapons/stringless-icon.png'
  },
  {
    id: 'eye-of-perception',
    name: '昭心',
    type: 'catalyst',
    rarity: 4,
    baseAtk: 41,
    subStat: '攻撃力%',
    passive: '回転の渦：通常攻撃と重撃時、50%の確率で攻撃力の240%の追加ダメージを与える(CD12秒)',
    imageUrl: '/images/weapons/eye-of-perception.png',
    iconUrl: '/images/weapons/eye-of-perception-icon.png'
  },
  {
    id: 'sacrificial-greatsword',
    name: '祭礼の大剣',
    type: 'claymore',
    rarity: 4,
    baseAtk: 44,
    subStat: '元素チャージ効率',
    passive: '気息of生死の間：元素スキルが敵にダメージを与えた時、40%の確率で元素スキルのCDがリセット',
    imageUrl: '/images/weapons/sacrificial-greatsword.png',
    iconUrl: '/images/weapons/sacrificial-greatsword-icon.png'
  },
  {
    id: 'sacrificial-bow',
    name: '祭礼の弓',
    type: 'bow',
    rarity: 4,
    baseAtk: 44,
    subStat: '元素チャージ効率',
    passive: '気息of生死の間：元素スキルが敵にダメージを与えた時、40%の確率で元素スキルのCDがリセット',
    imageUrl: '/images/weapons/sacrificial-bow.png',
    iconUrl: '/images/weapons/sacrificial-bow-icon.png'
  },
  {
    id: 'sacrificial-fragments',
    name: '祭礼の断片',
    type: 'catalyst',
    rarity: 4,
    baseAtk: 41,
    subStat: '元素熟知',
    passive: '気息of生死の間：元素スキルが敵にダメージを与えた時、40%の確率で元素スキルのCDがリセット',
    imageUrl: '/images/weapons/sacrificial-fragments.png',
    iconUrl: '/images/weapons/sacrificial-fragments-icon.png'
  },
  {
    id: 'deathmatch',
    name: '死闘の槍',
    type: 'polearm',
    rarity: 4,
    baseAtk: 41,
    subStat: '会心率',
    passive: '命中の幕：周囲の敵が2体以上の場合、攻撃力16%と防御力16%アップ、1体以下の場合は攻撃力24%アップ',
    imageUrl: '/images/weapons/deathmatch.png',
    iconUrl: '/images/weapons/deathmatch-icon.png'
  },
  {
    id: 'black-sword',
    name: '黒剣',
    type: 'sword',
    rarity: 4,
    baseAtk: 42,
    subStat: '会心率',
    passive: '正義：通常攻撃と重撃のダメージ20%アップ、会心攻撃時、HPの60%分回復(CD5秒)',
    imageUrl: '/images/weapons/black-sword.png',
    iconUrl: '/images/weapons/black-sword-icon.png'
  },
  {
    id: 'royal-greatsword',
    name: '旧貴族大剣',
    type: 'claymore',
    rarity: 4,
    baseAtk: 44,
    subStat: '攻撃力%',
    passive: '集中：敵に会心でないダメージを与えると、会心率8%アップ(最大5重複)、会心発生時にスタックリセット',
    imageUrl: '/images/weapons/royal-greatsword.png',
    iconUrl: '/images/weapons/royal-greatsword-icon.png'
  },
  {
    id: 'alley-hunter',
    name: '暗巷の狩人',
    type: 'bow',
    rarity: 4,
    baseAtk: 44,
    subStat: '会心率',
    passive: '街の狩猟者：フィールドにいる毎秒、与えるダメージ2%アップ(最大10重複)、ダメージを受けるとスタック1失う',
    imageUrl: '/images/weapons/alley-hunter.png',
    iconUrl: '/images/weapons/alley-hunter-icon.png'
  },
  {
    id: 'blackcliff-amulet',
    name: '黒岩緋玉',
    type: 'catalyst',
    rarity: 4,
    baseAtk: 42,
    subStat: '会心ダメージ',
    passive: '乗勝：敵を倒した後、攻撃力12%アップ(最大3重複)、継続時間30秒、重複ごとに継続時間は独立計算',
    imageUrl: '/images/weapons/blackcliff-amulet.png',
    iconUrl: '/images/weapons/blackcliff-amulet-icon.png'
  },
  {
    id: 'prototype-crescent',
    name: '試作澹月',
    type: 'bow',
    rarity: 4,
    baseAtk: 42,
    subStat: '攻撃力%',
    passive: '無欠の一射：弱点に狙い撃ちを命中させた後、移動速度と攻撃力10%アップ、継続時間10秒',
    imageUrl: '/images/weapons/prototype-crescent.png',
    iconUrl: '/images/weapons/prototype-crescent-icon.png'
  },
  // 3★武器
  {
    id: 'white-tassel',
    name: '白纓槍',
    type: 'polearm',
    rarity: 3,
    baseAtk: 39,
    subStat: '会心率',
    passive: '無垢なる弾き：通常攻撃のダメージ24%アップ',
    imageUrl: '/images/weapons/white-tassel.png',
    iconUrl: '/images/weapons/white-tassel-icon.png'
  },
  {
    id: 'thrilling-tales-of-dragon-slayers',
    name: '龍殺しの英傑譚',
    type: 'catalyst',
    rarity: 3,
    baseAtk: 39,
    subStat: 'HP%',
    passive: '伝承：キャラクター交代時、次のキャラクターの攻撃力を48%アップ、継続時間10秒(CD20秒)',
    imageUrl: '/images/weapons/thrilling-tales-of-dragon-slayers.png',
    iconUrl: '/images/weapons/thrilling-tales-of-dragon-slayers-icon.png'
  },
  {
    id: 'harbinger-of-dawn',
    name: '黎明の神剣',
    type: 'sword',
    rarity: 3,
    baseAtk: 39,
    subStat: '会心ダメージ',
    passive: '日暮：HP70%以上の時、会心率28%アップ',
    imageUrl: '/images/weapons/harbinger-of-dawn.png',
    iconUrl: '/images/weapons/harbinger-of-dawn-icon.png'
  },
  {
    id: 'slingshot',
    name: '弾弓',
    type: 'bow',
    rarity: 3,
    baseAtk: 38,
    subStat: '会心率',
    passive: '弾丸装填：通常攻撃または狙い撃ちが0.3秒以内に命中した場合、ダメージ36%アップ、それ以上は10%ダウン',
    imageUrl: '/images/weapons/slingshot.png',
    iconUrl: '/images/weapons/slingshot-icon.png'
  },
  {
    id: 'debate-club',
    name: '理屈責め',
    type: 'claymore',
    rarity: 3,
    baseAtk: 39,
    subStat: '攻撃力%',
    passive: '理屈破り：元素スキル使用後3秒間、通常・重撃時に攻撃力60%の追加ダメージを与える(CD3秒)',
    imageUrl: '/images/weapons/debate-club.png',
    iconUrl: '/images/weapons/debate-club-icon.png'
  },
  {
    id: 'black-tassel',
    name: '黒纓槍',
    type: 'polearm',
    rarity: 3,
    baseAtk: 38,
    subStat: 'HP%',
    passive: '害虫駆除：スライムに与えるダメージ40%アップ',
    imageUrl: '/images/weapons/black-tassel.png',
    iconUrl: '/images/weapons/black-tassel-icon.png'
  },
  {
    id: 'magic-guide',
    name: '魔導緒論',
    type: 'catalyst',
    rarity: 3,
    baseAtk: 38,
    subStat: '元素熟知',
    passive: '洞察：水元素または雷元素の影響を受けた敵に対するダメージ12%アップ',
    imageUrl: '/images/weapons/magic-guide.png',
    iconUrl: '/images/weapons/magic-guide-icon.png'
  },
  {
    id: 'cool-steel',
    name: '冷刃',
    type: 'sword',
    rarity: 3,
    baseAtk: 39,
    subStat: '攻撃力%',
    passive: '止水：水元素または氷元素の影響を受けた敵に対するダメージ12%アップ',
    imageUrl: '/images/weapons/cool-steel.png',
    iconUrl: '/images/weapons/cool-steel-icon.png'
  },
  {
    id: 'raven-bow',
    name: '鴉羽の弓',
    type: 'bow',
    rarity: 3,
    baseAtk: 40,
    subStat: '元素熟知',
    passive: '猟的の追跡：水元素または炎元素の影響を受けた敵に対するダメージ12%アップ',
    imageUrl: '/images/weapons/raven-bow.png',
    iconUrl: '/images/weapons/raven-bow-icon.png'
  },
  {
    id: 'bloodtainted-greatsword',
    name: '鉄影段平',
    type: 'claymore',
    rarity: 3,
    baseAtk: 38,
    subStat: '元素熟知',
    passive: '踏血：炎元素または雷元素の影響を受けた敵に対するダメージ12%アップ',
    imageUrl: '/images/weapons/bloodtainted-greatsword.png',
    iconUrl: '/images/weapons/bloodtainted-greatsword-icon.png'
  }
];

// テンプレート型の定義
interface TierTemplate {
  id: string;
  name: string;
  tiers: {
    id: string;
    name: string;
    color: string;
  }[];
}

// 利用可能なテンプレート
const templates: TierTemplate[] = [
  {
    id: 'strongest',
    name: '最強キャラTier',
    tiers: [
      { id: 's', name: 'S', color: 'bg-red-600' },
      { id: 'a', name: 'A', color: 'bg-orange-500' },
      { id: 'b', name: 'B', color: 'bg-yellow-500' },
      { id: 'c', name: 'C', color: 'bg-green-500' },
      { id: 'd', name: 'D', color: 'bg-blue-500' },
      { id: 'f', name: 'F', color: 'bg-purple-500' },
    ]
  },
  {
    id: 'favorite',
    name: '推しキャラTier',
    tiers: [
      { id: 'love', name: '推し', color: 'bg-pink-500' },
      { id: 'like', name: '好き', color: 'bg-purple-500' },
      { id: 'ok', name: '普通', color: 'bg-blue-500' },
      { id: 'dislike', name: '嫌い', color: 'bg-gray-500' },
    ]
  },
  {
    id: 'wanted',
    name: '引きたいキャラTier',
    tiers: [
      { id: 'must', name: '必須', color: 'bg-red-600' },
      { id: 'want', name: '欲しい', color: 'bg-orange-500' },
      { id: 'maybe', name: '検討中', color: 'bg-yellow-500' },
      { id: 'skip', name: 'スキップ', color: 'bg-gray-500' },
    ]
  }
];

// 武器用のテンプレート
const weaponTemplates: TierTemplate[] = [
  {
    id: 'weapon-strongest',
    name: '最強武器Tier',
    tiers: [
      { id: 'weapon-s', name: 'S', color: 'bg-red-600' },
      { id: 'weapon-a', name: 'A', color: 'bg-orange-500' },
      { id: 'weapon-b', name: 'B', color: 'bg-yellow-500' },
      { id: 'weapon-c', name: 'C', color: 'bg-green-500' },
      { id: 'weapon-d', name: 'D', color: 'bg-blue-500' },
      { id: 'weapon-f', name: 'F', color: 'bg-purple-500' },
    ]
  },
  {
    id: 'weapon-favorite',
    name: '推し武器Tier',
    tiers: [
      { id: 'weapon-love', name: '推し', color: 'bg-pink-500' },
      { id: 'weapon-like', name: '好き', color: 'bg-purple-500' },
      { id: 'weapon-ok', name: '普通', color: 'bg-blue-500' },
      { id: 'weapon-dislike', name: '嫌い', color: 'bg-gray-500' },
    ]
  },
  {
    id: 'weapon-wanted',
    name: '欲しい武器Tier',
    tiers: [
      { id: 'weapon-must', name: '必須', color: 'bg-red-600' },
      { id: 'weapon-want', name: '欲しい', color: 'bg-orange-500' },
      { id: 'weapon-maybe', name: '検討中', color: 'bg-yellow-500' },
      { id: 'weapon-skip', name: 'スキップ', color: 'bg-gray-500' },
    ]
  }
];

// ドラッグアイテムタイプの定義
// ここでItemTypesの定義を削除

// ドラッグアイテムの型定義
// interface DragItem {
//   id: string;
// }

// コンポーネントProps型定義
interface CharacterCardProps {
  character: Character;
  onDrop: (characterId: string, tierId: string) => void;
  currentTier: string;
}

interface TierRowProps {
  tier: {
    id: string;
    name: string;
    color: string;
  };
  charactersInTier: Character[];
  onDrop: (characterId: string, tierId: string) => void;
}

// キャラクターカードコンポーネント
const CharacterCard = ({ character, onDrop, currentTier }: CharacterCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CHARACTER,
    item: { id: character.id } as DragItem,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
    options: {
      dropEffect: 'move',
    },
    end: (item, monitor) => {
      console.log('Drag ended:', item);
    },
  }));
  
  // ref と drag を接続
  drag(ref);

  // 未割り当てエリア以外に配置されている場合のみ削除ボタンを表示
  const showRemoveButton = currentTier !== 'unassigned';

  // 削除ボタンクリック時の処理
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // ドラッグイベントが発火しないよう阻止
    onDrop(character.id, 'unassigned');
  };

  return (
    <div
      ref={ref}
      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden 
                  border-2 border-amber-200 dark:border-amber-800
                  shadow-md cursor-move transition-transform
                  ${isDragging ? 'opacity-50' : 'opacity-100'}
                  hover:scale-105 hover:shadow-lg hover:z-10`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Image
        src={character.iconUrl}
        alt={character.name}
        fill
        className="object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
        <p className="text-xs text-white truncate text-center">{character.name}</p>
      </div>
      {character.rarity === 5 && (
        <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs px-1 rounded-bl">★5</div>
      )}
      {showRemoveButton && (
        <button 
          onClick={handleRemove}
          className="absolute top-0 left-0 bg-red-500 text-white rounded-br p-0.5 opacity-70 hover:opacity-100"
          title="Tierから削除"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

// 武器カードのProps型定義
interface WeaponCardProps {
  weapon: Weapon;
  onDrop: (weaponId: string, tierId: string) => void;
  currentTier: string;
}

// 武器カードコンポーネント
const WeaponCard = ({ weapon, onDrop, currentTier }: WeaponCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.WEAPON,
    item: { id: weapon.id } as DragItem,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
    options: {
      dropEffect: 'move',
    },
    end: (item, monitor) => {
      console.log('Drag ended:', item);
    },
  }));
  
  // ref と drag を接続
  drag(ref);

  // 未割り当てエリア以外に配置されている場合のみ削除ボタンを表示
  const showRemoveButton = currentTier !== 'weapon-unassigned';

  // 削除ボタンクリック時の処理
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // ドラッグイベントが発火しないよう阻止
    onDrop(weapon.id, 'weapon-unassigned');
  };

  return (
    <div
      ref={ref}
      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden 
                  border-2 border-amber-200 dark:border-amber-800
                  shadow-md cursor-move transition-transform
                  ${isDragging ? 'opacity-50' : 'opacity-100'}
                  hover:scale-105 hover:shadow-lg hover:z-10`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Image
        src={weapon.iconUrl}
        alt={weapon.name}
        fill
        className="object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
        <p className="text-xs text-white truncate text-center">{weapon.name}</p>
      </div>
      {weapon.rarity >= 4 && (
        <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs px-1 rounded-bl">★{weapon.rarity}</div>
      )}
      {showRemoveButton && (
        <button 
          onClick={handleRemove}
          className="absolute top-0 left-0 bg-red-500 text-white rounded-br p-0.5 opacity-70 hover:opacity-100"
          title="Tierから削除"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

// 武器Tier行コンポーネントのProps型定義
interface WeaponTierRowProps {
  tier: {
    id: string;
    name: string;
    color: string;
  };
  weaponsInTier: Weapon[];
  onDrop: (weaponId: string, tierId: string) => void;
}

// 武器Tier行コンポーネント - メモ化してパフォーマンスを向上
const WeaponTierRow = React.memo(({ tier, weaponsInTier, onDrop }: WeaponTierRowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.WEAPON,
    drop: (item: DragItem) => onDrop(item.id, tier.id),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  
  // ref と drop を接続
  drop(ref);

  return (
    <div 
      ref={ref} 
      className={`flex items-center mb-2 border-2 ${isOver ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700'} rounded-lg overflow-hidden transition-colors`}
    >
      <div className={`${tier.color} text-white font-bold w-24 py-3 px-4 flex items-center justify-center`}>
        {tier.name}
      </div>
      <div className="flex-1 min-h-24 p-2 flex flex-wrap gap-2">
        {weaponsInTier.map(weapon => (
          <WeaponCard 
            key={weapon.id} 
            weapon={weapon} 
            onDrop={onDrop} 
            currentTier={tier.id} 
          />
        ))}
        {weaponsInTier.length === 0 && (
          <div className="w-full h-20 flex items-center justify-center text-gray-400 dark:text-gray-500 italic">
            ここに武器をドラッグ
          </div>
        )}
      </div>
    </div>
  );
});

// displayNameを追加
WeaponTierRow.displayName = 'WeaponTierRow';

// Tier行コンポーネント - メモ化してパフォーマンスを向上
const TierRow = React.memo(({ tier, charactersInTier, onDrop }: TierRowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CHARACTER,
    drop: (item: DragItem) => onDrop(item.id, tier.id),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  
  console.log(`TierRow ${tier.id} rendering with ${charactersInTier.length} characters`);
  
  // ref と drop を接続
  drop(ref);

  return (
    <div 
      ref={ref} 
      className={`flex items-center mb-2 border-2 ${isOver ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700'} rounded-lg overflow-hidden transition-colors`}
    >
      <div className={`${tier.color} text-white font-bold w-24 py-3 px-4 flex items-center justify-center`}>
        {tier.name}
      </div>
      <div className="flex-1 min-h-24 p-2 flex flex-wrap gap-2">
        {charactersInTier.map(char => (
          <CharacterCard 
            key={char.id} 
            character={char} 
            onDrop={onDrop} 
            currentTier={tier.id} 
          />
        ))}
        {charactersInTier.length === 0 && (
          <div className="w-full h-20 flex items-center justify-center text-gray-400 dark:text-gray-500 italic">
            ここにキャラクターをドラッグ
          </div>
        )}
      </div>
    </div>
  );
});

// displayNameを追加
TierRow.displayName = 'TierRow';

// メインTiermakerページコンポーネント
export default function TierMakerPage() {
  // キャラクターTiermaker用の状態
  const [selectedTemplate, setSelectedTemplate] = useState<TierTemplate>(templates[0]);
  const [characterTiers, setCharacterTiers] = useState<Record<string, string[]>>({
    unassigned: characters.map(char => char.id)
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [elementFilter, setElementFilter] = useState<ElementType | 'all'>('all');
  
  // 武器Tiermaker用の状態
  const [selectedWeaponTemplate, setSelectedWeaponTemplate] = useState<TierTemplate>(weaponTemplates[0]);
  const [weaponTiers, setWeaponTiers] = useState<Record<string, string[]>>({
    'weapon-unassigned': weapons.map(weapon => weapon.id)
  });
  const [weaponSearchQuery, setWeaponSearchQuery] = useState('');
  const [weaponTypeFilter, setWeaponTypeFilter] = useState<WeaponType | 'all'>('all');
  const [customWeaponTemplates, setCustomWeaponTemplates] = useState<TierTemplate[]>([]);
  const [isWeaponEditMode, setIsWeaponEditMode] = useState(false);
  const [customWeaponTemplate, setCustomWeaponTemplate] = useState<TierTemplate | null>(null);
  const [newWeaponTierName, setNewWeaponTierName] = useState('');
  const [newWeaponTierColor, setNewWeaponTierColor] = useState('bg-gray-500');
  
  // 編集モード関連の状態
  const [isEditMode, setIsEditMode] = useState(false);
  const [customTemplate, setCustomTemplate] = useState<TierTemplate | null>(null);
  const [newTierName, setNewTierName] = useState('');
  const [newTierColor, setNewTierColor] = useState('bg-gray-500');
  const [customTemplates, setCustomTemplates] = useState<TierTemplate[]>([]);
  
  // カスタムテンプレートのロード
  useEffect(() => {
    // ローカルストレージからカスタムテンプレートをロード
    const storedTemplates = localStorage.getItem('customTierTemplates');
    if (storedTemplates) {
      try {
        setCustomTemplates(JSON.parse(storedTemplates));
      } catch (error) {
        console.error('カスタムテンプレートの読み込みに失敗しました', error);
      }
    }
  }, []);
  
  // 武器用カスタムテンプレートのロード
  useEffect(() => {
    // ローカルストレージから武器用カスタムテンプレートをロード
    const storedWeaponTemplates = localStorage.getItem('customWeaponTierTemplates');
    if (storedWeaponTemplates) {
      try {
        setCustomWeaponTemplates(JSON.parse(storedWeaponTemplates));
      } catch (error) {
        console.error('武器用カスタムテンプレートの読み込みに失敗しました', error);
      }
    }
  }, []);
  
  // 状態変更をデバッグするための効果
  useEffect(() => {
    console.log('State update - characterTiers:', characterTiers);
  }, [characterTiers]);
  
  // Tierの初期化 - useCallbackでメモ化
  const initializeTiers = React.useCallback(() => {
    const initialTiers: Record<string, string[]> = {};
    
    // 各Tierに空の配列を初期化
    selectedTemplate.tiers.forEach(tier => {
      initialTiers[tier.id] = [];
    });
    
    // 未割り当てキャラクターのTierを追加
    initialTiers['unassigned'] = characters.map(char => char.id);
    
    console.log('Tiers初期化:', initialTiers);
    setCharacterTiers(initialTiers);
  }, [selectedTemplate]);
  
  // テンプレート変更時にキャラクターの配置をリセット
  useEffect(() => {
    initializeTiers();
  }, [initializeTiers]);
  
  // 武器Tierの初期化 - useCallbackでメモ化
  const initializeWeaponTiers = React.useCallback(() => {
    const initialWeaponTiers: Record<string, string[]> = {};
    
    // 各Tierに空の配列を初期化
    selectedWeaponTemplate.tiers.forEach(tier => {
      initialWeaponTiers[tier.id] = [];
    });
    
    // 未割り当て武器のTierを追加
    initialWeaponTiers['weapon-unassigned'] = weapons.map(weapon => weapon.id);
    
    console.log('武器Tiers初期化:', initialWeaponTiers);
    setWeaponTiers(initialWeaponTiers);
  }, [selectedWeaponTemplate]);
  
  // 武器テンプレート変更時に武器の配置をリセット
  useEffect(() => {
    initializeWeaponTiers();
  }, [initializeWeaponTiers]);
  
  // カスタムテンプレートの初期化
  useEffect(() => {
    if (isEditMode && !customTemplate) {
      // 選択されたテンプレートのディープコピーを作成
      setCustomTemplate(JSON.parse(JSON.stringify(selectedTemplate)));
    }
  }, [isEditMode, customTemplate, selectedTemplate]);
  
  // 武器用カスタムテンプレートの初期化
  useEffect(() => {
    if (isWeaponEditMode && !customWeaponTemplate) {
      // 選択された武器テンプレートのディープコピーを作成
      setCustomWeaponTemplate(JSON.parse(JSON.stringify(selectedWeaponTemplate)));
    }
  }, [isWeaponEditMode, customWeaponTemplate, selectedWeaponTemplate]);
  
  // テンプレート名の変更ハンドラ
  const handleTemplateNameChange = (newName: string) => {
    if (!customTemplate) return;
    
    setCustomTemplate({
      ...customTemplate,
      name: newName
    });
  };
  
  // 編集モードの切り替え
  const toggleEditMode = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);
    
    // 編集モードを終了する場合
    if (!newEditMode && customTemplate) {
      // 変更を適用
      setSelectedTemplate(customTemplate);
      setCustomTemplate(null);
    }
  };
  
  // カスタムテンプレートを保存
  const saveCustomTemplate = () => {
    if (!customTemplate) return;
    
    // ユニークなIDを生成
    const templateToSave = {
      ...customTemplate,
      id: `custom-${Date.now()}`
    };
    
    // 既存のカスタムテンプレートに追加
    const updatedCustomTemplates = [...customTemplates, templateToSave];
    setCustomTemplates(updatedCustomTemplates);
    
    // ローカルストレージに保存
    localStorage.setItem('customTierTemplates', JSON.stringify(updatedCustomTemplates));
    
    // 通知
    alert('テンプレートを保存しました！');
  };
  
  // カスタムテンプレートを削除
  const deleteCustomTemplate = (templateId: string) => {
    // カスタムテンプレートのみを削除可能
    if (!templateId.startsWith('custom-')) return;
    
    const updatedTemplates = customTemplates.filter(t => t.id !== templateId);
    setCustomTemplates(updatedTemplates);
    
    // ローカルストレージに更新を保存
    localStorage.setItem('customTierTemplates', JSON.stringify(updatedTemplates));
    
    // 削除したテンプレートが現在選択されている場合、デフォルトのテンプレートに切り替え
    if (selectedTemplate.id === templateId) {
      setSelectedTemplate(templates[0]);
    }
  };
  
  // ティア名の変更ハンドラ
  const handleTierNameChange = (index: number, newName: string) => {
    if (!customTemplate) return;
    
    const updatedTiers = [...customTemplate.tiers];
    updatedTiers[index] = { ...updatedTiers[index], name: newName };
    
    setCustomTemplate({
      ...customTemplate,
      tiers: updatedTiers
    });
  };
  
  // ティア順序の変更（上に移動）
  const moveTierUp = (index: number) => {
    if (!customTemplate || index === 0) return;
    
    const updatedTiers = [...customTemplate.tiers];
    const temp = updatedTiers[index];
    updatedTiers[index] = updatedTiers[index - 1];
    updatedTiers[index - 1] = temp;
    
    setCustomTemplate({
      ...customTemplate,
      tiers: updatedTiers
    });
  };
  
  // ティア順序の変更（下に移動）
  const moveTierDown = (index: number) => {
    if (!customTemplate || index === customTemplate.tiers.length - 1) return;
    
    const updatedTiers = [...customTemplate.tiers];
    const temp = updatedTiers[index];
    updatedTiers[index] = updatedTiers[index + 1];
    updatedTiers[index + 1] = temp;
    
    setCustomTemplate({
      ...customTemplate,
      tiers: updatedTiers
    });
  };
  
  // ティア色の変更ハンドラ
  const handleTierColorChange = (index: number, newColor: string) => {
    if (!customTemplate) return;
    
    const updatedTiers = [...customTemplate.tiers];
    updatedTiers[index] = { ...updatedTiers[index], color: newColor };
    
    setCustomTemplate({
      ...customTemplate,
      tiers: updatedTiers
    });
  };
  
  // 新しいティアの追加
  const addNewTier = () => {
    if (!customTemplate || !newTierName) return;
    
    // ユニークなIDを生成
    const newId = `tier-${Date.now()}`;
    
    const updatedTiers = [
      ...customTemplate.tiers,
      {
        id: newId,
        name: newTierName,
        color: newTierColor
      }
    ];
    
    setCustomTemplate({
      ...customTemplate,
      tiers: updatedTiers
    });
    
    // フォームをリセット
    setNewTierName('');
  };
  
  // ティアの削除
  const removeTier = (index: number) => {
    if (!customTemplate) return;
    
    // 削除するティアのIDを取得
    const tierIdToRemove = customTemplate.tiers[index].id;
    
    // このティアに属しているキャラクターを「未割り当て」に移動
    setCharacterTiers(prev => {
      const newState = { ...prev };
      
      // 削除するティアのキャラクターを取得
      const charactersToMove = newState[tierIdToRemove] || [];
      
      // 未割り当てリストに追加
      if (charactersToMove.length > 0) {
        newState['unassigned'] = [
          ...(newState['unassigned'] || []),
          ...charactersToMove
        ];
      }
      
      // 削除するティアを削除
      delete newState[tierIdToRemove];
      
      return newState;
    });
    
    // ティアリストから削除
    const updatedTiers = customTemplate.tiers.filter((_, i) => i !== index);
    
    setCustomTemplate({
      ...customTemplate,
      tiers: updatedTiers
    });
  };
  
  // 利用可能な背景色のリスト
  const availableColors = [
    { value: 'bg-red-600', label: '赤' },
    { value: 'bg-orange-500', label: 'オレンジ' },
    { value: 'bg-yellow-500', label: '黄色' },
    { value: 'bg-green-500', label: '緑' },
    { value: 'bg-blue-500', label: '青' },
    { value: 'bg-indigo-500', label: '藍' },
    { value: 'bg-purple-500', label: '紫' },
    { value: 'bg-pink-500', label: 'ピンク' },
    { value: 'bg-gray-500', label: 'グレー' }
  ];
  
  // 利用可能なテンプレート（デフォルト + カスタム）
  const allTemplates = [...templates, ...customTemplates];
  
  // ドロップハンドラー
  const handleDrop = (characterId: string, targetTierId: string) => {
    console.log(`DROP: キャラクター ${characterId} を ${targetTierId} に移動します`);
    
    setCharacterTiers(prev => {
      // すべてのtierからこのキャラクターを削除した新しいオブジェクトを作成
      const newState: Record<string, string[]> = {};
      
      // すべてのtierを処理してキャラクターを除外
      let foundInTier = '';
      Object.entries(prev).forEach(([tierId, charIds]) => {
        // このtierにキャラクターがあるか確認
        if (charIds.includes(characterId)) {
          foundInTier = tierId;
          // このキャラクター以外のものだけ保持
          newState[tierId] = charIds.filter(id => id !== characterId);
        } else {
          // 変更なしで維持
          newState[tierId] = [...charIds];
        }
      });
      
      console.log(`キャラクターは元々 ${foundInTier || 'どこにも見つからない'} にありました`);
      
      // 同じtierに移動する場合は早期リターン
      if (foundInTier === targetTierId) {
        console.log('同じTierへの移動なので、状態は変更しません');
        return prev;
      }
      
      // ターゲットtierが存在することを確認
      if (!newState[targetTierId]) {
        newState[targetTierId] = [];
      }
      
      // ターゲットtierに追加
      newState[targetTierId] = [...newState[targetTierId], characterId];
      
      console.log('新しい状態:', newState);
      return newState;
    });
  };
  
  // 特定のTierに割り当てられたキャラクターを取得
  const getCharactersInTier = (tierId: string): Character[] => {
    // 存在チェックと防御的コーディング
    if (!characterTiers || !characterTiers[tierId]) {
      console.log(`Tier ${tierId} が存在しないか空です`);
      return [];
    }
    
    console.log(`getCharactersInTier(${tierId})の呼び出し:`, characterTiers[tierId]);
    
    const result = characterTiers[tierId]
      .map(id => {
        const char = characters.find(c => c.id === id);
        if (!char) {
          console.warn(`ID ${id} に一致するキャラクターが見つかりません`);
        }
        return char;
      })
      .filter((char): char is Character => char !== undefined);
    
    console.log(`getCharactersInTier(${tierId})の結果: ${result.length} キャラクター`);
    return result;
  };
  
  // キャラクター検索フィルター
  const filteredCharacters = characters.filter(char => {
    const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesElement = elementFilter === 'all' || char.element === elementFilter;
    return matchesSearch && matchesElement;
  });
  
  // 未割り当てのキャラクターを取得
  const getUnassignedCharacters = (): Character[] => {
    // characterTiers['unassigned']が存在するか確認
    if (!characterTiers || !characterTiers['unassigned']) {
      console.log('未割り当てTierが存在しません');
      return [];
    }
    
    console.log('getUnassignedCharacters() - unassignedリスト:', characterTiers['unassigned']);
    console.log('getUnassignedCharacters() - フィルター前のキャラ数:', filteredCharacters.length);
    
    const result = filteredCharacters.filter(char => 
      characterTiers['unassigned'].includes(char.id)
    );
    
    console.log('getUnassignedCharacters() - フィルター後のキャラ数:', result.length);
    return result;
  };
  
  // 武器テンプレート名の変更ハンドラ
  const handleWeaponTemplateNameChange = (newName: string) => {
    if (!customWeaponTemplate) return;
    
    setCustomWeaponTemplate({
      ...customWeaponTemplate,
      name: newName
    });
  };
  
  // 武器編集モードの切り替え
  const toggleWeaponEditMode = () => {
    const newEditMode = !isWeaponEditMode;
    setIsWeaponEditMode(newEditMode);
    
    // 編集モードを終了する場合
    if (!newEditMode && customWeaponTemplate) {
      // 変更を適用
      setSelectedWeaponTemplate(customWeaponTemplate);
      setCustomWeaponTemplate(null);
    }
  };
  
  // 武器カスタムテンプレートを保存
  const saveWeaponCustomTemplate = () => {
    if (!customWeaponTemplate) return;
    
    // ユニークなIDを生成
    const templateToSave = {
      ...customWeaponTemplate,
      id: `weapon-custom-${Date.now()}`
    };
    
    // 既存のカスタムテンプレートに追加
    const updatedCustomTemplates = [...customWeaponTemplates, templateToSave];
    setCustomWeaponTemplates(updatedCustomTemplates);
    
    // ローカルストレージに保存
    localStorage.setItem('customWeaponTierTemplates', JSON.stringify(updatedCustomTemplates));
    
    // 通知
    alert('武器テンプレートを保存しました！');
  };
  
  // 武器カスタムテンプレートを削除
  const deleteWeaponCustomTemplate = (templateId: string) => {
    // カスタムテンプレートのみを削除可能
    if (!templateId.startsWith('weapon-custom-')) return;
    
    const updatedTemplates = customWeaponTemplates.filter(t => t.id !== templateId);
    setCustomWeaponTemplates(updatedTemplates);
    
    // ローカルストレージに更新を保存
    localStorage.setItem('customWeaponTierTemplates', JSON.stringify(updatedTemplates));
    
    // 削除したテンプレートが現在選択されている場合、デフォルトのテンプレートに切り替え
    if (selectedWeaponTemplate.id === templateId) {
      setSelectedWeaponTemplate(weaponTemplates[0]);
    }
  };
  
  // 武器ティア名の変更ハンドラ
  const handleWeaponTierNameChange = (index: number, newName: string) => {
    if (!customWeaponTemplate) return;
    
    const updatedTiers = [...customWeaponTemplate.tiers];
    updatedTiers[index] = { ...updatedTiers[index], name: newName };
    
    setCustomWeaponTemplate({
      ...customWeaponTemplate,
      tiers: updatedTiers
    });
  };
  
  // 武器ティア色の変更ハンドラ
  const handleWeaponTierColorChange = (index: number, newColor: string) => {
    if (!customWeaponTemplate) return;
    
    const updatedTiers = [...customWeaponTemplate.tiers];
    updatedTiers[index] = { ...updatedTiers[index], color: newColor };
    
    setCustomWeaponTemplate({
      ...customWeaponTemplate,
      tiers: updatedTiers
    });
  };
  
  // 武器ティア順序の変更（上に移動）
  const moveWeaponTierUp = (index: number) => {
    if (!customWeaponTemplate || index === 0) return;
    
    const updatedTiers = [...customWeaponTemplate.tiers];
    const temp = updatedTiers[index];
    updatedTiers[index] = updatedTiers[index - 1];
    updatedTiers[index - 1] = temp;
    
    setCustomWeaponTemplate({
      ...customWeaponTemplate,
      tiers: updatedTiers
    });
  };
  
  // 武器ティア順序の変更（下に移動）
  const moveWeaponTierDown = (index: number) => {
    if (!customWeaponTemplate || index === customWeaponTemplate.tiers.length - 1) return;
    
    const updatedTiers = [...customWeaponTemplate.tiers];
    const temp = updatedTiers[index];
    updatedTiers[index] = updatedTiers[index + 1];
    updatedTiers[index + 1] = temp;
    
    setCustomWeaponTemplate({
      ...customWeaponTemplate,
      tiers: updatedTiers
    });
  };
  
  // 武器ティアの削除
  const removeWeaponTier = (index: number) => {
    if (!customWeaponTemplate) return;
    
    // 削除するティアのIDを取得
    const tierIdToRemove = customWeaponTemplate.tiers[index].id;
    
    // このティアに属している武器を「未割り当て」に移動
    setWeaponTiers(prev => {
      const newState = { ...prev };
      
      // 削除するティアの武器を取得
      const weaponsToMove = newState[tierIdToRemove] || [];
      
      // 未割り当てリストに追加
      if (weaponsToMove.length > 0) {
        newState['weapon-unassigned'] = [
          ...(newState['weapon-unassigned'] || []),
          ...weaponsToMove
        ];
      }
      
      // 削除するティアを削除
      delete newState[tierIdToRemove];
      
      return newState;
    });
    
    // ティアリストから削除
    const updatedTiers = customWeaponTemplate.tiers.filter((_, i) => i !== index);
    
    setCustomWeaponTemplate({
      ...customWeaponTemplate,
      tiers: updatedTiers
    });
  };
  
  // 新しい武器ティアの追加
  const addNewWeaponTier = () => {
    if (!customWeaponTemplate || !newWeaponTierName) return;
    
    // ユニークなIDを生成
    const newId = `weapon-tier-${Date.now()}`;
    
    const updatedTiers = [
      ...customWeaponTemplate.tiers,
      {
        id: newId,
        name: newWeaponTierName,
        color: newWeaponTierColor
      }
    ];
    
    setCustomWeaponTemplate({
      ...customWeaponTemplate,
      tiers: updatedTiers
    });
    
    // フォームをリセット
    setNewWeaponTierName('');
  };
  
  // 武器ドロップハンドラー
  const handleWeaponDrop = (weaponId: string, targetTierId: string) => {
    console.log(`DROP: 武器 ${weaponId} を ${targetTierId} に移動します`);
    
    setWeaponTiers(prev => {
      // すべてのtierからこの武器を削除した新しいオブジェクトを作成
      const newState: Record<string, string[]> = {};
      
      // すべてのtierを処理して武器を除外
      let foundInTier = '';
      Object.entries(prev).forEach(([tierId, weaponIds]) => {
        // このtierに武器があるか確認
        if (weaponIds.includes(weaponId)) {
          foundInTier = tierId;
          // この武器以外のものだけ保持
          newState[tierId] = weaponIds.filter(id => id !== weaponId);
        } else {
          // 変更なしで維持
          newState[tierId] = [...weaponIds];
        }
      });
      
      console.log(`武器は元々 ${foundInTier || 'どこにも見つからない'} にありました`);
      
      // 同じtierに移動する場合は早期リターン
      if (foundInTier === targetTierId) {
        console.log('同じTierへの移動なので、状態は変更しません');
        return prev;
      }
      
      // ターゲットtierが存在することを確認
      if (!newState[targetTierId]) {
        newState[targetTierId] = [];
      }
      
      // ターゲットtierに追加
      newState[targetTierId] = [...newState[targetTierId], weaponId];
      
      console.log('新しい武器Tier状態:', newState);
      return newState;
    });
  };
  
  // 特定のTierに割り当てられた武器を取得
  const getWeaponsInTier = (tierId: string): Weapon[] => {
    // 存在チェックと防御的コーディング
    if (!weaponTiers || !weaponTiers[tierId]) {
      console.log(`武器Tier ${tierId} が存在しないか空です`);
      return [];
    }
    
    const result = weaponTiers[tierId]
      .map(id => {
        const weapon = weapons.find(w => w.id === id);
        if (!weapon) {
          console.warn(`ID ${id} に一致する武器が見つかりません`);
        }
        return weapon;
      })
      .filter((weapon): weapon is Weapon => weapon !== undefined);
    
    return result;
  };
  
  // 武器検索フィルター
  const filteredWeapons = weapons.filter(weapon => {
    const matchesSearch = weapon.name.toLowerCase().includes(weaponSearchQuery.toLowerCase());
    const matchesType = weaponTypeFilter === 'all' || weapon.type === weaponTypeFilter;
    return matchesSearch && matchesType;
  });
  
  // 未割り当ての武器を取得
  const getUnassignedWeapons = (): Weapon[] => {
    // weaponTiers['weapon-unassigned']が存在するか確認
    if (!weaponTiers || !weaponTiers['weapon-unassigned']) {
      console.log('未割り当て武器Tierが存在しません');
      return [];
    }
    
    const result = filteredWeapons.filter(weapon => 
      weaponTiers['weapon-unassigned'].includes(weapon.id)
    );
    
    return result;
  };
  
  return (
    <DndProvider backend={HTML5Backend} debugMode={true}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <CustomDragLayer characters={characters} weapons={weapons} />
      </div>
      <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        {/* 背景装飾パターン */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <svg className="absolute w-full h-full">
            <defs>
              <pattern id="tiermaker-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M30,10 L50,30 L30,50 L10,30 Z" fill="#00CCFF" fillOpacity="0.3" />
                <circle cx="80" cy="20" r="15" fill="#FF9900" fillOpacity="0.2" />
                <path d="M70,60 L90,60 L80,80 Z" fill="#FF00CC" fillOpacity="0.3" />
                <rect x="10" y="70" width="20" height="20" fill="#33FF33" fillOpacity="0.2" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#tiermaker-pattern)" />
          </svg>
          
          {/* 装飾円 */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-amber-500/20 to-pink-500/20 rounded-full blur-3xl -z-10"></div>
        </div>
        
        {/* タイトルと説明 */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            {/* 原神ロゴ */}
            <svg className="w-10 h-10 mr-2" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50,5 L95,50 L50,95 L5,50 Z" fill="url(#logo-gradient)" />
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFB6C1" />
                  <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
              </defs>
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">【Tierメーカー】</h1>
          </div>
          <p className="text-md text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            あなただけの原神キャラクターTierリストを作ろう！キャラクターをドラッグ＆ドロップして、お好みのカテゴリに振り分けてください。
          </p>
        </div>
        
        {/* テンプレート選択とカスタマイズモード切り替え */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2 sm:mb-0">テンプレート選択</label>
            <button
              onClick={toggleEditMode}
              className={`px-4 py-2 rounded-lg text-white ${
                isEditMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {isEditMode ? '編集を適用' : 'ティアをカスタマイズ'}
            </button>
          </div>
          
          {!isEditMode && (
            <div className="flex flex-wrap gap-3">
              {allTemplates.map(template => (
                <div key={template.id} className="relative group">
                  <button
                    className={`px-4 py-2 rounded-lg ${selectedTemplate.id === template.id ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'} hover:bg-amber-400 dark:hover:bg-amber-600 transition-colors`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    {template.name}
                  </button>
                  
                  {/* カスタムテンプレートの削除ボタン */}
                  {template.id.startsWith('custom-') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`「${template.name}」テンプレートを削除してもよろしいですか？`)) {
                          deleteCustomTemplate(template.id);
                        }
                      }}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="テンプレートを削除"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 編集モード時のティア管理UI */}
        {isEditMode && customTemplate && (
          <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">ティアをカスタマイズ</h2>
              
              <button
                onClick={saveCustomTemplate}
                className="mt-2 sm:mt-0 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center"
              >
                <span className="mr-1">新規テンプレートとして保存</span>
              </button>
            </div>
            
            {/* テンプレート名の編集 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">テンプレート名</label>
              <input
                type="text"
                value={customTemplate.name}
                onChange={(e) => handleTemplateNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                placeholder="テンプレート名"
              />
            </div>
            
            {/* 既存ティアの編集 */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">既存のティア</h3>
              <div className="space-y-2">
                {customTemplate.tiers.map((tier, index) => (
                  <div key={tier.id} className="flex flex-wrap gap-2 items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className={`${tier.color} w-8 h-8 rounded-md flex-shrink-0`}></div>
                    <input
                      type="text"
                      value={tier.name}
                      onChange={(e) => handleTierNameChange(index, e.target.value)}
                      className="flex-grow px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                      placeholder="ティア名"
                    />
                    <select
                      value={tier.color}
                      onChange={(e) => handleTierColorChange(index, e.target.value)}
                      className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                    >
                      {availableColors.map(color => (
                        <option key={color.value} value={color.value}>{color.label}</option>
                      ))}
                    </select>
                    
                    {/* ティア順序の変更ボタン */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveTierUp(index)}
                        disabled={index === 0}
                        className={`p-1 rounded ${index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                        title="上に移動"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveTierDown(index)}
                        disabled={index === customTemplate.tiers.length - 1}
                        className={`p-1 rounded ${index === customTemplate.tiers.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                        title="下に移動"
                      >
                        ↓
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeTier(index)}
                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-lg"
                      title="削除"
                    >
                      <span className="text-sm">削除</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 新規ティアの追加 */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">新しいティアを追加</h3>
              <div className="flex flex-wrap gap-2 items-center">
                <div className={`${newTierColor} w-8 h-8 rounded-md flex-shrink-0`}></div>
                <input
                  type="text"
                  value={newTierName}
                  onChange={(e) => setNewTierName(e.target.value)}
                  className="flex-grow px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                  placeholder="新しいティア名"
                />
                <select
                  value={newTierColor}
                  onChange={(e) => setNewTierColor(e.target.value)}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                >
                  {availableColors.map(color => (
                    <option key={color.value} value={color.value}>{color.label}</option>
                  ))}
                </select>
                <button
                  onClick={addNewTier}
                  disabled={!newTierName.trim()}
                  className={`px-4 py-1 rounded-lg text-white ${
                    newTierName.trim() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  追加
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* フィルターと検索 */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">属性フィルター</label>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1 rounded ${elementFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                onClick={() => setElementFilter('all')}
              >
                全て
              </button>
              {(['pyro', 'hydro', 'anemo', 'electro', 'dendro', 'cryo', 'geo'] as ElementType[]).map(element => (
                <button 
                  key={element}
                  className={`px-3 py-1 rounded ${elementFilter === element ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                  onClick={() => setElementFilter(element)}
                >
                  {element}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">検索</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="キャラクター名を検索..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            />
          </div>
        </div>
        
        {/* Tierリスト */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{isEditMode && customTemplate ? customTemplate.name : selectedTemplate.name}</h2>
          {(isEditMode && customTemplate ? customTemplate.tiers : selectedTemplate.tiers).map(tier => (
            <TierRow 
              key={tier.id}
              tier={tier}
              charactersInTier={getCharactersInTier(tier.id)}
              onDrop={handleDrop}
            />
          ))}
        </div>
        
        {/* 未割り当てキャラクター */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">利用可能なキャラクター</h2>
          <div 
            className="min-h-40 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-wrap gap-3"
            style={{ justifyContent: getUnassignedCharacters().length > 0 ? 'flex-start' : 'center' }}
          >
            {getUnassignedCharacters().length > 0 ? (
              getUnassignedCharacters().map(char => (
                <CharacterCard 
                  key={char.id}
                  character={char}
                  onDrop={handleDrop}
                  currentTier="unassigned"
                />
              ))
            ) : (
              <div className="w-full text-center text-gray-500 dark:text-gray-400 py-8">
                すべてのキャラクターが配置されました！
              </div>
            )}
          </div>
        </div>
        
        {/* 武器Tiermaker */}
        <div className="mt-12 pt-12 border-t-2 border-amber-200 dark:border-amber-800">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">【武器Tierメーカー】</h1>
            <p className="text-md text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              原神の武器をTierリストで整理しよう！武器をドラッグ＆ドロップして、性能や好みに応じて分類できます。
            </p>
          </div>
          
          {/* 武器テンプレート選択とカスタマイズモード切り替え */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2 sm:mb-0">武器テンプレート選択</label>
              <button
                onClick={toggleWeaponEditMode}
                className={`px-4 py-2 rounded-lg text-white ${
                  isWeaponEditMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {isWeaponEditMode ? '編集を適用' : 'ティアをカスタマイズ'}
              </button>
            </div>
            
            {!isWeaponEditMode && (
              <div className="flex flex-wrap gap-3">
                {[...weaponTemplates, ...customWeaponTemplates].map(template => (
                  <div key={template.id} className="relative group">
                    <button
                      className={`px-4 py-2 rounded-lg ${selectedWeaponTemplate.id === template.id ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'} hover:bg-amber-400 dark:hover:bg-amber-600 transition-colors`}
                      onClick={() => setSelectedWeaponTemplate(template)}
                    >
                      {template.name}
                    </button>
                    
                    {/* カスタムテンプレートの削除ボタン */}
                    {template.id.startsWith('weapon-custom-') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`「${template.name}」テンプレートを削除してもよろしいですか？`)) {
                            deleteWeaponCustomTemplate(template.id);
                          }
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="テンプレートを削除"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 武器編集モード時のティア管理UI */}
          {isWeaponEditMode && customWeaponTemplate && (
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">武器ティアをカスタマイズ</h2>
                
                <button
                  onClick={saveWeaponCustomTemplate}
                  className="mt-2 sm:mt-0 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <span className="mr-1">新規テンプレートとして保存</span>
                </button>
              </div>
              
              {/* テンプレート名の編集 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">テンプレート名</label>
                <input
                  type="text"
                  value={customWeaponTemplate.name}
                  onChange={(e) => handleWeaponTemplateNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                  placeholder="テンプレート名"
                />
              </div>
              
              {/* 既存ティアの編集 */}
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">既存の武器ティア</h3>
                <div className="space-y-2">
                  {customWeaponTemplate.tiers.map((tier, index) => (
                    <div key={tier.id} className="flex flex-wrap gap-2 items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className={`${tier.color} w-8 h-8 rounded-md flex-shrink-0`}></div>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => handleWeaponTierNameChange(index, e.target.value)}
                        className="flex-grow px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                        placeholder="ティア名"
                      />
                      <select
                        value={tier.color}
                        onChange={(e) => handleWeaponTierColorChange(index, e.target.value)}
                        className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                      >
                        {availableColors.map(color => (
                          <option key={color.value} value={color.value}>{color.label}</option>
                        ))}
                      </select>
                      
                      {/* ティア順序の変更ボタン */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveWeaponTierUp(index)}
                          disabled={index === 0}
                          className={`p-1 rounded ${index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                          title="上に移動"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveWeaponTierDown(index)}
                          disabled={index === customWeaponTemplate.tiers.length - 1}
                          className={`p-1 rounded ${index === customWeaponTemplate.tiers.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                          title="下に移動"
                        >
                          ↓
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeWeaponTier(index)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-lg"
                        title="削除"
                      >
                        <span className="text-sm">削除</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 新規ティアの追加 */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">新しい武器ティアを追加</h3>
                <div className="flex flex-wrap gap-2 items-center">
                  <div className={`${newWeaponTierColor} w-8 h-8 rounded-md flex-shrink-0`}></div>
                  <input
                    type="text"
                    value={newWeaponTierName}
                    onChange={(e) => setNewWeaponTierName(e.target.value)}
                    className="flex-grow px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                    placeholder="新しいティア名"
                  />
                  <select
                    value={newWeaponTierColor}
                    onChange={(e) => setNewWeaponTierColor(e.target.value)}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                  >
                    {availableColors.map(color => (
                      <option key={color.value} value={color.value}>{color.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={addNewWeaponTier}
                    disabled={!newWeaponTierName.trim()}
                    className={`px-4 py-1 rounded-lg text-white ${
                      newWeaponTierName.trim() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    追加
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* 武器フィルターと検索 */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">武器タイプフィルター</label>
              <div className="flex flex-wrap gap-2">
                <button 
                  className={`px-3 py-1 rounded ${weaponTypeFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                  onClick={() => setWeaponTypeFilter('all')}
                >
                  全て
                </button>
                {(['sword', 'claymore', 'polearm', 'bow', 'catalyst'] as WeaponType[]).map(type => (
                  <button 
                    key={type}
                    className={`px-3 py-1 rounded ${weaponTypeFilter === type ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    onClick={() => setWeaponTypeFilter(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">武器検索</label>
              <input
                type="text"
                value={weaponSearchQuery}
                onChange={(e) => setWeaponSearchQuery(e.target.value)}
                placeholder="武器名を検索..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              />
            </div>
          </div>
          
          {/* 武器Tierリスト */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{isWeaponEditMode && customWeaponTemplate ? customWeaponTemplate.name : selectedWeaponTemplate.name}</h2>
            {(isWeaponEditMode && customWeaponTemplate ? customWeaponTemplate.tiers : selectedWeaponTemplate.tiers).map(tier => (
              <WeaponTierRow 
                key={tier.id}
                tier={tier}
                weaponsInTier={getWeaponsInTier(tier.id)}
                onDrop={handleWeaponDrop}
              />
            ))}
          </div>
          
          {/* 未割り当て武器 */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">利用可能な武器</h2>
            <div 
              className="min-h-40 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-wrap gap-3"
              style={{ justifyContent: getUnassignedWeapons().length > 0 ? 'flex-start' : 'center' }}
            >
              {getUnassignedWeapons().length > 0 ? (
                getUnassignedWeapons().map(weapon => (
                  <WeaponCard 
                    key={weapon.id}
                    weapon={weapon}
                    onDrop={handleWeaponDrop}
                    currentTier="weapon-unassigned"
                  />
                ))
              ) : (
                <div className="w-full text-center text-gray-500 dark:text-gray-400 py-8">
                  すべての武器が配置されました！
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
} 
