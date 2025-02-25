'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSound } from '@/components/SoundService';
import FavoriteButton from '@/components/FavoriteButton';
import CommentSection from '@/components/CommentSection';

// ニュースの型定義
type NewsCategory = 'アップデート' | 'イベント' | 'バナー' | 'コラボ' | 'その他';

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  date: string;
  imageUrl: string;
  source?: string;
  sourceUrl?: string;
  important?: boolean;
};

// サンプルニュースデータ
const newsData: NewsItem[] = [
  {
    id: 'update-4-5',
    title: 'バージョン4.5「命途まとう蘭生」アップデート情報',
    summary: '新キャラクター「嘉明」と「闌珊」が登場！新たなイベントや機能も追加されます。',
    content: `## 新キャラクター
- ★5 草元素・長柄武器「嘉明」
- ★4 岩元素・法器「闌珊」

## 新イベント
- 「花と蝶の出会い」主要イベント
- 「幽谷に伝わる伝説」ストーリークエスト
- 「スメールの知恵試し」バトルイベント

## システム更新
- デッキ編集機能の改善
- UI/UX調整
- バグ修正と性能向上`,
    category: 'アップデート',
    date: '2024-03-13',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/f/fa/Version_4.5_Promotional_Art.jpg',
    important: true
  },
  {
    id: 'banner-xianyun',
    title: '祈願「白鷺の庭」開催中',
    summary: '限定5★キャラクター「闲云」が期間限定で登場！',
    content: `## 「白鷺の庭」期間限定祈願
期間: 2024年3月13日〜2024年4月2日

## ピックアップキャラクター
- ★5 風元素・法器「闲云」※期間限定
- ★4 岩元素・法器「闌珊」
- ★4 氷元素・弓「ファルザン」
- ★4 炎元素・大剣「辛炎」

## 注意事項
- 「闲云」は今回の期間限定祈願でのみ入手可能です
- 次回の再登場時期は未定です
- 「祈願履歴」で自分の天井カウントを確認できます`,
    category: 'バナー',
    date: '2024-03-13',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/b/bd/Wanderer_Xianyun%27s_Jade_Flute_Wish_Banner.jpg'
  },
  {
    id: 'event-lantern-rite',
    title: '2024年「海灯祭」イベント開催のお知らせ',
    summary: '璃月の一大イベント「海灯祭」が今年も開催！豪華報酬や限定コンテンツをお見逃しなく。',
    content: `## 「海灯祭」イベント概要
期間: 2024年2月3日〜2024年2月18日

## 主なイベントコンテンツ
- 「天の聖火」ミニゲーム
- 「千灯の夜」パレードイベント
- 「璃月の伝承」ストーリークエスト

## 報酬
- 原石 × 1000以上
- 「璃月の祝福」限定風飾り
- 「闲云」または「雲菫」「北斗」「行秋」「重雲」「辛炎」「凝光」「香菱」から1名を選んで入手可能
- 期間限定家具セット
- 限定グライダー「金風玉露」`,
    category: 'イベント',
    date: '2024-02-01',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/8/83/Event_Fleeting_Colors_in_Flight.png'
  },
  {
    id: 'collab-kfc',
    title: 'KFCコラボレーション再開催のお知らせ',
    summary: '大人気だったKFCとのコラボレーションが再開催決定！限定グライダーを入手するチャンス！',
    content: `## KFCコラボレーション再開催
期間: 2024年5月10日〜2024年6月10日

## 入手方法
対象のKFC店舗で「原神コラボセット」を購入すると、限定アイテムコードが付与されます。
※一部地域のみでの開催となります。詳細は公式サイトをご確認ください。

## 入手可能アイテム
- 限定風装備「ふわとり」
- 限定料理レシピ「バーベキューチキン」
- 限定家具「KFCバケツ」
- 原石 × 300`,
    category: 'コラボ',
    date: '2024-04-15',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/c/c9/KFC_Collaboration_Artwork.jpg'
  },
  {
    id: 'update-4-6-leaks',
    title: 'バージョン4.6の情報がリーク',
    summary: '次期アップデートの情報が一部リーク。新キャラクターや新地域の噂も。',
    content: `## リーク情報について
※以下の情報はリークに基づくものであり、正式発表までは変更の可能性があります。

## リークされた新キャラクター
- ★5 水元素・片手剣「セノ」（名前仮）
- ★4 雷元素・法器「チヅル」（名前仮）

## 予想されるイベント
- 「決戦！幻影武者」バトルイベント
- 「稲妻祭」主要イベント
- 新しいストーリークエスト

## 新機能・新エリア
- 「稲妻」の新しいサブエリア追加の噂
- ハウジングシステムの拡張機能`,
    category: 'その他',
    date: '2024-03-20',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/5/59/Version_4.0_Key_Visual.jpg'
  },
  {
    id: 'concert-2024',
    title: '原神オーケストラコンサート2024開催決定',
    summary: '世界各地で原神音楽の祭典「原神オーケストラコンサート2024」の開催が決定！',
    content: `## 原神オーケストラコンサート2024
原神の壮大な世界と感動的なストーリーを彩った素晴らしい楽曲の数々を、フルオーケストラの生演奏でお楽しみいただけます。

## 演奏予定楽曲
- 「Dawn Winery Theme」
- 「Liyue Harbor Theme」
- 「Inazuma Battle Theme」
- 「Sumeru Forest Theme」
- 「Fontaine City Theme」
- その他多数の人気楽曲

## 開催都市・日程
- 東京: 2024年7月15日
- ロサンゼルス: 2024年8月5日
- ロンドン: 2024年8月25日
- パリ: 2024年9月10日
- ソウル: 2024年9月30日

チケット販売は各公演の2ヶ月前から開始予定です。`,
    category: 'イベント',
    date: '2024-04-01',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a6/Fanfare_for_the_Opera.png'
  },
  {
    id: 'survey-rewards',
    title: 'バージョン4.4アンケート報酬配布のお知らせ',
    summary: 'バージョン4.4アンケートにご協力いただいた皆様に原石×300を配布いたします。',
    content: `## アンケート報酬配布のお知らせ
バージョン4.4に関するアンケートにご協力いただいた旅人の皆様に、感謝の気持ちを込めて原石×300を配布いたします。

## 配布期間
2024年3月25日 〜 2024年3月28日

## 受取条件
- 冒険ランク5以上
- バージョン4.4期間中にアンケートに回答した方

## 受取方法
ゲーム内メールにて報酬を受け取ることができます。
※メール受取期限は2024年3月31日までとなります。期限を過ぎると受け取れなくなりますのでご注意ください。`,
    category: 'その他',
    date: '2024-03-24',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/5/5d/Item_Primogem.png'
  }
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | NewsCategory>('all');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { playSound } = useSound();

  // URLからニュースIDを取得して初期選択
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const newsId = urlParams.get('id');
      if (newsId) {
        const news = newsData.find(n => n.id === newsId);
        if (news) {
          setSelectedNews(news);
        }
      }
    }
  }, []);

  // カテゴリーでフィルタリング
  const filteredNews = newsData
    .filter(news => selectedCategory === 'all' || news.category === selectedCategory)
    .filter(news => news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   news.summary.toLowerCase().includes(searchQuery.toLowerCase()));
  
  // カテゴリー一覧を取得（重複を排除）
  const categories: ('all' | NewsCategory)[] = ['all', ...Array.from(new Set(newsData.map(news => news.category)))];

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // マークダウン風の簡易パース
  const parseMarkdown = (text: string) => {
    // 見出し
    let parsedText = text.replace(/## (.*?)$/gm, '<h3 class="text-lg font-bold text-amber-700 dark:text-amber-400 mt-4 mb-2">$1</h3>');
    // リスト
    parsedText = parsedText.replace(/- (.*?)$/gm, '<li class="flex"><span class="mr-2">•</span>$1</li>');
    parsedText = parsedText.replace(/<\/li>\n<li/g, '</li><li');
    // 修正：s -> .*のように修正してES2018未満でも動作するように
    parsedText = parsedText.replace(/(<li.*<\/li>)/g, '<ul class="mb-4 ml-2 space-y-1">$1</ul>');
    // 段落
    // 修正：前後参照を使わないようにシンプルな正規表現に変更
    parsedText = parsedText.replace(/\n\n/g, '<br /><br />');
    parsedText = parsedText.replace(/\n/g, '<br />');
    
    return parsedText;
  };

  return (
    <main className="max-w-6xl mx-auto relative">
      {/* 背景装飾パターン */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02] pointer-events-none overflow-hidden">
        {/* 直接SVGパターンを描画 */}
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="genshin-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
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
          <rect width="100%" height="100%" fill="url(#genshin-pattern)"/>
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
            【原神ニュース】
          </h1>
        </div>
        <FavoriteButton 
          id="news-page"
          title="ニュース"
          url="/news"
          category="情報"
        />
      </div>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        原神に関する最新情報をお届けします。アップデート情報、イベント、バナー情報など、テイワット大陸の最新ニュースをチェックしましょう。
      </p>

      {selectedNews ? (
        // ニュース詳細表示
        <div className="mb-8 relative overflow-hidden animate-fadeIn">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-amber-200/50 dark:border-amber-800/40 relative z-10">
            {/* 原神風の装飾的な角の模様 */}
            <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden opacity-30">
              <div className="absolute -top-8 -left-8 w-16 h-16 border-t-4 border-l-4 border-amber-500 dark:border-amber-400 rounded-tl-xl"></div>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden opacity-30">
              <div className="absolute -top-8 -right-8 w-16 h-16 border-t-4 border-r-4 border-amber-500 dark:border-amber-400 rounded-tr-xl"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-16 h-16 overflow-hidden opacity-30">
              <div className="absolute -bottom-8 -left-8 w-16 h-16 border-b-4 border-l-4 border-amber-500 dark:border-amber-400 rounded-bl-xl"></div>
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden opacity-30">
              <div className="absolute -bottom-8 -right-8 w-16 h-16 border-b-4 border-r-4 border-amber-500 dark:border-amber-400 rounded-br-xl"></div>
            </div>
            
            <div className="flex justify-between mb-6">
              <button 
                onClick={() => {
                  setSelectedNews(null);
                  playSound('click');
                  
                  // URLからパラメータを削除
                  if (typeof window !== 'undefined') {
                    const url = new URL(window.location.href);
                    url.searchParams.delete('id');
                    window.history.pushState({}, '', url);
                  }
                }}
                className="text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-300 flex items-center"
              >
                <i className="fas fa-arrow-left mr-2"></i>ニュース一覧に戻る
              </button>
              
              <FavoriteButton 
                id={`news-${selectedNews.id}`}
                title={selectedNews.title}
                url={`/news?id=${selectedNews.id}`}
                category="ニュース"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedNews.category === 'アップデート' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  selectedNews.category === 'イベント' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  selectedNews.category === 'バナー' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                  selectedNews.category === 'コラボ' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {selectedNews.category}
                </span>
                
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <i className="far fa-calendar-alt mr-1"></i>
                  {formatDate(selectedNews.date)}
                </span>
                
                {selectedNews.important && (
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse">
                    <i className="fas fa-exclamation-circle mr-1"></i>重要
                  </span>
                )}
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-amber-800 dark:text-amber-400 mb-3">
                {selectedNews.title}
              </h2>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                {selectedNews.summary}
              </p>
            </div>
            
            <div className="mb-6 relative aspect-video w-full max-w-3xl mx-auto overflow-hidden rounded-lg shadow-md">
              {/* 画像の装飾フレーム */}
              <div className="absolute inset-0 pointer-events-none border-2 border-amber-500/20 dark:border-amber-400/20 z-10"></div>
              <div className="absolute -inset-1 blur-[1px] bg-gradient-to-br from-amber-500/10 to-orange-500/10 -z-10"></div>
              
              <Image
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                fill
                className="object-cover"
              />

              {/* 原神風コーナー装飾 */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-500/40 dark:border-amber-400/40"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-500/40 dark:border-amber-400/40"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-500/40 dark:border-amber-400/40"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-500/40 dark:border-amber-400/40"></div>
            </div>
            
            <div className="max-w-3xl mx-auto">
              {/* 内容装飾 */}
              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-amber-500/30 to-orange-500/30 rounded"></div>
                <div 
                  className="prose prose-amber dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 mb-6"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(selectedNews.content) }}
                />
              </div>
              
              {selectedNews.source && (
                <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">出典:</span> 
                  {selectedNews.sourceUrl ? (
                    <a 
                      href={selectedNews.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-600 dark:text-amber-400 hover:underline ml-1"
                    >
                      {selectedNews.source} <i className="fas fa-external-link-alt text-xs ml-1"></i>
                    </a>
                  ) : (
                    <span className="ml-1">{selectedNews.source}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* 背景装飾 */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-300/10 dark:bg-amber-700/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-300/10 dark:bg-orange-700/5 rounded-full blur-3xl -z-10"></div>
        </div>
      ) : (
        // ニュース一覧表示
        <div>
          {/* フィルターと検索 */}
          <div className="mb-6 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md border border-amber-200/40 dark:border-amber-800/30 relative overflow-hidden">
            {/* 装飾的な元素シンボル */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 opacity-[0.03] dark:opacity-[0.02] pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#FFB13B" strokeWidth="1"></circle>
                <path d="M50,5 L50,95 M5,50 L95,50 M20,20 L80,80 M20,80 L80,20" 
                      stroke="#FFB13B" strokeWidth="1"></path>
              </svg>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div>
                <h2 className="text-lg font-semibold mb-3 md:mb-0 text-amber-800 dark:text-amber-400 flex items-center">
                  <i className="fas fa-filter mr-2 text-amber-600 dark:text-amber-500"></i>
                  ニュースを絞り込む
                </h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-amber-600 text-white border border-amber-400' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-transparent'
                      }`}
                      onClick={() => {
                        setSelectedCategory(category);
                        playSound('click');
                      }}
                    >
                      {category === 'all' ? 'すべて' : category}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ニュースを検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 rounded-lg border border-amber-200 dark:border-amber-800/50 bg-white/90 dark:bg-gray-900/70 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-700"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"></i>
                  
                  {/* 装飾的なコーナー */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-amber-400/30 dark:border-amber-600/30 pointer-events-none"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-amber-400/30 dark:border-amber-600/30 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-amber-400/30 dark:border-amber-600/30 pointer-events-none"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-amber-400/30 dark:border-amber-600/30 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 主要ニュース */}
          {filteredNews.filter(news => news.important).length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
                <i className="fas fa-star mr-2 text-amber-600 dark:text-amber-500"></i>
                重要なお知らせ
                
                {/* 原神風の装飾ライン */}
                <div className="ml-3 flex-grow h-px bg-gradient-to-r from-amber-500/50 via-amber-300/30 to-transparent"></div>
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                {filteredNews
                  .filter(news => news.important)
                  .map(news => (
                    <div
                      key={news.id}
                      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl border-l-4 border-amber-500 border-y border-r border-amber-200/40 dark:border-amber-800/30 transition-all duration-300 cursor-pointer group animate-pulse-slow relative"
                      onClick={() => {
                        setSelectedNews(news);
                        playSound('click');
                        
                        // URLにパラメータを追加
                        if (typeof window !== 'undefined') {
                          const url = new URL(window.location.href);
                          url.searchParams.set('id', news.id);
                          window.history.pushState({}, '', url);
                        }
                      }}
                    >
                      {/* 角の装飾 */}
                      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-amber-500/20 dark:border-amber-400/20"></div>
                      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-amber-500/20 dark:border-amber-400/20"></div>
                      
                      <div className="grid md:grid-cols-3 gap-6 p-6">
                        <div className="md:col-span-1">
                          <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                            <Image
                              src={news.imageUrl}
                              alt={news.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </div>
                        
                        <div className="md:col-span-2 flex flex-col">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              news.category === 'アップデート' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              news.category === 'イベント' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              news.category === 'バナー' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                              news.category === 'コラボ' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                              {news.category}
                            </span>
                            
                            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <i className="far fa-calendar-alt mr-1"></i>
                              {formatDate(news.date)}
                            </span>
                            
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              <i className="fas fa-exclamation-circle mr-1"></i>重要
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-amber-800 dark:text-amber-400 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                            {news.title}
                          </h3>
                          
                          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                            {news.summary}
                          </p>
                          
                          <div className="mt-auto flex justify-end">
                            <span className="text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform flex items-center">
                              続きを読む <i className="fas fa-arrow-right ml-1"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* 一般ニュース */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
              <i className="fas fa-newspaper mr-2 text-amber-600 dark:text-amber-500"></i>
              最新ニュース
              
              {/* 原神風の装飾ライン */}
              <div className="ml-3 flex-grow h-px bg-gradient-to-r from-amber-500/50 via-amber-300/30 to-transparent"></div>
            </h2>
            
            {filteredNews.length === 0 ? (
              <div className="text-center py-10 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                <i className="fas fa-search text-4xl text-amber-400/50 dark:text-amber-600/30 mb-3"></i>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery 
                    ? `「${searchQuery}」に一致するニュースは見つかりませんでした。` 
                    : 'この条件に一致するニュースはありません。'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredNews
                  .filter(news => !news.important)
                  .map(news => (
                    <div
                      key={news.id}
                      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-amber-200/40 dark:border-amber-800/30 transition-all duration-300 hover:translate-y-[-2px] cursor-pointer group relative"
                      onClick={() => {
                        setSelectedNews(news);
                        playSound('click');
                        
                        // URLにパラメータを追加
                        if (typeof window !== 'undefined') {
                          const url = new URL(window.location.href);
                          url.searchParams.set('id', news.id);
                          window.history.pushState({}, '', url);
                        }
                      }}
                    >
                      {/* 角の装飾 */}
                      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-amber-500/20 dark:border-amber-400/20 z-10"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-amber-500/20 dark:border-amber-400/20 z-10"></div>
                      
                      <div className="relative aspect-video">
                        <Image
                          src={news.imageUrl}
                          alt={news.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 text-xs rounded-full backdrop-blur-sm ${
                              news.category === 'アップデート' ? 'bg-blue-600/80 text-white' :
                              news.category === 'イベント' ? 'bg-green-600/80 text-white' :
                              news.category === 'バナー' ? 'bg-purple-600/80 text-white' :
                              news.category === 'コラボ' ? 'bg-pink-600/80 text-white' :
                              'bg-gray-600/80 text-white'
                            }`}>
                              {news.category}
                            </span>
                            
                            <span className="text-xs text-white/90 backdrop-blur-sm bg-black/30 px-2 py-1 rounded-full">
                              {formatDate(news.date)}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-bold text-white drop-shadow-md line-clamp-2">
                            {news.title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                          {news.summary}
                        </p>
                        
                        <div className="flex justify-end">
                          <span className="text-sm text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform flex items-center">
                            続きを読む <i className="fas fa-arrow-right ml-1"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* コメントセクション */}
      <CommentSection pageId="news" />
    </main>
  );
} 