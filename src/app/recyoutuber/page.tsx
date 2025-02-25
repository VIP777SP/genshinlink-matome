'use client';

import { useState } from "react";
import FavoriteButton from "@/components/FavoriteButton";
import CommentSection from "@/components/CommentSection";
import { useSound } from "@/components/SoundService";

// YouTuberデータ
const youtuberList = [
  {
    id: "fobm4ster",
    name: "fobm4ster",
    url: "https://www.youtube.com/c/fobm4ster",
    description: "英語圏で人気の原神攻略系YouTuber。深い理論検証やキャラクター解説、アビス攻略などを投稿。様々なパーティー編成の提案も参考になります。",
    category: "海外系",
    tags: ["理論検証", "キャラ解説", "アビス"]
  },
  {
    id: "takagg",
    name: "Taka GG",
    url: "https://www.youtube.com/c/takagg",
    description: "英語圏で最も人気のある原神YouTuberの一人。イベント攻略や素材ファーミングのルートなど、わかりやすく簡潔な解説が特徴です。",
    category: "海外系",
    tags: ["イベント攻略", "素材集め", "ガイド"]
  },
  {
    id: "zyox",
    name: "Zyox",
    url: "https://www.youtube.com/c/Zyox",
    description: "キャラクターのビルド解説やチーム編成の提案に特化した海外YouTuber。最新のメタ解説やキャラクターの使い方を詳細に解説しています。",
    category: "海外系",
    tags: ["ビルド解説", "チーム編成", "メタ解説"]
  },
  {
    id: "rank-king",
    name: "ランク王国",
    url: "https://www.youtube.com/c/rankingdom",
    description: "日本の原神攻略系チャンネル。キャラクターの使い方やアビス攻略など、日本語で詳しく解説しています。初心者から上級者まで役立つ情報が満載。",
    category: "日本語系",
    tags: ["キャラ解説", "アビス攻略", "初心者向け"]
  },
  {
    id: "gacha-gamer",
    name: "ガチャゲーマー",
    url: "https://www.youtube.com/c/gachagamer",
    description: "ガチャの確率検証や最新アップデート情報など、ゲームのメカニクスに焦点を当てた動画を配信。データに基づいた客観的な情報が特徴です。",
    category: "日本語系",
    tags: ["ガチャ分析", "アップデート情報", "検証"]
  },
  {
    id: "dish",
    name: "Dish",
    url: "https://www.youtube.com/c/dish",
    description: "原神のストーリー考察や伏線解説に特化したYouTuber。世界観やキャラクターの背景などを深く掘り下げた動画は、ストーリーファンにおすすめです。",
    category: "海外系",
    tags: ["ストーリー考察", "世界観解説", "伏線"]
  },
  {
    id: "mogawty",
    name: "Mogawty",
    url: "https://www.youtube.com/c/mogawty",
    description: "ユニークなチャレンジ動画や面白い企画が特徴のエンターテイメント系原神YouTuber。楽しみながら原神の知識も深められる動画が多いです。",
    category: "海外系",
    tags: ["チャレンジ", "エンターテイメント", "企画もの"]
  },
  {
    id: "sekapoko",
    name: "Sekapoko",
    url: "https://www.youtube.com/c/sekapoko",
    description: "長時間のストリーミングや詳細なキャラクターガイドで知られる海外YouTuber。初心者向けの丁寧な解説から上級者向けの理論検証まで幅広く対応。",
    category: "海外系",
    tags: ["ライブ配信", "キャラガイド", "初心者向け"]
  },
  {
    id: "genshin-matome",
    name: "原神まとめch",
    url: "https://www.youtube.com/c/genshin-matome",
    description: "最新情報やリーク情報をコンパクトにまとめた日本語チャンネル。新キャラクターの情報や今後のアップデート内容などをいち早く知ることができます。",
    category: "日本語系",
    tags: ["情報まとめ", "リーク", "アップデート"]
  }
];

export default function RecYoutuber() {
  const [filter, setFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const { playSound } = useSound();
  
  // カテゴリ一覧を取得
  const categories = ["all", ...new Set(youtuberList.map(youtuber => youtuber.category))];
  
  // タグ一覧を取得（重複を除去）
  const allTags = Array.from(new Set(youtuberList.flatMap(youtuber => youtuber.tags)));
  
  // フィルター適用
  const filteredYoutubers = youtuberList.filter(youtuber => {
    // カテゴリフィルター
    const categoryMatch = filter === "all" || youtuber.category === filter;
    
    // タグフィルター
    const tagMatch = !tagFilter || youtuber.tags.includes(tagFilter);
    
    return categoryMatch && tagMatch;
  });

  return (
    <main className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-amber-700 dark:text-amber-500">
          【おすすめYouTuber】
        </h1>
        <FavoriteButton 
          id="recyoutuber-page"
          title="おすすめYouTuber"
          url="/recyoutuber"
          category="リンク集"
        />
      </div>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        原神についての役立つ情報や面白い動画を投稿しているYouTuberをご紹介します。
        攻略情報やストーリー考察、エンターテイメントなど、様々なタイプのコンテンツが見つかります！
      </p>
      
      {/* カテゴリフィルター */}
      <div className="mb-6">
        <div className="flex flex-col space-y-4">
          <div>
            <span className="text-gray-700 dark:text-gray-300 font-medium mr-2">カテゴリ:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setFilter(category);
                    playSound('click');
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filter === category
                      ? 'bg-amber-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-200 dark:hover:bg-amber-900'
                  }`}
                >
                  {category === "all" ? "すべて表示" : category}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <span className="text-gray-700 dark:text-gray-300 font-medium mr-2">タグ:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                onClick={() => {
                  setTagFilter(null);
                  playSound('click');
                }}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  tagFilter === null
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-200 dark:hover:bg-amber-900'
                }`}
              >
                すべてのタグ
              </button>
              
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setTagFilter(tag);
                    playSound('click');
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    tagFilter === tag
                      ? 'bg-amber-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-200 dark:hover:bg-amber-900'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* YouTuberリスト */}
      <div className="space-y-6">
        {filteredYoutubers.length === 0 ? (
          <div className="text-center p-8 bg-amber-50 dark:bg-gray-800 rounded-lg">
            <i className="fas fa-search text-amber-400 text-4xl mb-4"></i>
            <p className="text-gray-700 dark:text-gray-300">条件に一致するYouTuberが見つかりませんでした。</p>
            <button
              onClick={() => {
                setFilter("all");
                setTagFilter(null);
                playSound('click');
              }}
              className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              フィルターをリセット
            </button>
          </div>
        ) : (
          filteredYoutubers.map(youtuber => (
            <section 
              key={youtuber.id} 
              className="border border-amber-200 dark:border-amber-900 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="flex justify-between">
                <a 
                  href={youtuber.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSound('click')}
                  className="text-xl font-bold text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-300 transition-colors flex items-center"
                >
                  <i className="fab fa-youtube text-red-600 mr-2"></i>
                  {youtuber.name} <i className="fas fa-external-link-alt text-sm ml-1"></i>
                </a>
                <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs px-2 py-1 rounded">
                  {youtuber.category}
                </span>
              </div>
              
              <p className="mt-2 text-gray-700 dark:text-gray-300">{youtuber.description}</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {youtuber.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
                    onClick={() => {
                      setTagFilter(tag);
                      playSound('click');
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  YouTubeチャンネルを開く際は、サイトのガイドラインに従って利用してください。
                </span>
                <FavoriteButton 
                  id={`youtuber-${youtuber.id}`}
                  title={youtuber.name}
                  url={youtuber.url}
                  category="YouTuber"
                />
              </div>
            </section>
          ))
        )}
      </div>
      
      {/* コメントセクション */}
      <CommentSection pageId="recyoutuber" />
    </main>
  );
} 