'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

// 外部データのインポート
import { characters as sourceCharacters } from '@/utils/characters';
import { weapons as sourceWeapons } from '@/data/weapons';

// react-dnd用のマルチバックエンド設定
const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: TouchTransition,
      preview: true
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: {
        enableMouseEvents: true,
        delayTouchStart: 0,
        enableKeyboardEvents: true,
        touchSlop: 1,
        ignoreContextMenu: true,
        enableTouchEvents: true,
        delay: 0
      },
      preview: true
    }
  ]
};

// Tiermaker用に必要な情報だけを取り出したキャラクターリスト
const tierMakerCharacters: Character[] = sourceCharacters.map(character => ({
  id: character.id,
  name: character.name,
  element: character.element,
  weapon: character.weapon,
  rarity: character.rarity,
  iconUrl: character.iconUrl,
  role: character.role
}));

// Tiermaker用に必要な情報だけを取り出した武器リスト
const tierMakerWeapons: Weapon[] = sourceWeapons.map(weapon => ({
  id: weapon.id,
  name: weapon.name,
  type: weapon.type,
  rarity: weapon.rarity,
  iconUrl: weapon.imageUrl.replace('.png', '-icon.png'), // 武器アイコンのパス生成
  imageUrl: weapon.imageUrl
}));

// テンプレート型の定義
interface TierTemplate {
  id: string;
  name: string;
  tiers: {
    id: string;
    name: string;
    color: string;
  }[];
  defaultColumnCount?: number; // デフォルト列数
  defaultColumnLabels?: string[]; // デフォルト列ラベル
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
      { id: 'e', name: 'E', color: 'bg-purple-500' },
    ],
    defaultColumnCount: 2,
    defaultColumnLabels: ['アタッカー', 'サポーター']
  },
  {
    id: 'favorite',
    name: '推しキャラTier',
    tiers: [
      { id: 'love', name: '推し', color: 'bg-pink-500' },
      { id: 'like', name: '好き', color: 'bg-purple-500' },
      { id: 'ok', name: '普通', color: 'bg-blue-500' },
      { id: 'dislike', name: '嫌い', color: 'bg-gray-500' },
    ],
    defaultColumnCount: 2,
    defaultColumnLabels: ['男キャラ', '女キャラ']
  },
  {
    id: 'wanted',
    name: '引きたいキャラTier',
    tiers: [
      { id: 'must', name: '必須', color: 'bg-red-600' },
      { id: 'want', name: '欲しい', color: 'bg-orange-500' },
      { id: 'maybe', name: '検討中', color: 'bg-yellow-500' },
      { id: 'skip', name: 'スキップ', color: 'bg-gray-500' },
    ],
    defaultColumnCount: 2,
    defaultColumnLabels: ['性能が魅力的', 'キャラが魅力的']
  },
  {
    id: 'should-pull',
    name: '引くべきキャラティア',
    tiers: [
      { id: 'must-pull', name: '必引き', color: 'bg-red-600' },
      { id: 'good-to-have', name: '推奨', color: 'bg-orange-500' },
      { id: 'situational', name: '状況次第', color: 'bg-yellow-500' },
      { id: 'optional', name: 'お好みで', color: 'bg-green-500' },
      { id: 'skip', name: 'スキップ推奨', color: 'bg-gray-500' },
    ],
    defaultColumnCount: 3,
    defaultColumnLabels: ['性能厨（メタ編成特化）', 'オフメタ編成も極めたい', 'キャラ愛厨']
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
      { id: 'weapon-e', name: 'E', color: 'bg-purple-500' },
    ],
    defaultColumnCount: 2,
    defaultColumnLabels: ['DPS武器', 'サポート武器']
  },
  {
    id: 'weapon-favorite',
    name: '推し武器Tier',
    tiers: [
      { id: 'weapon-love', name: '推し', color: 'bg-pink-500' },
      { id: 'weapon-like', name: '好き', color: 'bg-purple-500' },
      { id: 'weapon-ok', name: '普通', color: 'bg-blue-500' },
      { id: 'weapon-dislike', name: '嫌い', color: 'bg-gray-500' },
    ],
    defaultColumnCount: 2,
    defaultColumnLabels: ['見た目重視', '性能重視']
  },
  {
    id: 'weapon-wanted',
    name: '欲しい武器Tier',
    tiers: [
      { id: 'weapon-must', name: '必須', color: 'bg-red-600' },
      { id: 'weapon-want', name: '欲しい', color: 'bg-orange-500' },
      { id: 'weapon-maybe', name: '検討中', color: 'bg-yellow-500' },
      { id: 'weapon-skip', name: 'スキップ', color: 'bg-gray-500' },
    ],
    defaultColumnCount: 2,
    defaultColumnLabels: ['既存キャラ向け', '将来のキャラ向け']
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
  onDrop: (characterId: string, dropTargetId: string) => void;
  currentTier: string;
  // 直接状態更新するために必要なpropsを追加
  characterTiers?: Record<string, string[]>;
  setCharacterTiers?: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  characterColumnAssignments?: Record<string, number>;
  setCharacterColumnAssignments?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  tierMakerCharacters?: Character[];
  // 凸数表示モード用のプロパティを追加
  showConstellations?: boolean;
  constellation?: number;
  changeConstellation?: (characterId: string, value: number) => void;
}

interface TierRowProps {
  tier: {
    id: string;
    name: string;
    color: string;
  };
  rowIndex?: number; // オプショナルに変更
  charactersInTier: Character[];
  onDrop: (characterId: string, tierId: string) => void;
  // 分割表示のためのプロパティを追加
  isSplitView?: boolean; // 互換性のために残す
  columnCount?: number;
  columnLabels?: string[];
  characterColumnAssignments?: Record<string, number>;
  changeCharacterColumn?: (characterId: string, newColumnIndex: number) => void;
  // 行ラベル（Tier名）編集用のコールバック関数
  onTierNameEdit?: (tierId: string, newName: string) => void;
  // キャラクター複製用のプロパティを追加
  characterTiers?: Record<string, string[]>;
  setCharacterTiers?: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  setCharacterColumnAssignments?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  tierMakerCharacters?: Character[];
  // 凸数表示モード用のプロパティを追加
  showConstellations?: boolean;
  characterConstellations?: Record<string, number>;
  changeConstellation?: (characterId: string, value: number) => void;
}

// Windowオブジェクトの型拡張
declare global {
  interface Window {
    tiermakerState?: {
      isSplitView: boolean;
      columnCount: number;
      columnLabels: string[];
      characterColumnAssignments: Record<string, number>;
    };
    tiermakerChangeCharacterColumn?: (characterId: string, columnIndex: number) => void;
    tiermakerDuplicateCharacter?: (character: Character, newId: string, currentTier: string) => void;
    tiermakerDeleteCharacter?: (characterId: string) => void;
    _tiermakerFunctions?: {
      duplicateCharacter: (character: Character, newId: string, currentTier: string) => Character;
    };
    _tiermakerCharacters?: Character[];
  }
}

// キャラクターカードコンポーネント
const CharacterCard = ({ 
  character, 
  onDrop, 
  currentTier,
  characterTiers,
  setCharacterTiers,
  characterColumnAssignments,
  setCharacterColumnAssignments,
  tierMakerCharacters,
  // 凸数表示モード用のプロパティ
  showConstellations,
  constellation = 0,
  changeConstellation
}: CharacterCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  // 凸数選択UI表示用の状態を追加
  const [showConstellationSelector, setShowConstellationSelector] = useState(false);
  
  const [dragProps, drag] = useDrag({
    type: ItemTypes.CHARACTER,
    item: { id: character.id, type: 'character' } as DragItem,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  
  // isDraggingをsafeに取得
  const isDragging = Boolean(dragProps?.isDragging);
  
  // IDが複製されたものかどうかをチェック
  const isDuplicate = character.id.includes('_copy_');
  
  // 複製処理を実行する関数
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 複製ボタンがクリックされたこと
    console.log(`[DEBUG] 複製ボタンがクリックされました - キャラクター: ${character.name} (${character.id}) ティア: ${currentTier}`);
    
    try {
      if (!characterTiers || !setCharacterTiers || !tierMakerCharacters) {
        // グローバル関数のフォールバックを使用
        if (window._tiermakerFunctions?.duplicateCharacter) {
          const newCharacter = window._tiermakerFunctions.duplicateCharacter(character, `${character.id}_copy_${Date.now()}`, currentTier);
          console.log(`[DEBUG] グローバル関数を使用してキャラクターを複製: ${newCharacter.id}`);
        } else if (window.tiermakerDuplicateCharacter) {
          window.tiermakerDuplicateCharacter(character, `${character.id}_copy_${Date.now()}`, currentTier);
          console.log(`[DEBUG] レガシーグローバル関数を使用してキャラクターを複製`);
        } else {
          console.error('複製関数が見つかりません');
        }
        return;
      }

      // 新しいIDを生成
      const newId = `${character.id}_copy_${Date.now()}`;
      console.log(`[DEBUG] 新ID生成: ${newId}`);

      // 新しいキャラクターを作成
      const newCharacter: Character = {
        ...character,
        id: newId
      };

      // 現在のティアでの位置を検索
      console.log(`[DEBUG] 元キャラクターの位置検索 - ティア: ${currentTier}`);
      const currentTierCharacters = [...(characterTiers[currentTier] || [])];
      const originalIndex = currentTierCharacters.indexOf(character.id);
      console.log(`[DEBUG] 元キャラクター(${character.id})の正確な位置: ${originalIndex}`);

      // 新しいキャラクターを追加（元のキャラクターの隣に）
      if (originalIndex !== -1) {
        // 元のキャラクターが見つかった場合、その隣に新キャラを挿入
        currentTierCharacters.splice(originalIndex + 1, 0, newId);
        
        // 確実に表示順序を維持するために、新しい配列を作成
        const updatedTier = [...currentTierCharacters];
        
        console.log(`${currentTier}内の元キャラクターの位置: ${originalIndex}, 新キャラクターの位置: ${originalIndex + 1}`);
        console.log(`[DEBUG] 更新後の${currentTier}の内容:`, updatedTier);
        
        // 状態を更新
        setCharacterTiers(prev => ({
          ...prev,
          [currentTier]: updatedTier
        }));
      } else {
        // 元のキャラクターが見つからない場合（起きるべきではない）
        console.error(`元のキャラクターが${currentTier}内で見つかりませんでした。末尾に追加します。`);
        setCharacterTiers(prev => ({
          ...prev,
          [currentTier]: [...(prev[currentTier] || []), newId]
        }));
      }

      // 新しいキャラクターをキャラクターリストに追加
      if (setCharacterColumnAssignments && characterColumnAssignments) {
        // 元のキャラクターと同じ列に割り当て
        const column = characterColumnAssignments[character.id] || 0;
        console.log(`[DEBUG] 列割り当て - 新キャラクター: ${newId}, 割り当て列: ${column}`);
        setCharacterColumnAssignments(prev => ({
          ...prev,
          [newId]: column
        }));
      }

      // tierMakerCharactersに複製したキャラクターを追加
      // 重要: 直接push()ではなく新しい配列を作成して参照を更新する
      const newTierMakerCharacters = [...tierMakerCharacters];
      newTierMakerCharacters.push(newCharacter);
      
      // グローバル変数を更新
      window._tiermakerCharacters = newTierMakerCharacters;
      
      // tierMakerCharactersを直接更新 - これは参照を維持します
      for (let i = 0; i < newTierMakerCharacters.length; i++) {
        if (i >= tierMakerCharacters.length) {
          tierMakerCharacters.push(newTierMakerCharacters[i]);
        } else if (i === tierMakerCharacters.length - 1 && 
                  newTierMakerCharacters[i].id === newCharacter.id) {
          tierMakerCharacters[i] = newCharacter;
        }
      }
      
      console.log(`[DEBUG] tierMakerCharactersを更新しました。現在の長さ: ${tierMakerCharacters.length}`);
      console.log(`[DEBUG] 最後の要素ID: ${tierMakerCharacters[tierMakerCharacters.length-1]?.id}`);

    } catch (error) {
      console.error('キャラクター複製中にエラーが発生しました:', error);
    }
  };
  
  // ref と drag を接続
  drag(ref);
  
  // 削除ボタンを表示する条件：
  // 1. 未割り当てエリア以外にあるとき（従来の動作）
  // 2. 複製されたカードである場合（新たに追加）
  const showRemoveButton = currentTier !== 'unassigned' || isDuplicate;
  
  // カードを完全に削除する関数（複製カード用）
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 複製カードの場合は完全に削除
    if (isDuplicate) {
      if (typeof window !== 'undefined' && window.tiermakerDeleteCharacter) {
        window.tiermakerDeleteCharacter(character.id);
      } else {
        // window関数がない場合は通常の未割り当てに戻す動作
        onDrop(character.id, 'unassigned');
      }
    } else {
      // オリジナルカードは通常通り未割り当てに戻す
      onDrop(character.id, 'unassigned');
    }
  };
  
  // 列を変更する機能
  const changeColumn = (columnIndex: number) => {
    if (window.tiermakerChangeCharacterColumn) {
      window.tiermakerChangeCharacterColumn(character.id, columnIndex);
    }
  };
  
  // 凸数クリック時のハンドラ
  const handleConstellationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // プルダウン表示切り替え
    setShowConstellationSelector(!showConstellationSelector);
  };
  
  // 凸数選択時のハンドラ
  const selectConstellation = (value: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (changeConstellation) {
      changeConstellation(character.id, value);
    }
    setShowConstellationSelector(false);
  };
  
  // 凸数セレクター外のクリックを検知して閉じる
  useEffect(() => {
    if (showConstellationSelector) {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setShowConstellationSelector(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showConstellationSelector]);
  
  // 凸数によって色を変える関数
  const getConstellationColorClass = (constValue: number): string => {
    switch(constValue) {
      case 0: return 'bg-gray-500 dark:bg-gray-600';
      case 1: return 'bg-blue-500 dark:bg-blue-600';
      case 2: return 'bg-purple-500 dark:bg-purple-600';
      case 3: return 'bg-indigo-500 dark:bg-indigo-600';
      case 4: return 'bg-pink-500 dark:bg-pink-600';
      case 5: return 'bg-yellow-500 dark:bg-yellow-600';
      case 6: return 'bg-red-500 dark:bg-red-600';
      default: return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  return (
    <div
      ref={ref}
      className={`relative rounded-lg overflow-visible shadow-sm hover:shadow-md transition-shadow cursor-move ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${isDuplicate ? 'ring-2 ring-blue-500 dark:ring-blue-600 shadow-md shadow-blue-300 dark:shadow-blue-900/30' : ''}`}
      style={{ width: '60px', height: '60px' }}
      title={`${character.name}${isDuplicate ? ' (複製)' : ''}`}
    >
      <img
        src={character.iconUrl}
        alt={character.name}
        className="w-full h-full object-cover object-center"
        style={{ imageRendering: 'auto' }}
      />
      
      {/* 凸数表示 */}
      {showConstellations && (
        <button
          onClick={handleConstellationClick}
          className={`absolute top-0 left-0 w-5 h-5 rounded-br-lg ${getConstellationColorClass(constellation || 0)} text-white flex items-center justify-center text-xs font-bold opacity-90 hover:opacity-100 transition-all hover:scale-110 z-10`}
          title={`凸数: ${constellation || 0} (クリックで変更)`}
        >
          {constellation}
        </button>
      )}
      
      {/* 凸数選択UI（プルダウン） */}
      {showConstellations && showConstellationSelector && (
        <div 
          className="absolute top-0 left-0 z-50 w-5"
          style={{ top: '20px' }}
        >
          <div 
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-1 border border-gray-300 dark:border-gray-600 flex flex-col gap-1 w-10"
          >
            {[0, 1, 2, 3, 4, 5, 6].map(value => (
              <button
                key={value}
                onClick={(e) => selectConstellation(value, e)}
                className={`w-full py-1 rounded-md ${getConstellationColorClass(value)} text-white hover:brightness-110 flex items-center justify-center text-xs font-bold ${value === constellation ? 'ring-1 ring-white scale-105' : ''}`}
              >
                {value}凸
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* 残りの既存UIパーツ */}
      {showRemoveButton && (
        <button
          onClick={handleDelete}
          className={`absolute top-0 right-0 w-5 h-5 rounded-bl-lg ${isDuplicate ? 'bg-red-600' : 'bg-red-500'} text-white flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition-all hover:scale-110`}
          title={isDuplicate ? "完全に削除" : "Tierから削除"}
        >
          ×
        </button>
      )}
      
      <button
        onClick={handleDuplicate}
        className="absolute bottom-0 right-0 w-5 h-5 rounded-tl-lg bg-blue-500 text-white flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition-all hover:scale-110"
        title="このキャラクターを複製"
      >
        ⎘
      </button>
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
    item: { id: weapon.id, type: 'weapon' } as DragItem,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
    options: {
      dropEffect: 'move',
      touchStartThreshold: 1 // ほとんど動かさなくてもドラッグ開始
    },
    previewOptions: {
      captureDraggingState: true,
      anchorX: 0.5,
      anchorY: 0.5,
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        console.log('Weapon dropped:', item.id, 'Result:', dropResult);
      }
    },
  }), [weapon.id, onDrop]); // 依存配列を追加
  
  // ref と drag を接続
  drag(ref);

  // 未割り当てエリア以外に配置されている場合のみ削除ボタンを表示
  const showRemoveButton = currentTier !== 'unassigned';

  // 削除ボタンクリック時の処理
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // ドラッグイベントが発火しないよう阻止
    onDrop(weapon.id, 'unassigned');
  };

  return (
    <div
      ref={ref}
      className={`relative w-16 h-24 sm:w-20 sm:h-24 rounded-lg overflow-hidden 
                  border-2 border-amber-200 dark:border-amber-800
                  shadow-md cursor-move transition-transform
                  ${isDragging ? 'opacity-50' : 'opacity-100'}
                  hover:scale-105 hover:shadow-lg hover:z-10`}
      style={{ opacity: isDragging ? 0.5 : 1, touchAction: 'none' }} // touchActionを追加
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={() => console.log('Touch start on weapon:', weapon.id)}
    >
      <Image
        src={weapon.iconUrl}
        alt={weapon.name}
        fill
        className="object-cover"
        unoptimized // 画像の最適化を無効化して、ドラッグ中の表示を改善
      />
      
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
  rowIndex?: number; // オプショナルに変更
  weaponsInTier: Weapon[];
  onDrop: (weaponId: string, tierId: string) => void;
}

// 武器Tier行コンポーネント - メモ化してパフォーマンスを向上
const WeaponTierRow = React.memo(({ tier, weaponsInTier, onDrop }: WeaponTierRowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.WEAPON,
    drop: (item: DragItem) => {
      console.log('Dropped weapon:', item, 'to tier:', tier.id);
      onDrop(item.id, tier.id);
      return { id: tier.id };
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });
  
  // ref と drop を接続
  drop(ref);

  return (
    <div 
      ref={ref} 
      className={`flex w-full items-stretch mb-0 border-2 ${isOver ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700'} transition-colors`}
      style={{ minHeight: '120px' }}
    >
      {/* 左側のTier名ラベル - absoluteポジション背景で確実に色を適用 */}
      <div className="w-16 sm:w-20 flex-shrink-0 relative">
        {/* 背景色 - tier.colorを直接使用 */}
        <div 
          className={`${tier.color} absolute inset-0 w-full h-full`}
          aria-hidden="true"
        ></div>
        
        {/* コンテンツ - 相対位置で背景の上に配置 */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <span className="text-white font-bold text-sm sm:text-base tracking-wider drop-shadow-md">
            {tier.name}
          </span>
        </div>
      </div>
      
      {/* 右側のドロップエリア - 表のセルのように見せる */}
      <div className="flex-1 min-h-28 p-2 flex flex-wrap gap-2 bg-white/50 dark:bg-gray-800/50 border-l border-gray-300 dark:border-gray-600">
        {weaponsInTier.map(weapon => (
          <WeaponCard 
            key={weapon.id} 
            weapon={weapon} 
            onDrop={onDrop} 
            currentTier={tier.id} 
          />
        ))}
        {weaponsInTier.length === 0 && (
          <div className="w-full h-24 flex items-center justify-center text-gray-400 dark:text-gray-500 italic">
            ここに武器をドラッグ
          </div>
        )}
      </div>
    </div>
  );
});

// displayNameを追加
WeaponTierRow.displayName = 'WeaponTierRow';

// 列ドロップエリアのためのインターフェース
interface ColumnDropAreaProps {
  columnIndex: number;
  tier: {
    id: string;
    name: string;
    color: string;
  };
  charactersInTier: Character[];
  characterColumnAssignments: Record<string, number>;
  columnLabels: string[];
  onDrop: (characterId: string, tierId: string) => void;
  changeCharacterColumn?: (characterId: string, newColumnIndex: number) => void;
  // 下記のプロパティを追加
  characterTiers?: Record<string, string[]>;
  setCharacterTiers?: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  setCharacterColumnAssignments?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  tierMakerCharacters?: Character[];
  // 凸数表示モード用のプロパティを追加
  showConstellations?: boolean;
  characterConstellations?: Record<string, number>;
  changeConstellation?: (characterId: string, value: number) => void;
}

// 列ドロップエリアコンポーネント
const ColumnDropArea = ({ 
  columnIndex,
  tier,
  charactersInTier,
  characterColumnAssignments,
  columnLabels,
  onDrop,
  changeCharacterColumn,
  // 下記のプロパティを追加
  characterTiers,
  setCharacterTiers,
  setCharacterColumnAssignments,
  tierMakerCharacters,
  // 凸数表示モード用のプロパティを追加
  showConstellations,
  characterConstellations = {}, // デフォルト値を空のオブジェクトに設定
  changeConstellation
}: ColumnDropAreaProps) => {
  // フィルタリングロジックを変更 - isSplitView は常に true
  const charactersInColumn = charactersInTier.filter(char => 
    characterColumnAssignments[char.id] === columnIndex
  );
  
  // 各列固有のドロップハンドラを定義
  const columnRef = useRef<HTMLDivElement>(null);
  const [{ isColumnOver }, dropColumn] = useDrop<DragItem, any, { isColumnOver: boolean }>({
    accept: ItemTypes.CHARACTER,
    drop: (item) => {
      console.log(`Dropped character ${item.id} to tier ${tier.id}, column ${columnIndex}`);
      onDrop(item.id, tier.id);
      
      // 列の割り当ても自動的に行う
      if (changeCharacterColumn) {
        changeCharacterColumn(item.id, columnIndex);
      }
      
      return { id: tier.id, column: columnIndex };
    },
    collect: (monitor) => ({
      isColumnOver: !!monitor.isOver(),
    }),
  });
  
  // refをマージ
  dropColumn(columnRef);
  
  return (
    <div 
      ref={columnRef}
      key={`column-${columnIndex}`} 
      className={`flex-1 min-h-28 p-2 flex flex-wrap gap-2 
        ${isColumnOver ? 'bg-amber-50/70 dark:bg-amber-900/30 ring-2 ring-amber-400/40 dark:ring-amber-600/30' : 'bg-white/50 dark:bg-gray-800/50'} 
        transition-all duration-200 relative rounded-sm`}
      data-column-index={columnIndex}
    >
      {/* キャラクターカード */}
      <div className="w-full flex flex-wrap gap-2">
        {charactersInColumn.map(character => (
          <CharacterCard 
            key={character.id} 
            character={character} 
            onDrop={onDrop} // 通常のドロップハンドラに戻す
            currentTier={tier.id}
            characterTiers={characterTiers}
            setCharacterTiers={setCharacterTiers}
            characterColumnAssignments={characterColumnAssignments}
            setCharacterColumnAssignments={setCharacterColumnAssignments}
            tierMakerCharacters={tierMakerCharacters}
            // 凸数表示モード用のプロパティ
            showConstellations={showConstellations}
            constellation={characterConstellations[character.id] || 0}
            changeConstellation={changeConstellation}
          />
        ))}
        {charactersInColumn.length === 0 && (
          <div className="w-full h-24 flex items-center justify-center text-gray-400 dark:text-gray-500 italic transition-opacity duration-200">
            <div className="px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm flex items-center opacity-70 hover:opacity-100">
              <svg className="w-5 h-5 mr-2 opacity-60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              ここにドラッグ
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Tier行コンポーネント - メモ化してパフォーマンスを向上
const TierRow = ({ 
  tier, 
  charactersInTier, 
  onDrop,
  rowIndex,
  isSplitView,
  columnCount = 1,
  columnLabels = [],
  characterColumnAssignments = {},
  changeCharacterColumn,
  onTierNameEdit,
  // キャラクター複製用のプロパティ
  characterTiers,
  setCharacterTiers,
  setCharacterColumnAssignments,
  tierMakerCharacters,
  // 凸数表示モード用のプロパティを追加
  showConstellations,
  characterConstellations,
  changeConstellation
}: TierRowProps) => {
  console.log(`TierRow ${tier.id} rendering with ${charactersInTier.length} characters`);
  if (charactersInTier.length > 0) {
    console.log(`[DEBUG] TierRow ${tier.id} のキャラクターリスト:`, charactersInTier.map(c => c.id));
  }
  
  // refを追加
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CHARACTER,
    drop: (item: DragItem) => {
      console.log('Dropped character to tier:', tier.id);
      return { id: tier.id };
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  
  // refとdropを接続
  drop(ref);
  
  // ティア名編集のための状態
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState(tier.name);
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  // 編集開始
  const startNameEdit = () => {
    setIsEditingName(true);
    setEditingName(tier.name);
    // 次のレンダリングでフォーカスさせるためのタイムアウト
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
        nameInputRef.current.select();
      }
    }, 10);
  };
  
  // 編集保存
  const saveNameEdit = () => {
    if (isEditingName && editingName.trim() !== '') {
      // onTierNameEditプロパティが渡されている場合のみ実行
      if (onTierNameEdit) {
        onTierNameEdit(tier.id, editingName);
      }
    }
    setIsEditingName(false);
  };
  
  // キー入力処理
  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveNameEdit();
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
    }
  };
  
  // 編集中の外部クリック処理
  useEffect(() => {
    if (isEditingName) {
      const handleClickOutside = (e: MouseEvent) => {
        if (nameInputRef.current && !nameInputRef.current.contains(e.target as Node)) {
          saveNameEdit();
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isEditingName, tier.id, onTierNameEdit]); // tier.idとonTierNameEditを依存配列に追加
  
  return (
    <div 
      ref={ref} 
      className={`flex w-full items-stretch mb-0 border-2 rounded-sm ${isOver ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700'} transition-all duration-200 hover:shadow-md ${isOver ? 'shadow-amber-200 dark:shadow-amber-900/30' : ''}`}
      style={{ minHeight: '120px' }}
    >
      {/* 左側のTier名ラベル */}
      <div className="w-16 sm:w-20 flex-shrink-0 relative overflow-hidden">
        {/* 背景色 - tier.colorを直接使用 */}
        <div 
          className={`${tier.color} absolute inset-0 w-full h-full`}
          aria-hidden="true"
        ></div>
        
        {/* キラキラエフェクト - グラデーションで立体感を出す */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
        
        {/* コンテンツ - 相対位置で背景の上に配置 */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={handleNameKeyDown}
              onBlur={saveNameEdit}
              className="relative z-10 w-12 sm:w-16 text-center px-1 py-0.5 border-2 border-blue-400 dark:border-blue-600 rounded bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tier名"
            />
          ) : (
            <div
              onClick={startNameEdit}
              className="text-white font-bold text-sm sm:text-base tracking-wider drop-shadow-md cursor-pointer hover:bg-white/20 rounded px-2 py-1 transition-colors flex items-center"
            >
              {tier.name}
              <span className="ml-1 opacity-50 text-xs">✎</span>
            </div>
          )}
        </div>
      </div>
      
      {/* キャラクタードロップエリア - 常に分割表示 */}
      <div className="flex flex-row flex-1 min-h-[120px] border-box divide-x-2 divide-gray-300/50 dark:divide-gray-600/50 bg-white/50 dark:bg-gray-800/50 transition-all duration-200">
        {Array.from({ length: columnCount }).map((_, index) => (
          <ColumnDropArea
            key={`column-${index}`}
            columnIndex={index}
            tier={tier}
            charactersInTier={charactersInTier}
            characterColumnAssignments={characterColumnAssignments}
            columnLabels={columnLabels}
            onDrop={onDrop}
            changeCharacterColumn={changeCharacterColumn}
            // 追加プロパティを渡す
            characterTiers={characterTiers}
            setCharacterTiers={setCharacterTiers}
            setCharacterColumnAssignments={setCharacterColumnAssignments}
            tierMakerCharacters={tierMakerCharacters}
            // 凸数表示モード用のプロパティを追加
            showConstellations={showConstellations}
            characterConstellations={characterConstellations}
            changeConstellation={changeConstellation}
          />
        ))}
      </div>
    </div>
  );
};

// displayNameを追加
TierRow.displayName = 'TierRow';
ColumnDropArea.displayName = 'ColumnDropArea';

// メインTiermakerページコンポーネント
export default function TierMakerPage() {
  // キャラクターTiermaker用の状態
  const [selectedTemplate, setSelectedTemplate] = useState<TierTemplate>(templates[0]);
  const [characterTiers, setCharacterTiers] = useState<Record<string, string[]>>({
    unassigned: tierMakerCharacters.map(char => char.id)
  });
  // searchQueryとelementFilterを削除
  
  // 列分割機能のための状態
  const [columnCount, setColumnCount] = useState(3); // デフォルト値を3に変更
  const [columnLabels, setColumnLabels] = useState(['性能厨（メタ編成特化）', 'オフメタ編成も極めたい', 'キャラ愛厨']); // 3列分の名前を設定
  const [characterColumnAssignments, setCharacterColumnAssignments] = useState<Record<string, number>>(() => {
    // 初期状態では、キャラクターを最初の列に割り当てる
    const assignments: Record<string, number> = {};
    tierMakerCharacters.forEach(char => {
      assignments[char.id] = 0; // デフォルトでは最初の列に全て割り当て
    });
    return assignments;
  });
  
  // 凸数表示モード用の状態を追加
  // 注：この宣言は後半部分（2074行目付近）と重複しているため削除

  // インプレース編集のための状態
  const [editingLabelIndex, setEditingLabelIndex] = useState<number | null>(null);
  const [editingLabelValue, setEditingLabelValue] = useState('');
  const labelEditInputRef = useRef<HTMLInputElement>(null);
  
  // 武器Tiermaker用の状態
  const [selectedWeaponTemplate, setSelectedWeaponTemplate] = useState<TierTemplate>(weaponTemplates[0]);
  const [weaponTiers, setWeaponTiers] = useState<Record<string, string[]>>({
    'weapon-unassigned': tierMakerWeapons.map(weapon => weapon.id)
  });
  // weaponSearchQueryとweaponTypeFilterを削除
  const [customWeaponTemplates, setCustomWeaponTemplates] = useState<TierTemplate[]>([]);
  // 元々状態変数として定義していた編集モードを常にfalseにする（カスタム機能を無効化）
  const isWeaponEditMode = false; // 常にfalseにして、カスタム機能を無効化
  const [customWeaponTemplate, setCustomWeaponTemplate] = useState<TierTemplate | null>(null);
  const [newWeaponTierName, setNewWeaponTierName] = useState('');
  const [newWeaponTierColor, setNewWeaponTierColor] = useState('bg-gray-500');
  
  // 編集モード関連の状態
  const isEditMode = false; // 常にfalseにして、カスタム機能を無効化
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
  
  // 初期ロード時にデフォルトテンプレートの列設定を適用
  useEffect(() => {
    // 初期値として選択されているテンプレートの設定を適用
    const defaultTemplate = templates[0];
    if (defaultTemplate.defaultColumnCount && defaultTemplate.defaultColumnLabels) {
      setColumnCount(defaultTemplate.defaultColumnCount);
      setColumnLabels(defaultTemplate.defaultColumnLabels);
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
    initialTiers['unassigned'] = tierMakerCharacters.map(char => char.id);
    
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
    initialWeaponTiers['weapon-unassigned'] = tierMakerWeapons.map(weapon => weapon.id);
    
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
    // 常にfalseになるようにします
    // const newEditMode = !isEditMode;
    // setIsEditMode(newEditMode);
    
    // 編集モードを終了する場合（現在は常にfalseなので、この条件は実行されない）
    if (customTemplate) {
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
        const char = tierMakerCharacters.find(c => c.id === id);
        if (!char) {
          console.warn(`ID ${id} に一致するキャラクターが見つかりません`);
        }
        return char;
      })
      .filter((char): char is Character => char !== undefined);
    
    console.log(`getCharactersInTier(${tierId})の結果: ${result.length} キャラクター`);
    return result;
  };
  
  // 未割り当てのキャラクターを取得
  const getUnassignedCharacters = (): Character[] => {
    // characterTiers['unassigned']が存在するか確認
    if (!characterTiers || !characterTiers['unassigned']) {
      console.log('未割り当てTierが存在しません');
      return [];
    }
    
    console.log('getUnassignedCharacters() - unassignedリスト:', characterTiers['unassigned']);
    
    const result = tierMakerCharacters.filter(char => 
      characterTiers['unassigned'].includes(char.id)
    );
    
    console.log('getUnassignedCharacters() - フィルター後のキャラ数:', result.length);
    return result;
  };
  
  // 特定の列に属するキャラクターを取得する関数
  const getCharactersInTierAndColumn = (tierId: string, columnIndex: number): Character[] => {
    if (!characterTiers || !characterTiers[tierId]) {
      return [];
    }
    
    return characterTiers[tierId]
      .map(id => {
        const char = tierMakerCharacters.find(c => c.id === id);
        if (!char) {
          console.warn(`ID ${id} に一致するキャラクターが見つかりません`);
          return undefined;
        }
        // 列分割表示では、指定された列に属するキャラクターのみを返す
        if (characterColumnAssignments[id] !== columnIndex) {
          return undefined;
        }
        return char;
      })
      .filter((char): char is Character => char !== undefined);
  };
  
  // 列ラベルを変更する関数
  const handleColumnLabelChange = (index: number, newLabel: string) => {
    const newLabels = [...columnLabels];
    newLabels[index] = newLabel;
    setColumnLabels(newLabels);
  };
  
  // キャラクターの列割り当てを変更する関数
  const changeCharacterColumn = (characterId: string, newColumnIndex: number) => {
    setCharacterColumnAssignments(prev => ({
      ...prev,
      [characterId]: newColumnIndex
    }));
  };
  
  // 分割表示を切り替える関数 - 削除 (不要になったため)
  
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
    // 常にfalseになるようにします
    // const newEditMode = !isWeaponEditMode;
    // setIsWeaponEditMode(newEditMode);
    
    // 編集モードを終了する場合（現在は常にfalseなので、この条件は実行されない）
    if (customWeaponTemplate) {
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
        const weapon = tierMakerWeapons.find(w => w.id === id);
        if (!weapon) {
          console.warn(`ID ${id} に一致する武器が見つかりません`);
        }
        return weapon;
      })
      .filter((weapon): weapon is Weapon => weapon !== undefined);
    
    return result;
  };
  
  // 未割り当ての武器を取得
  const getUnassignedWeapons = (): Weapon[] => {
    // weaponTiers['weapon-unassigned']が存在するか確認
    if (!weaponTiers || !weaponTiers['weapon-unassigned']) {
      console.log('未割り当て武器Tierが存在しません');
      return [];
    }
    
    const result = tierMakerWeapons.filter(weapon => 
      weaponTiers['weapon-unassigned'].includes(weapon.id)
    );
    
    return result;
  };
  
  // 未割り当てキャラクター
  const UnassignedCharactersArea = React.memo(() => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ isOver }, drop] = useDrop({
      accept: ItemTypes.CHARACTER,
      drop: (item: DragItem) => {
        console.log('Dropped character to unassigned area:', item);
        handleDrop(item.id, 'unassigned');
        // 未割り当てエリアに戻す場合は列の割り当ても解除（デフォルトの0列目に戻す）
        changeCharacterColumn(item.id, 0);
        return { id: 'unassigned' };
      },
      collect: monitor => ({
        isOver: !!monitor.isOver(),
      }),
    });

    // ref と drop を接続
    drop(ref);

    // キャラクターリストを取得し、characterTiers['unassigned']の順序どおりに表示する
    const unassignedCharacters = React.useMemo(() => {
      console.log('[DEBUG] UnassignedCharactersArea - レンダリング開始');
      // IDの順序を取得
      const characterIds = characterTiers['unassigned'] || [];
      
      // 順序に従ってキャラクターオブジェクトを取得
      const orderedCharacters = characterIds.map(id => {
        return tierMakerCharacters.find(char => char.id === id);
      }).filter((char): char is Character => char !== undefined);
      
      console.log(`[DEBUG] UnassignedCharactersArea - 表示キャラクター数: ${orderedCharacters.length}`);
      if (orderedCharacters.length > 0) {
        console.log(`[DEBUG] 最初の5キャラクター: ${orderedCharacters.slice(0, 5).map(c => c.id).join(', ')}`);
      }
      
      return orderedCharacters;
    }, [characterTiers, tierMakerCharacters]);
    
    return (
      <div 
        ref={ref}
        className={`min-h-40 p-4 border-2 border-dashed ${isOver ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-300 dark:border-gray-600'} rounded-lg flex flex-wrap gap-3 transition-colors`}
        style={{ justifyContent: unassignedCharacters.length > 0 ? 'flex-start' : 'center' }}
      >
        {unassignedCharacters.length > 0 ? (
          unassignedCharacters.map(char => (
            <CharacterCard 
              key={char.id}
              character={char}
              onDrop={handleDrop}
              currentTier="unassigned"
              characterTiers={characterTiers}
              setCharacterTiers={setCharacterTiers}
              characterColumnAssignments={characterColumnAssignments}
              setCharacterColumnAssignments={setCharacterColumnAssignments}
              tierMakerCharacters={tierMakerCharacters}
              showConstellations={showConstellations}
              constellation={characterConstellations[char.id] || 0}
              changeConstellation={changeConstellation}
            />
          ))
        ) : (
          <div className="w-full text-center text-gray-500 dark:text-gray-400 py-8">
            すべてのキャラクターが配置されました！
          </div>
        )}
      </div>
    );
  });
  
  UnassignedCharactersArea.displayName = 'UnassignedCharactersArea';

  // 未割り当て武器
  const UnassignedWeaponsArea = React.memo(() => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ isOver }, drop] = useDrop({
      accept: ItemTypes.WEAPON,
      drop: (item: DragItem) => {
        console.log('Dropped weapon to unassigned area:', item);
        handleWeaponDrop(item.id, 'weapon-unassigned');
        return { id: 'weapon-unassigned' };
      },
      collect: monitor => ({
        isOver: !!monitor.isOver(),
      }),
    });

    // ref と drop を接続
    drop(ref);

    const unassignedWeapons = getUnassignedWeapons();
    
    return (
      <div 
        ref={ref}
        className={`min-h-40 p-4 border-2 border-dashed ${isOver ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-300 dark:border-gray-600'} rounded-lg flex flex-wrap gap-3 transition-colors`}
        style={{ justifyContent: unassignedWeapons.length > 0 ? 'flex-start' : 'center' }}
      >
        {unassignedWeapons.length > 0 ? (
          unassignedWeapons.map(weapon => (
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
    );
  });
  
  UnassignedWeaponsArea.displayName = 'UnassignedWeaponsArea';

  // キャラクターの複製処理関数
  const duplicateCharacter = useCallback((character: Character, newId: string, targetTier: string) => {
    console.log(`キャラクター ${character.name} を複製します。新ID: ${newId}, ターゲットティア: ${targetTier}`);
    
    // 複製したキャラクターオブジェクトを作成
    const duplicatedCharacter: Character = {
      ...character,
      id: newId,
    };
    
    console.log(`[DEBUG] 複製処理開始 - 対象キャラクター: ${character.name}, ID: ${character.id}, ターゲットティア: ${targetTier}`);
    
    // 複製したキャラクターを指定のティアに追加
    setCharacterTiers(prev => {
      const newState = { ...prev };
      
      // 指定されたティアが存在しない場合は作成
      if (!newState[targetTier]) {
        newState[targetTier] = [];
      }
      
      // 元のキャラクターの位置を探す
      const originalIndex = newState[targetTier].findIndex(id => id === character.id);
      
      console.log(`[DEBUG] 元キャラクターの位置検索 - ティア: ${targetTier}, 結果: ${originalIndex}`);
      
      if (originalIndex !== -1) {
        // 元のキャラクターの隣に配置
        const newCharacters = [...newState[targetTier]];
        newCharacters.splice(originalIndex + 1, 0, newId);
        newState[targetTier] = newCharacters;
        console.log(`${targetTier}内の元キャラクターの位置: ${originalIndex}, 新キャラクターの位置: ${originalIndex + 1}`);
      } else {
        // 元のキャラクターが見つからない場合は末尾に追加
        newState[targetTier] = [...newState[targetTier], newId];
        console.log(`${targetTier}内に元キャラクターが見つからないため末尾に追加`);
      }
      
      console.log(`[DEBUG] 更新後の${targetTier}の内容:`, newState[targetTier]);
      return newState;
    });
    
    // 列割り当ても設定（元のキャラクターと同じ列に配置）
    setCharacterColumnAssignments(prev => {
      const newAssignments = { ...prev };
      // 元のキャラクターの列を取得（デフォルトは0）
      const originalColumn = prev[character.id] || 0;
      // 同じ列に配置
      newAssignments[newId] = originalColumn;
      console.log(`[DEBUG] 列割り当て - 新キャラクター: ${newId}, 割り当て列: ${originalColumn}`);
      return newAssignments;
    });
    
    // tierMakerCharactersも更新（参照用）
    // 重要: 直接push()するのではなく、安全に追加する
    const existingIndex = tierMakerCharacters.findIndex(c => c.id === duplicatedCharacter.id);
    if (existingIndex === -1) {
      // まだ存在しない場合は追加
      tierMakerCharacters.push(duplicatedCharacter);
      console.log(`[DEBUG] tierMakerCharactersに新しいキャラクターを追加しました。ID: ${duplicatedCharacter.id}`);
    } else {
      // すでに存在する場合は置き換え
      tierMakerCharacters[existingIndex] = duplicatedCharacter;
      console.log(`[DEBUG] tierMakerCharactersの既存キャラクターを更新しました。ID: ${duplicatedCharacter.id}`);
    }
    
    // グローバル変数を更新
    window._tiermakerCharacters = [...tierMakerCharacters];
    
    console.log(`[DEBUG] 複製完了 - tierMakerCharactersの現在の長さ: ${tierMakerCharacters.length}`);
    
    return duplicatedCharacter; // 作成したキャラクターを返す
  }, [tierMakerCharacters, setCharacterTiers, setCharacterColumnAssignments]);

  // キャラクターの完全削除処理関数
  const deleteCharacter = useCallback((characterId: string) => {
    console.log(`キャラクター ${characterId} を完全に削除します`);
    
    // すべてのティアからこのキャラクターを削除
    setCharacterTiers(prev => {
      const newState = { ...prev };
      
      // すべてのティアをチェック
      Object.keys(newState).forEach(tierId => {
        // このキャラクターIDを持つものを除外
        if (newState[tierId] && newState[tierId].includes(characterId)) {
          newState[tierId] = newState[tierId].filter(id => id !== characterId);
        }
      });
      
      return newState;
    });
    
    // 列割り当ても削除
    setCharacterColumnAssignments(prev => {
      const newAssignments = { ...prev };
      delete newAssignments[characterId];
      return newAssignments;
    });
    
    // tierMakerCharactersからも削除（可能な場合）
    const index = tierMakerCharacters.findIndex(c => c.id === characterId);
    if (index !== -1) {
      tierMakerCharacters.splice(index, 1);
    }
  }, []);

  // グローバルな状態と関数の登録
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[DEBUG] グローバル関数の登録を更新します');
      
      // バックアップ用のオブジェクトを作成
      window._tiermakerFunctions = {
        duplicateCharacter
      };
      
      // キャラクターリストも登録
      window._tiermakerCharacters = tierMakerCharacters;
      
      window.tiermakerState = {
        isSplitView: true, // 常にtrueとして設定
        columnCount,
        columnLabels,
        characterColumnAssignments
      };
      window.tiermakerChangeCharacterColumn = changeCharacterColumn;
      window.tiermakerDuplicateCharacter = duplicateCharacter;
      window.tiermakerDeleteCharacter = deleteCharacter;
      
      console.log('[DEBUG] グローバル関数の登録完了 - duplicateCharacter関数を更新しました');
    }
  }, [columnCount, columnLabels, characterColumnAssignments, changeCharacterColumn, duplicateCharacter, deleteCharacter, tierMakerCharacters]);

  // 列ラベル編集のハンドラ関数
  const startLabelEdit = (index: number) => {
    setEditingLabelIndex(index);
    setEditingLabelValue(columnLabels[index]);
    // 次のレンダリングでフォーカスさせるためのタイムアウト
    setTimeout(() => {
      if (labelEditInputRef.current) {
        labelEditInputRef.current.focus();
        labelEditInputRef.current.select();
      }
    }, 10);
  };

  const saveLabelEdit = () => {
    if (editingLabelIndex !== null) {
      handleColumnLabelChange(editingLabelIndex, editingLabelValue);
      setEditingLabelIndex(null);
    }
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveLabelEdit();
    } else if (e.key === 'Escape') {
      setEditingLabelIndex(null);
    }
  };

  // 編集中のラベル外をクリックしたときのイベントリスナー
  useEffect(() => {
    if (editingLabelIndex !== null) {
      const handleClickOutside = (e: MouseEvent) => {
        if (labelEditInputRef.current && !labelEditInputRef.current.contains(e.target as Node)) {
          saveLabelEdit();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [editingLabelIndex, editingLabelValue]);

  // 行ラベル（Tier名）の直接編集ハンドラー
  const handleDirectTierNameEdit = (tierId: string, newName: string) => {
    // 編集モード時
    if (isEditMode && customTemplate) {
      // 該当するTierのnameを更新
      const updatedTiers = customTemplate.tiers.map((tier: TierTemplate['tiers'][0]) => {
        if (tier.id === tierId) {
          return { ...tier, name: newName };
        }
        return tier;
      });
      
      setCustomTemplate({
        ...customTemplate,
        tiers: updatedTiers
      });
    } else {
      // 通常モード時も直接編集するだけで、カスタムテンプレートは作成しない
      // 選択中のテンプレートを一時的にコピーして編集
      const templateCopy = JSON.parse(JSON.stringify(selectedTemplate));
      const updatedTiers = templateCopy.tiers.map((tier: TierTemplate['tiers'][0]) => {
        if (tier.id === tierId) {
          return { ...tier, name: newName };
        }
        return tier;
      });
      
      // 選択中のテンプレートに変更を適用（メモリ上での一時的な変更）
      const updatedTemplate = {
        ...templateCopy,
        tiers: updatedTiers
      };
      
      // テンプレートを更新するが、characterTiersは維持する
      setSelectedTemplate(updatedTemplate);
      // ここでcharacterTiersを更新しないことで、キャラクターの配置情報は保持される
    }
  };

  // テンプレート選択時の処理
  const handleTemplateSelect = (template: TierTemplate) => {
    // テンプレートを選択
    setSelectedTemplate(template);
    
    // テンプレートに設定されている場合、列数と列名を適用
    if (template.defaultColumnCount) {
      setColumnCount(template.defaultColumnCount);
    }
    
    if (template.defaultColumnLabels && template.defaultColumnLabels.length > 0) {
      setColumnLabels(template.defaultColumnLabels);
      
      // 列数とラベル数を合わせるための処理
      const newCount = template.defaultColumnLabels.length;
      if (newCount !== columnCount) {
        setColumnCount(newCount);
      }
      
      // キャラクターの列割り当てをリセット
      const newAssignments: Record<string, number> = {};
      tierMakerCharacters.forEach(char => {
        // デフォルトでは最初の列に割り当て
        newAssignments[char.id] = 0;
      });
      setCharacterColumnAssignments(newAssignments);
    }
  };

  // 武器テンプレート選択時の処理
  const handleWeaponTemplateSelect = (template: TierTemplate) => {
    // テンプレートを選択
    setSelectedWeaponTemplate(template);
    
    // 武器の場合は列設定は必要ないので何もしない
  };

  // 凸数表示モード用の状態を追加
  const [showConstellations, setShowConstellations] = useState(false);
  const [characterConstellations, setCharacterConstellations] = useState<Record<string, number>>(() => {
    // 初期状態では、すべてのキャラクターの凸数を0に設定
    const constellations: Record<string, number> = {};
    tierMakerCharacters.forEach(char => {
      constellations[char.id] = 0;
    });
    return constellations;
  });
  
  // 凸数を変更する関数
  const changeConstellation = useCallback((characterId: string, value: number) => {
    if (value >= 0 && value <= 6) {
      setCharacterConstellations(prev => ({
        ...prev,
        [characterId]: value
      }));
    }
  }, []);

  // 凸数表示モードを切り替える関数
  const toggleConstellationMode = () => {
    setShowConstellations(prev => !prev);
  };

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div style={{ position: 'relative', zIndex: 9999 }}>
        <CustomDragLayer characters={tierMakerCharacters} weapons={tierMakerWeapons} />
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
            <div className="flex gap-2">
              {/* 列数調整ボタン */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (columnCount > 1) { // 最小値を1に変更
                      setColumnCount(columnCount - 1);
                      // 列ラベル配列を更新
                      setColumnLabels(prevLabels => prevLabels.slice(0, columnCount - 1));
                    }
                  }}
                  disabled={columnCount <= 1} // 最小値を1に変更
                  className={`px-3 py-1 rounded-lg ${
                    columnCount <= 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                  title="列数を減らす"
                >
                  -
                </button>
                <span className="text-lg font-medium">列数 {columnCount}</span>
                <button
                  onClick={() => {
                    setColumnCount(columnCount + 1);
                    // 列ラベル配列を更新
                    setColumnLabels(prevLabels => [...prevLabels, `列${columnCount + 1}`]);
                  }}
                  className="px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600"
                  title="列数を増やす"
                >
                  +
                </button>
              </div>

              {/* 凸数表示モード切り替えボタン */}
              <button
                onClick={toggleConstellationMode}
                className={`px-4 py-2 rounded-lg text-white ${
                  showConstellations ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'
                } transition-colors`}
                title="凸数表示モードを切り替え"
              >
                {showConstellations ? '凸数表示: ON' : '凸数表示: OFF'}
              </button>

              <button
                onClick={toggleEditMode}
                className={`hidden px-4 py-2 rounded-lg text-white ${
                  isEditMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {isEditMode ? '編集を適用' : 'ティアをカスタマイズ'}
              </button>
            </div>
            {/* 操作ヒント */}
            <div className="hidden text-xs text-gray-600 dark:text-gray-400 mt-2">
              <p>ヒント: 列ラベルをクリックして編集できます。</p>
            </div>
          </div>
          
          {/* 列ラベル編集セクションを削除 */}
          
          {!isEditMode && (
            <div className="flex flex-wrap gap-3">
              {allTemplates.map(template => (
                <div key={template.id} className="relative group">
                  <button
                    className={`px-4 py-2 rounded-lg ${selectedTemplate.id === template.id ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'} hover:bg-amber-400 dark:hover:bg-amber-600 transition-colors`}
                    onClick={() => handleTemplateSelect(template)}
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
        
        {/* キャラクターTierリスト */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{isEditMode && customTemplate ? customTemplate.name : selectedTemplate.name}</h2>
          
          {/* 列ラベルヘッダー */}
          <div className="flex border-t-2 border-l-2 border-r-2 border-gray-300 dark:border-gray-600 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-t-lg overflow-hidden shadow-sm">
            {/* 左側のスペース - Tier名ラベルと同じ幅 */}
            <div className="w-16 sm:w-20 flex-shrink-0 bg-gradient-to-r from-gray-200/50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-800/50"></div>
            
            {/* 列ラベル */}
            <div className="flex-1 flex">
              {columnLabels.map((label, index) => (
                <div 
                  key={`header-column-${index}`} 
                  className="flex-1 p-2 text-center font-medium text-gray-700 dark:text-gray-300 border-l border-gray-300 dark:border-gray-600 relative overflow-hidden group"
                >
                  {/* 装飾的な背景エフェクト */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none"></div>
                  <div className="absolute -right-6 -top-6 w-12 h-12 bg-gradient-to-br from-blue-100/20 to-indigo-200/10 dark:from-blue-500/10 dark:to-indigo-600/5 rounded-full blur-md group-hover:scale-125 transition-transform duration-300"></div>
                  
                  {editingLabelIndex === index ? (
                    <input
                      ref={labelEditInputRef}
                      type="text"
                      value={editingLabelValue}
                      onChange={(e) => setEditingLabelValue(e.target.value)}
                      onKeyDown={handleLabelKeyDown}
                      onBlur={saveLabelEdit}
                      className="w-full px-2 py-1 text-center border-2 border-blue-400 dark:border-blue-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-10 font-['Hiragino_Sans','Noto_Sans_JP','YuGothic','Meiryo',sans-serif] font-bold text-lg"
                      placeholder={`列${index + 1}`}
                    />
                  ) : (
                    <div 
                      onClick={() => startLabelEdit(index)}
                      className="cursor-pointer hover:bg-white/30 dark:hover:bg-gray-600/50 rounded px-2 py-1 transition-all duration-200 flex items-center justify-center relative z-10 group-hover:scale-105 group-hover:shadow-sm"
                    >
                      <span className="relative z-10 font-bold text-lg font-['Hiragino_Sans','Noto_Sans_JP','YuGothic','Meiryo',sans-serif] tracking-wide text-center w-full truncate transform scale-100 origin-center" style={{ 
                        maxWidth: '100%',
                        display: 'block',
                        transform: label.length > 6 ? `scale(${Math.max(0.7, 1 - (label.length - 6) * 0.05)})` : 'scale(1)'
                      }}>{label}</span>
                      <span className="ml-1 opacity-50 text-xs group-hover:opacity-80 transition-opacity">✎</span>
                      
                      {/* 下線アクセント（ホバー時に表示） */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-300/0 via-amber-300/70 to-amber-300/0 dark:from-amber-500/0 dark:via-amber-500/70 dark:to-amber-500/0 group-hover:w-full transition-all duration-300"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-l-2 border-r-2 border-b-2 border-gray-300 dark:border-gray-600 rounded-b-lg overflow-hidden shadow-lg">
            {(isEditMode && customTemplate ? customTemplate.tiers : selectedTemplate.tiers).map((tier, index, array) => (
              <div 
                key={tier.id} 
                className={`flex flex-col ${index === array.length - 1 ? 'rounded-b-lg overflow-hidden' : ''}`}
              >
                <TierRow 
                  tier={tier}
                  charactersInTier={getCharactersInTier(tier.id)}
                  onDrop={handleDrop}
                  isSplitView={true}
                  columnCount={columnCount}
                  columnLabels={columnLabels}
                  characterColumnAssignments={characterColumnAssignments}
                  changeCharacterColumn={changeCharacterColumn}
                  onTierNameEdit={handleDirectTierNameEdit}
                  characterTiers={characterTiers}
                  setCharacterTiers={setCharacterTiers}
                  setCharacterColumnAssignments={setCharacterColumnAssignments}
                  tierMakerCharacters={tierMakerCharacters}
                  showConstellations={showConstellations}
                  characterConstellations={characterConstellations}
                  changeConstellation={changeConstellation}
                />
                {index < array.length - 1 && <div className="border-b border-gray-300 dark:border-gray-600"></div>}
              </div>
            ))}
          </div>
        </div>
        
        {/* 未割り当てキャラクター */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">利用可能なキャラクター</h2>
          <UnassignedCharactersArea />
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
                      onClick={() => handleWeaponTemplateSelect(template)}
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
          
          {/* 武器Tierリスト */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{isWeaponEditMode && customWeaponTemplate ? customWeaponTemplate.name : selectedWeaponTemplate.name}</h2>
            <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-lg">
              {(isWeaponEditMode && customWeaponTemplate ? customWeaponTemplate.tiers : selectedWeaponTemplate.tiers).map((tier, index, array) => (
                <div 
                  key={tier.id} 
                  className={`flex flex-col ${index === array.length - 1 ? 'rounded-b-lg overflow-hidden' : ''}`}
                >
                  <WeaponTierRow 
                    tier={tier}
                    weaponsInTier={getWeaponsInTier(tier.id)}
                    onDrop={handleWeaponDrop}
                  />
                  {index < array.length - 1 && <div className="border-b border-gray-300 dark:border-gray-600"></div>}
                </div>
              ))}
            </div>
          </div>
          
          {/* 未割り当て武器 */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">利用可能な武器</h2>
            <UnassignedWeaponsArea />
          </div>
        </div>
      </div>
    </DndProvider>
  );
} 
