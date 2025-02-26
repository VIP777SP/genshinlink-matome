'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FavoriteButton from '@/components/FavoriteButton';
import CommentSection from '@/components/CommentSection';
import { getCharacterById, elementColors, weaponIcons, getCharacterIconUrl } from '@/utils/characters';
import { useState, useEffect } from 'react';
import { characterGuides } from '@/data/characterGuides';

// アーティファクトのセット効果を定義
type ArtifactSet = {
  id: string;
  name: string;
  pieces: number[];
  bonus: string[];
  priority: 'best' | 'good' | 'alternative';
};

// 武器データの型を定義
type Weapon = {
  id: string;
  name: string;
  rarity: number;
  imageUrl: string;
  description: string;
  priority: 'best' | 'good' | 'alternative';
};

// おすすめパーティーの型を定義
type Team = {
  id: string;
  name: string;
  characters: string[];
  description: string;
};

// キャラクター評価の型定義
type CharacterRating = {
  attacker: number; // 5点満点
  supporter: number; // 5点満点
  convenience: number; // 5点満点
};

// 画像ファイルが存在するかチェックするカスタムフック
function useImageExists(src: string) {
  const [exists, setExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!src) {
      setExists(false);
      setLoading(false);
      return;
    }

    // ブラウザでのみ実行
    if (typeof window !== 'undefined') {
      setLoading(true);
      const img = new window.Image(); // window.Imageを使用して明示的にブラウザImageを参照
      img.onload = () => {
        setExists(true);
        setLoading(false);
      };
      img.onerror = () => {
        setExists(false);
        setLoading(false);
      };
      img.src = src;
    }
  }, [src]);

  return { exists, loading };
}

// 安全な画像コンポーネント
interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

function SafeImage({ src, alt, fill = false, width, height, className = '', priority = false }: SafeImageProps) {
  const { exists, loading } = useImageExists(src);
  const placeholderSrc = '/images/placeholder.svg'; // SVGプレースホルダー画像パス

  // ローディング中またはエラー時に表示するプレースホルダー
  if (loading) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`} style={{ width, height }}>
        {!fill && <div className="w-full h-full" />}
      </div>
    );
  }

  // 画像が存在しない場合はプレースホルダーを表示
  const imgSrc = exists ? src : placeholderSrc;

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 300}
      height={height || 200}
      className={className}
      priority={priority}
    />
  );
}

export default function CharacterGuidePage() {
  const params = useParams();
  const characterId = params.id as string;
  
  // キャラクター情報を取得
  const character = getCharacterById(characterId);
  
  // キャラクターが見つからない場合は404ページを表示
  if (!character) {
    notFound();
  }
  
  // このキャラクターの評価（サンプル）
  // 実際のアプリでは、このデータはAPIやcharacterオブジェクトから取得する
  const characterRating: CharacterRating = {
    attacker: character.id === 'raiden-shogun' ? 4.5 : 3,
    supporter: character.id === 'raiden-shogun' ? 5 : 4,
    convenience: character.id === 'raiden-shogun' ? 4 : 3.5
  };
  
  // このキャラクターに適した聖遺物セット（サンプルデータ）
  const artifactSets: ArtifactSet[] = [
    {
      id: 'emblem-of-severed-fate',
      name: '絶縁の旗印',
      pieces: [4],
      bonus: ['元素チャージ効率+20%', '元素爆発のダメージが、元素チャージ効率の25%分アップする。'],
      priority: 'best'
    },
    {
      id: 'thundering-fury',
      name: '雷のような怒り',
      pieces: [2],
      bonus: ['雷元素ダメージ+15%'],
      priority: 'good'
    },
    {
      id: 'noblesse-oblige',
      name: '旧貴族のしつけ',
      pieces: [2],
      bonus: ['元素爆発のダメージ+20%'],
      priority: 'alternative'
    }
  ];
  
  // このキャラクターに適した武器（サンプルデータ）
  const weapons: Weapon[] = [
    {
      id: 'engulfing-lightning',
      name: '草薙の稲光',
      rarity: 5,
      imageUrl: '/images/weapons/engulfing-lightning.png', // 画像パスを/images/weaponsに変更
      description: '雷電将軍の専用武器。元素チャージ効率をさらに高め、元素爆発のダメージを大幅に向上させる。',
      priority: 'best'
    },
    {
      id: 'the-catch',
      name: '「漁獲」',
      rarity: 4,
      imageUrl: '/images/weapons/the-catch.png', // 画像パスを/images/weaponsに変更
      description: 'イベント報酬の★4武器。元素爆発のダメージと会心率を向上させる効果があり、無課金でも入手可能。',
      priority: 'good'
    }
  ];
  
  // おすすめパーティー構成（サンプルデータ）
  const recommendedTeams: Team[] = [
    {
      id: 'national',
      name: '雷電ナショナル',
      characters: ['raiden-shogun', 'xiangling', 'xingqiu', 'bennett'],
      description: '雷電将軍の元素爆発の強化と、香菱・行秋・ベネットの強力な元素反応を組み合わせた超火力パーティー。'
    },
    {
      id: 'hypercarry',
      name: '雷電ハイパーキャリー',
      characters: ['raiden-shogun', 'kazuha', 'bennett', 'sara'],
      description: '雷電将軍の元素爆発のダメージを最大限に高めるためのサポートキャラクターを揃えたパーティー。'
    }
  ];

  // 評価点を星表示に変換する関数
  const renderRatingStars = (rating: number) => {
    // 5点満点での評価を星5つで表現
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-lg ${
            i < fullStars 
              ? 'text-amber-500' 
              : i === fullStars && hasHalfStar 
                ? 'text-amber-500' 
                : 'text-gray-300 dark:text-gray-600'
          }`}>
            {i < fullStars 
              ? <i className="fas fa-star"></i> 
              : i === fullStars && hasHalfStar 
                ? <i className="fas fa-star-half-alt"></i> 
                : <i className="far fa-star"></i>}
          </span>
        ))}
        <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // characterGuides からガイドデータを取得
  const guide = characterGuides[characterId] || {};

  return (
    <main className="max-w-6xl mx-auto relative">
      {/* 背景装飾 */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02] pointer-events-none overflow-hidden">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="genshin-pattern-guide" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20,20 C25,15 35,15 40,20 C45,25 45,35 40,40 C35,45 25,45 20,40 C15,35 15,25 20,20 Z" 
                  fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              <path d="M70,20 L90,20 L80,40 Z" 
                  fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              <path d="M20,70 L25,80 L30,70 L35,90 L20,70" 
                  fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              <path d="M70,70 L90,70 M80,60 L80,80 M75,65 L85,75 M75,75 L85,65" 
                  fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
              <circle cx="50" cy="50" r="20" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="#D4AF37" strokeWidth="0.3" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#genshin-pattern-guide)"/>
        </svg>
        
        {/* カラフルなグラデーションの円 */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/characters/tier" className="text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-300">
            <i className="fas fa-arrow-left mr-2"></i>ティア表に戻る
          </Link>
        </div>
        
        <div className="flex justify-between items-start">
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-500">
            {character.name}の攻略ガイド
          </h1>
          <FavoriteButton 
            id={`character-guide-${character.id}`}
            title={`${character.name}の攻略ガイド`}
            url={`/characters/guide/${character.id}`}
            category="キャラ攻略"
          />
        </div>
      </div>

      {/* キャラクターの基本情報 */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-amber-200/40 dark:border-amber-800/30 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* キャラクター画像 */}
          <div className="md:col-span-1 relative h-80 md:h-full">
            <div className={`absolute inset-0 ${elementColors[character.element].bg} ${elementColors[character.element].darkBg} opacity-20`}></div>
            {/* キャラクター画像をSafeImageに置き換え */}
            <SafeImage
              src={character.fullImageUrl}
              alt={character.name}
              fill
              className="object-cover object-top"
              priority
            />
          </div>
          
          {/* キャラクター情報 */}
          <div className="md:col-span-2 p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {/* レアリティ */}
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-sm">
                {Array(character.rarity).fill('★').join('')}
              </span>
              
              {/* 元素 */}
              <span className={`px-3 py-1 ${elementColors[character.element].bg} ${elementColors[character.element].darkBg} ${elementColors[character.element].text} ${elementColors[character.element].darkText} rounded-full text-sm`}>
                {character.element === 'pyro' && '炎元素'}
                {character.element === 'hydro' && '水元素'}
                {character.element === 'anemo' && '風元素'}
                {character.element === 'electro' && '雷元素'}
                {character.element === 'cryo' && '氷元素'}
                {character.element === 'geo' && '岩元素'}
                {character.element === 'dendro' && '草元素'}
              </span>
              
              {/* 武器タイプ */}
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                {character.weapon === 'sword' && '片手剣'}
                {character.weapon === 'claymore' && '両手剣'}
                {character.weapon === 'polearm' && '長柄武器'}
                {character.weapon === 'bow' && '弓'}
                {character.weapon === 'catalyst' && '法器'}
              </span>
              
              {/* 役割 */}
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                {character.role === 'attacker' ? 'アタッカー' : 'サポーター'}
              </span>
              
              {/* 出身地域 */}
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                {character.region}
              </span>
            </div>
            
            {/* キャラクター評価（新規追加） */}
            <div className="mb-6 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg p-4 border border-amber-200/40 dark:border-amber-800/20">
              <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-3">
                キャラクター評価
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* アタッカー評価 */}
                <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <i className="fas fa-sword mr-2 text-red-500"></i>アタッカー性能
                  </h3>
                  {renderRatingStars(characterRating.attacker)}
                </div>
                
                {/* サポーター評価 */}
                <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <i className="fas fa-hands-helping mr-2 text-blue-500"></i>サポーター性能
                  </h3>
                  {renderRatingStars(characterRating.supporter)}
                </div>
                
                {/* 普段使い評価 */}
                <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <i className="fas fa-user-check mr-2 text-green-500"></i>普段使いやすさ
                  </h3>
                  {renderRatingStars(characterRating.convenience)}
                </div>
              </div>
            </div>
            
            {/* 育成方針（上に移動） */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-2">
                おすすめ育成方針
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {character.id === 'raiden-shogun' && '雷電将軍は元素爆発を軸にしたバーストDPSとして育成するのがおすすめです。元素チャージ効率を高めることで、爆発のダメージと回転率を上げましょう。また、雷元素共鳴を活かしたパーティ編成が特に効果的です。'}
                {character.id !== 'raiden-shogun' && 'このキャラクターの育成方針はまだ準備中です。'}
              </p>
            </div>
            
            {/* 天賦優先順位 */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-2">
                おすすめ天賦優先順位
              </h2>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm">
                  元素爆発 ＞ 元素スキル ＞ 通常攻撃
                </span>
              </div>
            </div>
            
            {/* 追加した武器情報 */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-2">
                おすすめ武器
              </h2>
              <div className="flex flex-wrap gap-2">
                {weapons.map((weapon, index) => (
                  <span key={index} className={`px-3 py-1 rounded-full text-sm ${
                    weapon.priority === 'best' 
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 font-medium'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}>
                    {weapon.name} {Array(weapon.rarity).fill('★').join('')}
                  </span>
                ))}
              </div>
            </div>
            
            {/* 追加した聖遺物情報 */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-2">
                おすすめ聖遺物
              </h2>
              <div className="flex flex-wrap gap-2">
                {artifactSets.map((set, index) => (
                  <span key={index} className={`px-3 py-1 rounded-full text-sm ${
                    set.priority === 'best' 
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 font-medium'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}>
                    {set.name} {set.pieces[0]}セット
                  </span>
                ))}
              </div>
              <div className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
                <span className="font-medium">推奨メインステータス: </span>
                <span>砂=元素チャージ効率%, 杯=雷元素ダメージ%, 冠=会心率/会心ダメージ</span>
              </div>
            </div>
            
            {/* 追加したパーティ情報 */}
            <div>
              <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-2">
                おすすめパーティ
              </h2>
              <div className="flex flex-wrap gap-2">
                {recommendedTeams.map((team, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm">
                    {team.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 武器セクション (先に表示) */}
      {guide.weapons && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-amber-200/40 dark:border-amber-800/30 mb-8 p-6">
          <h2 className="text-xl font-bold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
            <i className="fas fa-sword mr-2 text-amber-600 dark:text-amber-500"></i>
            おすすめ武器
          </h2>
          
          <div className="space-y-4">
            {guide.weapons.map((weapon) => (
              <div 
                key={weapon.id}
                className={`p-4 rounded-lg border ${
                  weapon.priority === 'best' 
                    ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20' 
                    : weapon.priority === 'good'
                      ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center">
                  <div className="relative w-16 h-16 mr-4 flex-shrink-0">
                    <SafeImage
                      src={weapon.imageUrl}
                      alt={weapon.name}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800 dark:text-gray-200">
                        {weapon.name}
                      </h3>
                      <span className="text-amber-600 dark:text-amber-500">
                        {Array(weapon.rarity).fill('★').join('')}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        weapon.priority === 'best' 
                          ? 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200' 
                          : weapon.priority === 'good'
                            ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {weapon.priority === 'best' ? '最適' : weapon.priority === 'good' ? '優良' : '代替'}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {weapon.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 聖遺物セクション (後に表示) */}
      {guide.artifacts && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-amber-200/40 dark:border-amber-800/30 mb-8 p-6">
          <h2 className="text-xl font-bold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
            <i className="fas fa-gem mr-2 text-amber-600 dark:text-amber-500"></i>
            おすすめ聖遺物
          </h2>
          
          <div className="space-y-4">
            {guide.artifacts.map((set) => (
              <div 
                key={set.id}
                className={`p-4 rounded-lg border ${
                  set.priority === 'best' 
                    ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20' 
                    : set.priority === 'good'
                      ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-800 dark:text-gray-200">
                        {set.name}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        set.priority === 'best' 
                          ? 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200' 
                          : set.priority === 'good'
                            ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {set.priority === 'best' ? '最適' : set.priority === 'good' ? '優良' : '代替'}
                      </span>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      {set.pieces.map((piece, index) => (
                        <div key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                          <span className="font-medium mr-2">{piece}セット効果:</span>
                          <span>{set.bonus[index]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 bg-white/50 dark:bg-gray-900/30 p-2 rounded text-gray-700 dark:text-gray-300 text-sm">
                  <i className="fas fa-info-circle mr-1 text-amber-600 dark:text-amber-500"></i>
                  {set.notes}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* おすすめパーティーセクション */}
      {guide.teams && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-amber-200/40 dark:border-amber-800/30 mb-8 p-6">
          <h2 className="text-xl font-bold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
            <i className="fas fa-users mr-2 text-amber-600 dark:text-amber-500"></i>
            おすすめパーティー編成
          </h2>
          
          <div className="space-y-6">
            {guide.teams.map((team) => (
              <div key={team.id} className="p-4 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20">
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">
                  {team.name}
                </h3>
                
                <div className="mb-3">
                  <div className="flex flex-wrap gap-3 mb-2">
                    {/* チームメンバー表示 - getCharacterIconUrlを使用 */}
                    {team.characters.map((charId, index) => (
                      <div key={index} className="w-16 h-16 relative bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden border border-amber-200 dark:border-amber-800">
                        <SafeImage
                          src={getCharacterIconUrl(charId)}
                          alt={charId}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300">
                  {team.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* キャラクターの使い方セクション */}
      {guide.usage && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-amber-200/40 dark:border-amber-800/30 mb-8 p-6">
          <h2 className="text-xl font-bold mb-6 text-amber-700 dark:text-amber-400 flex items-center">
            <i className="fas fa-gamepad mr-2 text-amber-600 dark:text-amber-500"></i>
            キャラクターの使い方
          </h2>
          
          {guide.usage.intro && (
            <p className="mb-6 text-gray-700 dark:text-gray-300">{guide.usage.intro}</p>
          )}
          
          <div className="space-y-10">
            {guide.usage.sections.map((section) => (
              <div key={section.id} className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 to-indigo-500 rounded-full"></div>
                <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-400 flex items-center">
                  <i className={`fas ${section.id.includes('skill') ? 'fa-magic' : section.id.includes('burst') ? 'fa-meteor' : 'fa-star'} mr-2`}></i>
                  {section.title}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/30">
                    <div className="relative aspect-video mb-3 overflow-hidden rounded-lg bg-black/10">
                      <SafeImage
                        src={section.imageUrl}
                        alt={section.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: section.description.replace(/([^>])\n/g, '$1<br/>') }}></p>
                  </div>
                  
                  {section.additionalInfo && (
                    <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200/40 dark:border-blue-800/20">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                        追加情報
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">{section.additionalInfo}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* 戦闘サイクル解説 */}
          {guide.usage.comboCycle && (
            <div className="mt-8 p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl border border-amber-200/40 dark:border-amber-800/30">
              <h3 className="text-lg font-semibold mb-3 text-amber-700 dark:text-amber-400 flex items-center">
                <i className="fas fa-sync-alt mr-2"></i>
                理想的な戦闘サイクル
              </h3>
              
              <ol className="relative border-l-2 border-amber-500 dark:border-amber-700 ml-3 space-y-6 py-2">
                {guide.usage.comboCycle.steps.map((step, index) => (
                  <li key={index} className="ml-6">
                    <div className="absolute -left-3 w-6 h-6 bg-amber-500 dark:bg-amber-700 rounded-full flex items-center justify-center text-white">{index + 1}</div>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{step.title}</span>：{step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Q&Aセクション */}
      {guide.qa && guide.qa.length > 0 && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-amber-200/40 dark:border-amber-800/30 mb-8 p-6">
          <h2 className="text-xl font-bold mb-6 text-amber-700 dark:text-amber-400 flex items-center">
            <i className="fas fa-question-circle mr-2 text-amber-600 dark:text-amber-500"></i>
            よくある質問（Q&A）
          </h2>
          
          <div className="space-y-6">
            {guide.qa.map((item, index) => (
              <div key={index} className={index < guide.qa!.length - 1 ? "border-b border-amber-200/40 dark:border-amber-800/30 pb-4" : ""}>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200 flex items-start gap-2">
                  <span className="flex-shrink-0 w-7 h-7 bg-amber-500 dark:bg-amber-600 rounded-full text-white flex items-center justify-center">Q</span>
                  <span>{item.question}</span>
                </h3>
                <div className="pl-9">
                  <p className="text-gray-700 dark:text-gray-300">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 余談：便利な使い方・豆知識 */}
      {guide.tips && guide.tips.length > 0 && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-amber-200/40 dark:border-amber-800/30 mb-8 p-6">
          <div className="border-b border-amber-200/50 dark:border-amber-800/30 pb-4 mb-6">
            <h2 className="text-xl font-bold mb-1 text-amber-700 dark:text-amber-400 flex items-center">
              <i className="fas fa-lightbulb mr-2 text-amber-600 dark:text-amber-500"></i>
              余談：便利な使い方・豆知識
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              ここからは{character.name}をより楽しむための追加情報です。攻略の本筋ではありませんが、知っておくと役立つ小技や特殊な使い方を紹介します。
            </p>
          </div>
          
          <div className="space-y-6">
            {guide.tips.map((tip) => {
              // 背景色のランダム選択（見た目上のバリエーション）
              const backgrounds = [
                'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800/30',
                'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800/30',
                'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800/30',
                'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800/30',
              ];
              const bgIndex = tip.id.charCodeAt(0) % backgrounds.length;
              const bgClass = backgrounds[bgIndex];
              
              // アイコンのランダム選択（見た目上のバリエーション）
              const icons = ['fa-lightbulb', 'fa-magic', 'fa-star', 'fa-cog', 'fa-bolt', 'fa-leaf'];
              const iconIndex = tip.id.charCodeAt(0) % icons.length;
              const icon = tip.icon || icons[iconIndex];
              
              return (
                <div 
                  key={tip.id} 
                  className={`bg-gradient-to-r ${bgClass} rounded-lg p-4 border`}
                >
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                    <i className={`fas ${icon} mr-2`}></i>
                    {tip.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {tip.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* おすすめYouTube動画 */}
      {guide.recommendedVideos && guide.recommendedVideos.length > 0 && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-amber-200/40 dark:border-amber-800/30 mb-8 p-6">
          <h2 className="text-xl font-bold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
            <i className="fab fa-youtube mr-2 text-red-600"></i>
            おすすめYouTube動画
          </h2>
          
          <div className="space-y-6">
            {/* 動画リストをグリッドで表示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guide.recommendedVideos.map((video, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800/70 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700/50 hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-full aspect-video bg-black">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <i className="fab fa-youtube text-5xl text-red-600 mb-2"></i>
                      <p className="text-center px-4">{video.title}</p>
                      <div className="mt-3 px-4 py-1 bg-red-600 rounded-full text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer">
                        YouTubeで視聴
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">{video.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      チャンネル：{video.channelName} / 再生回数：{video.views} / {video.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 命の星座セクション */}
      {character.constellations && guide.constellationRatings && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-amber-200/40 dark:border-amber-800/30 mb-8 p-6">
          <h2 className="text-xl font-bold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
            <i className="fas fa-star mr-2 text-amber-600 dark:text-amber-500"></i>
            命の星座
          </h2>
          
          <div className="space-y-4">
            {character.constellations.map((constellation) => {
              // コンステレーションのレーティングをガイドデータから取得
              const rating = guide.constellationRatings?.[constellation.level] || 2; // デフォルトは2星
              
              // おすすめ度のラベル
              const ratingLabel = rating >= 4 
                ? <span className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full animate-pulse">超おすすめ！</span>
                : rating >= 3
                  ? <span className="ml-2 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full">おすすめ！</span>
                  : null;
              
              return (
                <div key={constellation.level} className="bg-amber-50/50 dark:bg-amber-900/10 rounded-lg overflow-hidden">
                  <div className={`bg-amber-100/80 dark:bg-amber-800/30 px-4 py-3 flex items-center`}>
                    <div className="w-8 h-8 bg-amber-400/90 dark:bg-amber-600/90 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {constellation.level}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center flex-wrap">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                          {constellation.name}
                        </h3>
                        <div className="ml-3 flex items-center">
                          {/* 凸おすすめ度（星表示） */}
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fas fa-star text-xs ${
                              i < rating 
                                ? 'text-amber-500' 
                                : 'text-gray-300 dark:text-gray-600'
                            } mr-0.5`}></i>
                          ))}
                        </div>
                        {ratingLabel}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {constellation.description}
                    </p>
                    <div className="bg-amber-100/50 dark:bg-amber-900/20 p-3 rounded-lg">
                      <p className="text-amber-800 dark:text-amber-300 font-medium">
                        <i className="fas fa-check-circle mr-2"></i>
                        {constellation.effect}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 凸おすすめ度の説明 */}
          <div className="mt-6 bg-gray-50/80 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700/30">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <i className="fas fa-info-circle mr-2 text-blue-500"></i>
              凸おすすめ度について
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              凸おすすめ度は、キャラクターの性能向上における各凸の重要度を示しています。
              星5つは「必須級」、星4つは「大幅強化」、星3つは「良い強化」、星2つは「小幅強化」、星1つは「効果小」を意味します。
              課金の優先順位を決める際の参考にしてください。
            </p>
          </div>
        </div>
      )}

      {/* コメントセクション */}
      <CommentSection pageId={`character-guide-${character.id}`} />
    </main>
  );
} 