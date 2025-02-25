'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import FavoriteButton from '@/components/FavoriteButton';
import CommentSection from '@/components/CommentSection';
import { useSound } from '@/components/SoundService';

// 地域の型定義
type Region = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  mapUrl: string;
  features: string[];
  specialties: string[];
  bosses: string[];
};

// 地域データ
const regions: Region[] = [
  {
    id: 'mondstadt',
    name: 'モンド',
    description: '自由の都。西風騎士団によって守られ、風神バルバトスの加護を受ける七つの国の一つ。美しい湖と緑豊かな平原に囲まれた、自由と詩歌の大地。',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/d/d4/Mondstadt.jpg',
    mapUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/3/3a/Map_Mondstadt.jpg',
    features: ['風龍の廃墟', 'マンゴーカーニ峡谷', '千風神殿', 'ドーンウィネリー', '星躍湖'],
    specialties: ['セシリアの花', '風車アスター', 'ヴァルベリー', '慕風のマッシュルーム'],
    bosses: ['風魔龍・ストームテラー', '北風の狼', '無相の風', '無相の氷']
  },
  {
    id: 'liyue',
    name: '璃月',
    description: '契約の港。岩神モラクスの統治の下、商業と交易で栄える七つの国の一つ。険しい山脈と豊かな港を持つ、富と契約の大地。',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/3/3a/Location_Liyue_Harbor.png',
    mapUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/e/e0/Map_Liyue.jpg',
    features: ['璃月港', '望舒旅館', '帰離原', '絶雲の間', '琥牢山'],
    specialties: ['琉璃百合', '星螺', 'グラスロータス', '夜泊石', '絶雲の唐辛子'],
    bosses: ['岩龍', '古岩龍・覚醒', '無相の岩', '無相の雷', '公子']
  },
  {
    id: 'inazuma',
    name: '稲妻',
    description: '永遠の国。雷神バアル・エイの統治の下、鎖国政策を敷いている七つの国の一つ。雷と嵐に覆われた、孤立と追求の群島。',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/d/d6/Location_Inazuma_City.png',
    mapUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/b/b9/Map_Inazuma.png',
    features: ['鳴神大社', '天守閣', '九条陣屋', '藤原宮', '鳴神島'],
    specialties: ['鳴草', '海霊芝', '晶化骨髄', '緋櫻毬', 'アマクモ草'],
    bosses: ['無相の雷', '恒常機関アレイ', '雷電の影', '魔偶剣鬼']
  },
  {
    id: 'sumeru',
    name: 'スメール',
    description: '知恵の森。草神クラニカルの加護を受ける、学問と自然が調和した七つの国の一つ。豊かな森と広大な砂漠が共存する、知識と叡智の大地。',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/1/10/Sumeru_City.jpg',
    mapUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/2/2f/Map_Sumeru.png',
    features: ['スメール都市', 'アケーデミア', '雨林', 'バザール', '砂漠地帯'],
    specialties: ['パドススターライト', 'ルクカクラス', 'ニル蓮', 'スメールローズ', '砂納果'],
    bosses: ['草原賢王', '乾慧の守護神', '無相の草', '半永久統制機関']
  },
  {
    id: 'fontaine',
    name: 'フォンテーヌ',
    description: '裁きの国。水神フォカロルスの統治の下、法と秩序が重んじられている七つの国の一つ。水中都市と先進技術を持つ、公正と芸術の大地。',
    imageUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/b/bb/Fontaine_Court_of_Fontaine_2.png',
    mapUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/6/6f/Map_Fontaine.png',
    features: ['フォンテーヌ法廷', 'オペラハウス', '潜水艇港', '時計塔', '水源地'],
    specialties: ['星蘭', 'ロミの実', 'ルミトワール', 'マールヴェの実', '泡沫キノコ'],
    bosses: ['渓谷に巣食う不浄', '無相の水', '水底に潜む古樹', '幽谷幽谷の古龍']
  },
];

export default function MapsPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'specialties' | 'bosses'>('description');
  const [mapScale, setMapScale] = useState(100);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSound();

  // マップのドラッグ機能のための状態
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [initialTouchDistance, setInitialTouchDistance] = useState(0);

  // リセット処理
  const resetMapView = () => {
    setMapScale(100);
    setMapPosition({ x: 0, y: 0 });
    playSound('click');
  };

  // タッチイベントのためのハンドラー
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // ピンチジェスチャーの開始
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setInitialTouchDistance(distance);
    } else if (e.touches.length === 1) {
      // 通常のドラッグ
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - mapPosition.x,
        y: e.touches[0].clientY - mapPosition.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // ピンチズーム
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      // 初期距離からの比率を計算してスケールを調整
      const scaleFactor = distance / initialTouchDistance;
      const newScale = Math.min(Math.max(mapScale * scaleFactor, 50), 200);
      setMapScale(newScale);
      setInitialTouchDistance(distance);
    } else if (isDragging && e.touches.length === 1) {
      // マップのドラッグ移動
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      setMapPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setInitialTouchDistance(0);
  };

  // マウスイベントのためのハンドラー
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - mapPosition.x,
      y: e.clientY - mapPosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setMapPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // ホイールズーム
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    // ズームイン/アウト（ホイールのデルタに応じて調整）
    const delta = -Math.sign(e.deltaY) * 5;
    const newScale = Math.min(Math.max(mapScale + delta, 50), 200);
    setMapScale(newScale);
  };

  // マウスがマップコンテナから離れた時
  useEffect(() => {
    const handleMouseLeave = () => {
      setIsDragging(false);
    };

    const mapContainer = mapContainerRef.current;
    if (mapContainer) {
      mapContainer.addEventListener('mouseleave', handleMouseLeave);
      // ホイールイベントのデフォルト動作を防ぐ
      mapContainer.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
    }

    return () => {
      if (mapContainer) {
        mapContainer.removeEventListener('mouseleave', handleMouseLeave);
        mapContainer.removeEventListener('wheel', (e) => e.preventDefault());
      }
    };
  }, []);

  // レンダリング
  return (
    <main className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-700 dark:text-amber-500">
          【冒険者の地図帖】
        </h1>
        <FavoriteButton 
          id="maps-page"
          title="マップ"
          url="/maps"
          category="攻略情報"
        />
      </div>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        テイワットの広大な世界を探索しましょう。各地域の詳細マップや特産品の場所、ボスの出現場所などを確認できます。
      </p>

      {selectedRegion ? (
        <div className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-amber-200/40 dark:border-amber-800/30 animate-fadeIn overflow-hidden">
          <div className="flex justify-between mb-4">
            <button 
              onClick={() => {
                setSelectedRegion(null);
                resetMapView();
                playSound('click');
              }}
              className="text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-300 flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>地域選択に戻る
            </button>
            <FavoriteButton 
              id={`map-${selectedRegion.id}`}
              title={`${selectedRegion.name}のマップ`}
              url={`/maps?region=${selectedRegion.id}`}
              category="マップ"
            />
          </div>

          <h2 className="text-2xl font-bold mb-3 text-amber-700 dark:text-amber-400 flex items-center">
            <i className="fas fa-map-marked-alt mr-2 text-amber-600 dark:text-amber-500"></i>
            {selectedRegion.name}
          </h2>

          {/* タブナビゲーション */}
          <div className="flex overflow-x-auto mb-4 pb-1 no-scrollbar">
            <button
              className={`px-4 py-2 rounded-t-lg mr-1 ${
                activeTab === 'description'
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
              }`}
              onClick={() => {
                setActiveTab('description');
                playSound('click');
              }}
            >
              <i className="fas fa-info-circle mr-1"></i>概要
            </button>
            <button
              className={`px-4 py-2 rounded-t-lg mr-1 ${
                activeTab === 'features'
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
              }`}
              onClick={() => {
                setActiveTab('features');
                playSound('click');
              }}
            >
              <i className="fas fa-landmark mr-1"></i>名所
            </button>
            <button
              className={`px-4 py-2 rounded-t-lg mr-1 ${
                activeTab === 'specialties'
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
              }`}
              onClick={() => {
                setActiveTab('specialties');
                playSound('click');
              }}
            >
              <i className="fas fa-leaf mr-1"></i>特産品
            </button>
            <button
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === 'bosses'
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
              }`}
              onClick={() => {
                setActiveTab('bosses');
                playSound('click');
              }}
            >
              <i className="fas fa-dragon mr-1"></i>ボス
            </button>
          </div>

          {/* タブコンテンツ */}
          <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg mb-4 border border-amber-100 dark:border-amber-900/30">
            {activeTab === 'description' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg shadow-md border border-amber-100 dark:border-amber-900/30">
                    <div className="relative w-full h-48 overflow-hidden rounded">
                      <Image
                        src={selectedRegion.imageUrl}
                        alt={selectedRegion.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold mb-3 text-amber-800 dark:text-amber-400">
                    {selectedRegion.name} について
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {selectedRegion.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-amber-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-700/80 p-3 rounded-lg shadow-sm border border-amber-100 dark:border-amber-900/30">
                      <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-1">
                        <i className="fas fa-landmark mr-2 text-amber-600/80 dark:text-amber-500/80"></i>
                        主要な名所
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                        {selectedRegion.features.slice(0, 3).map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-700/80 p-3 rounded-lg shadow-sm border border-amber-100 dark:border-amber-900/30">
                      <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-1">
                        <i className="fas fa-leaf mr-2 text-amber-600/80 dark:text-amber-500/80"></i>
                        特産品
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                        {selectedRegion.specialties.slice(0, 3).map((specialty, index) => (
                          <li key={index}>{specialty}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-amber-800 dark:text-amber-400">
                  <i className="fas fa-landmark mr-2 text-amber-600/80 dark:text-amber-500/80"></i>
                  {selectedRegion.name}の名所
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedRegion.features.map((feature, index) => (
                    <div key={index} className="bg-gradient-to-br from-amber-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-700/80 p-3 rounded-lg shadow-sm border border-amber-100 dark:border-amber-900/30">
                      <h4 className="font-medium text-amber-700 dark:text-amber-400">
                        {feature}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        マップ内の主要な名所の一つです。探索時にワープポイントを解放しておくと便利です。
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specialties' && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-amber-800 dark:text-amber-400">
                  <i className="fas fa-leaf mr-2 text-amber-600/80 dark:text-amber-500/80"></i>
                  {selectedRegion.name}の特産品
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedRegion.specialties.map((specialty, index) => (
                    <div key={index} className="bg-gradient-to-br from-amber-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-700/80 p-3 rounded-lg shadow-sm border border-amber-100 dark:border-amber-900/30">
                      <h4 className="font-medium text-amber-700 dark:text-amber-400">
                        {specialty}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        キャラクター育成に重要な素材です。定期的に採取して素材を貯めておきましょう。
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 italic">
                  ※特産品は48時間経過後に再生成されます。Discordの「なつめっこ」などのボットで採集ルートを確認できます。
                </p>
              </div>
            )}

            {activeTab === 'bosses' && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-amber-800 dark:text-amber-400">
                  <i className="fas fa-dragon mr-2 text-amber-600/80 dark:text-amber-500/80"></i>
                  {selectedRegion.name}のボス
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedRegion.bosses.map((boss, index) => (
                    <div key={index} className="bg-gradient-to-br from-amber-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-700/80 p-3 rounded-lg shadow-sm border border-amber-100 dark:border-amber-900/30">
                      <h4 className="font-medium text-amber-700 dark:text-amber-400">
                        {boss}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        キャラクターの突破素材やアイテムを入手できるボスです。週ボスは週に1回、その他は花粉を消費して何度でも挑戦できます。
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 italic">
                  ※週ボスは月曜日4時にリセットされます。最初の3体は30花粉、4体目以降は60花粉必要です。
                </p>
              </div>
            )}
          </div>

          {/* インタラクティブマップ */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400">
                <i className="fas fa-map mr-2 text-amber-600/80 dark:text-amber-500/80"></i>
                インタラクティブマップ
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetMapView}
                  className="text-xs px-2 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                  title="マップをリセット"
                >
                  <i className="fas fa-sync-alt mr-1"></i>
                  リセット
                </button>
                <div className="flex items-center bg-white dark:bg-gray-700 rounded px-2 py-1">
                  <button
                    onClick={() => {
                      const newScale = Math.max(mapScale - 10, 50);
                      setMapScale(newScale);
                      playSound('click');
                    }}
                    className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400"
                    title="縮小"
                  >
                    <i className="fas fa-search-minus"></i>
                  </button>
                  <span className="text-xs mx-2 text-gray-700 dark:text-gray-300">{mapScale}%</span>
                  <button
                    onClick={() => {
                      const newScale = Math.min(mapScale + 10, 200);
                      setMapScale(newScale);
                      playSound('click');
                    }}
                    className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400"
                    title="拡大"
                  >
                    <i className="fas fa-search-plus"></i>
                  </button>
                </div>
              </div>
            </div>

            <div
              ref={mapContainerRef}
              className="bg-amber-50 dark:bg-gray-900 rounded-lg border border-amber-100 dark:border-amber-900/30 overflow-hidden relative h-[500px] flex items-center justify-center cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              style={{
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              <p className="absolute top-2 left-2 text-xs bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded text-gray-600 dark:text-gray-400 z-10">
                <i className="fas fa-info-circle mr-1"></i>
                ドラッグで移動、ホイールまたはピンチでズーム
              </p>
              
              <div
                style={{
                  transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapScale / 100})`,
                  transformOrigin: 'center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
                className="relative"
              >
                <Image
                  src={selectedRegion.mapUrl}
                  alt={`${selectedRegion.name}のマップ`}
                  width={800}
                  height={800}
                  className="pointer-events-none"
                />
              </div>
            </div>
            
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
              ※より詳細なマップは「原神インタラクティブマップ」や「HoYoLAB」などの外部ツールをご利用ください。
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {regions.map(region => (
            <div
              key={region.id}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl 
                       border border-amber-200/40 dark:border-amber-800/30 transition-all duration-300 
                       hover:scale-105 cursor-pointer group"
              onClick={() => {
                setSelectedRegion(region);
                playSound('click');
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={region.imageUrl}
                  alt={region.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                    {region.name}
                  </h3>
                  <div className="flex space-x-1">
                    <span className="px-2 py-1 text-xs bg-amber-600/80 rounded text-white backdrop-blur-sm">
                      {region.features.length} 名所
                    </span>
                    <span className="px-2 py-1 text-xs bg-green-600/80 rounded text-white backdrop-blur-sm">
                      {region.specialties.length} 特産品
                    </span>
                    <span className="px-2 py-1 text-xs bg-red-600/80 rounded text-white backdrop-blur-sm">
                      {region.bosses.length} ボス
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {region.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {region.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-800 dark:text-amber-300">
                      {feature}
                    </span>
                  ))}
                  {region.features.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-800 dark:text-amber-300">
                      ...
                    </span>
                  )}
                </div>
              </div>
              
              <div className="px-4 py-2 bg-amber-50 dark:bg-gray-700/50 border-t border-amber-100 dark:border-amber-900/30 text-sm text-amber-600 dark:text-amber-400 flex justify-end items-center">
                マップを見る <i className="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* マップの補足情報 */}
      <div className="mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-amber-200/40 dark:border-amber-800/30">
        <h2 className="text-2xl font-bold mb-4 text-amber-700 dark:text-amber-400 flex items-center">
          <i className="fas fa-compass mr-2 text-amber-600 dark:text-amber-500"></i>
          冒険者向けマップ活用ガイド
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-amber-700 dark:text-amber-400">
              効率的な探索のコツ
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span>まずは各地域の像を全て解放し、ワープポイントを増やしましょう。</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span>特産品採取ルートを計画して、効率的に収集しましょう。</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span>「HoYoLAB」の冒険手帳で、アイテムの収集状況を確認できます。</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span>宝箱探しには風神の瞳や溶け残りの雪を使って高所から探すのが効果的です。</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-amber-700 dark:text-amber-400">
              お役立ち外部マップツール
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <i className="fas fa-external-link-alt text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span><strong>原神インタラクティブマップ（公式）</strong>: 最も正確で最新の情報が反映されています。</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-external-link-alt text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span><strong>原神攻略 Wiki</strong>: 日本語の詳細な攻略情報とマップがあります。</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-external-link-alt text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span><strong>Genshin Map</strong>: コミュニティが作成したマップで、隠し宝箱の情報も豊富です。</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-external-link-alt text-amber-600 dark:text-amber-500 mt-1 mr-2"></i>
                <span><strong>Genshin Center</strong>: 素材の場所だけでなく、キャラクターごとの必要素材も確認できます。</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* コメントセクション */}
      <CommentSection pageId="maps" />
    </main>
  );
} 