'use client';

import { useState } from "react";
import FavoriteButton from "@/components/FavoriteButton";
import CommentSection from "@/components/CommentSection";
import { useSound } from "@/components/SoundService";

// コミュニティデータ
const communityList = [
  {
    id: "discord",
    title: "公式Discord",
    url: "https://discord.com/invite/genshinimpact",
    description: "原神の公式Discordサーバー。最新情報の共有や、ユーザー同士の交流の場として活発に利用されています。",
    category: "公式コミュニティ"
  },
  {
    id: "reddit",
    title: "Reddit r/Genshin_Impact",
    url: "https://www.reddit.com/r/Genshin_Impact/",
    description: "海外の大手掲示板Redditの原神コミュニティ。攻略情報、考察、ファンアートなど様々な投稿が集まっています。",
    category: "海外コミュニティ"
  },
  {
    id: "hoyolab-community",
    title: "HoYoLAB コミュニティ",
    url: "https://www.hoyolab.com/",
    description: "miHoYo公式のゲームコミュニティサイト。イベント情報や攻略ガイド、ファン創作コンテンツが豊富に投稿されています。",
    category: "公式コミュニティ"
  },
  {
    id: "twitter",
    title: "原神公式Twitter",
    url: "https://twitter.com/genshin_7",
    description: "日本の公式Twitterアカウント。最新情報やイベント告知、キャンペーン情報などがいち早く投稿されます。",
    category: "公式コミュニティ"
  },
  {
    id: "5ch",
    title: "5ちゃんねる 原神スレ",
    url: "https://fate.5ch.net/genshin/",
    description: "日本の匿名掲示板での原神に関する様々な議論が行われるスレッド。速報性が高く、生の意見が集まります。",
    category: "日本のコミュニティ"
  },
  {
    id: "keqingmains",
    title: "KQM (KeqingMains)",
    url: "https://keqingmains.com/",
    description: "海外の有志によるキャラクター攻略と理論検証に特化したコミュニティ。詳細なデータと検証に基づいた情報を提供しています。",
    category: "海外コミュニティ"
  },
  {
    id: "genshin-lab",
    title: "原神攻略Lab",
    url: "https://genshin-lab.com/",
    description: "日本語の原神攻略サイト。初心者から上級者まで役立つ情報やガイドが充実しています。",
    category: "日本のコミュニティ"
  }
];

export default function RecCommunity() {
  const [filter, setFilter] = useState("all");
  const { playSound } = useSound();
  
  // カテゴリ一覧を取得
  const categories = ["all", ...new Set(communityList.map(community => community.category))];
  
  // フィルター適用
  const filteredCommunities = filter === "all" 
    ? communityList 
    : communityList.filter(community => community.category === filter);

  return (
    <main className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-amber-700 dark:text-amber-500">
          【原神コミュニティ】
        </h1>
        <FavoriteButton 
          id="reccommunity-page"
          title="おすすめコミュニティ"
          url="/reccommunity"
          category="リンク集"
        />
      </div>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        原神プレイヤーとの交流や情報収集に役立つコミュニティをご紹介します。
        仲間と一緒に冒険を楽しむための場として活用してください！
      </p>
      
      {/* カテゴリフィルター */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-gray-700 dark:text-gray-300 font-medium">カテゴリ:</span>
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

      {/* コミュニティリスト */}
      <div className="space-y-6">
        {filteredCommunities.map(community => (
          <section 
            key={community.id} 
            className="border border-amber-200 dark:border-amber-900 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 group"
          >
            <div className="flex justify-between">
              <a 
                href={community.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound('click')}
                className="text-xl font-bold text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
              >
                {community.title} <i className="fas fa-external-link-alt text-sm ml-1"></i>
              </a>
              <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs px-2 py-1 rounded">
                {community.category}
              </span>
            </div>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{community.description}</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                サイトを開く際は、各コミュニティのルールを確認してマナーを守って利用しましょう。
              </span>
              <FavoriteButton 
                id={`community-${community.id}`}
                title={community.title}
                url={community.url}
                category="コミュニティ"
              />
            </div>
          </section>
        ))}
      </div>
      
      {/* コメントセクション */}
      <CommentSection pageId="reccommunity" />
    </main>
  );
}
