'use client';

import { useState, useEffect } from 'react';
import { useSound } from '@/components/SoundService';
import FavoriteButton from '@/components/FavoriteButton';
import CommentSection from '@/components/CommentSection';

// イベントデータの型定義
type EventType = 'ボス' | 'イベント' | '聖遺物' | '武器素材' | '天賦素材' | 'バナー';
type EventCategory = 'レア' | '期間限定' | '常設';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  category: EventCategory;
  startDate?: Date; // 期間イベントの場合は必須
  endDate?: Date; // 終了日が不明または常設の場合はundefined
  dayOfWeek?: number[]; // 特定の曜日のみ（0: 日, 1: 月, ..., 6: 土）
  image?: string;
  location?: string;
}

// 曜日表示用配列
const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

// サンプルイベントデータ
const generateEvents = (): CalendarEvent[] => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);
  
  return [
    {
      id: 'tartaglia-boss',
      title: '「公子」チャイルド討伐',
      description: '「公子」チャイルドボスを討伐して、北陸素材を入手しましょう。',
      type: 'ボス',
      category: '常設',
      dayOfWeek: [1, 4], // 月曜と木曜
      image: 'https://static.wikia.nocookie.net/gensin-impact/images/c/c9/Enemy_Tartaglia_Icon.png',
      location: '璃月港・黄金の家'
    },
    {
      id: 'talent-books-gold',
      title: '黄金の才能素材',
      description: '詩文、繁栄、黄金の才能素材が入手できます。',
      type: '天賦素材',
      category: '常設',
      dayOfWeek: [3, 6], // 水曜と土曜
      image: 'https://static.wikia.nocookie.net/gensin-impact/images/7/7c/Item_Philosophies_of_Gold.png',
      location: '各地の秘境・才能の神殿'
    },
    {
      id: 'weapon-ascension-decarabian',
      title: 'デカラビアンの武器素材',
      description: 'デカラビアンの武器昇格素材が入手できます。',
      type: '武器素材',
      category: '常設',
      dayOfWeek: [1, 4], // 月曜と木曜
      image: 'https://static.wikia.nocookie.net/gensin-impact/images/9/9c/Item_Fragment_of_Decarabian%27s_Epic.png',
      location: 'モンド・凍結の廃都跡'
    },
    {
      id: 'festering-desire-event',
      title: '白亜と黒龍',
      description: '期間限定イベント。特別な武器「祭礼の剣」を入手するチャンス！',
      type: 'イベント',
      category: '期間限定',
      startDate: new Date(today),
      endDate: new Date(nextWeek),
      image: 'https://static.wikia.nocookie.net/gensin-impact/images/7/71/Weapon_Festering_Desire.png',
      location: 'ドラゴンスパイン'
    },
    {
      id: 'ganyu-banner',
      title: '甘雨ピックアップ祈願',
      description: '5★キャラクター「甘雨」がピックアップされた期間限定祈願バナー',
      type: 'バナー',
      category: '期間限定',
      startDate: new Date(today),
      endDate: new Date(nextMonth),
      image: 'https://static.wikia.nocookie.net/gensin-impact/images/9/96/Character_Ganyu_Wish.png',
      location: '祈願画面'
    },
    {
      id: 'vv-artifact-domain',
      title: '翠緑の影聖遺物',
      description: '翠緑の影セットなどの聖遺物を入手できる秘境',
      type: '聖遺物',
      category: '常設',
      dayOfWeek: [0, 1, 2, 3, 4, 5, 6], // 毎日
      image: 'https://static.wikia.nocookie.net/gensin-impact/images/7/75/Item_Viridescent_Venerer%27s_Determination.png',
      location: 'モンド・深淵の震域'
    },
    {
      id: 'lantern-rite',
      title: '海灯祭',
      description: '璃月の年間最大のお祭り。様々な報酬と限定コンテンツを楽しめます。',
      type: 'イベント',
      category: 'レア',
      startDate: new Date(nextWeek),
      endDate: new Date(nextMonth),
      image: 'https://static.wikia.nocookie.net/gensin-impact/images/e/e4/Event_Lantern_Rite.png',
      location: '璃月港'
    },
    {
      id: 'weekly-boss-discount',
      title: '週ボス割引',
      description: '最初の3回の週ボス報酬には元素力の消費が半減します。',
      type: 'ボス',
      category: '常設',
      dayOfWeek: [0, 1, 2, 3, 4, 5, 6], // 毎日
      image: 'https://static.wikia.nocookie.net/gensin-impact/images/c/c4/Item_Dvalin%27s_Plume.png',
      location: '各地のボス'
    }
  ];
};

// イベントタイプに対応する色の設定
const eventTypeColors: Record<EventType, { bg: string; border: string; text: string; darkBg: string; darkBorder: string; darkText: string }> = {
  'ボス': {
    bg: 'bg-red-100',
    border: 'border-red-400',
    text: 'text-red-800',
    darkBg: 'dark:bg-red-900',
    darkBorder: 'dark:border-red-700',
    darkText: 'dark:text-red-200'
  },
  'イベント': {
    bg: 'bg-amber-100',
    border: 'border-amber-400',
    text: 'text-amber-800',
    darkBg: 'dark:bg-amber-900',
    darkBorder: 'dark:border-amber-700',
    darkText: 'dark:text-amber-200'
  },
  '聖遺物': {
    bg: 'bg-purple-100',
    border: 'border-purple-400',
    text: 'text-purple-800',
    darkBg: 'dark:bg-purple-900',
    darkBorder: 'dark:border-purple-700',
    darkText: 'dark:text-purple-200'
  },
  '武器素材': {
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    text: 'text-blue-800',
    darkBg: 'dark:bg-blue-900',
    darkBorder: 'dark:border-blue-700',
    darkText: 'dark:text-blue-200'
  },
  '天賦素材': {
    bg: 'bg-green-100',
    border: 'border-green-400',
    text: 'text-green-800',
    darkBg: 'dark:bg-green-900',
    darkBorder: 'dark:border-green-700',
    darkText: 'dark:text-green-200'
  },
  'バナー': {
    bg: 'bg-indigo-100',
    border: 'border-indigo-400',
    text: 'text-indigo-800',
    darkBg: 'dark:bg-indigo-900',
    darkBorder: 'dark:border-indigo-700',
    darkText: 'dark:text-indigo-200'
  }
};

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [filters, setFilters] = useState({
    type: 'all' as string | EventType,
    category: 'all' as string | EventCategory
  });
  const { playSound } = useSound();

  // 初期化時にイベントデータをロード
  useEffect(() => {
    setEvents(generateEvents());
  }, []);

  // フィルターの適用
  useEffect(() => {
    let filtered = [...events];
    
    // タイプフィルター適用
    if (filters.type !== 'all') {
      filtered = filtered.filter(event => event.type === filters.type);
    }
    
    // カテゴリーフィルター適用
    if (filters.category !== 'all') {
      filtered = filtered.filter(event => event.category === filters.category);
    }
    
    // 月表示モードの場合は選択された月のイベントのみ表示
    if (viewMode === 'month') {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      filtered = filtered.filter(event => {
        // 期間指定イベントの場合
        if (event.startDate) {
          const endDate = event.endDate || new Date(3000, 0, 1); // 終了日が未指定の場合は遠い未来に設定
          
          // イベント期間と選択された月が重なるかチェック
          const eventStartsBeforeMonthEnds = new Date(event.startDate) <= new Date(year, month + 1, 0);
          const eventEndsAfterMonthStarts = new Date(endDate) >= new Date(year, month, 1);
          
          return eventStartsBeforeMonthEnds && eventEndsAfterMonthStarts;
        }
        
        // 曜日指定イベントの場合は常に表示
        return true;
      });
    }
    
    setFilteredEvents(filtered);
  }, [events, filters, viewMode, currentDate]);

  // フィルター変更ハンドラー
  const handleFilterChange = (filterType: 'type' | 'category', value: string) => {
    playSound('click');
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  // 前月/次月への移動
  const changeMonth = (increment: number) => {
    playSound('click');
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  // カレンダーグリッドの生成
  const generateCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 月の最初の日
    const firstDay = new Date(year, month, 1);
    // 月の最終日
    const lastDay = new Date(year, month + 1, 0);
    
    // 月の最初の日の曜日（0: 日曜日, 1: 月曜日, ...)
    const firstDayOfWeek = firstDay.getDay();
    
    // 月の日数
    const daysInMonth = lastDay.getDate();
    
    // カレンダーグリッドに表示する日付の配列
    const calendarDays: Array<{ date: Date | null; events: CalendarEvent[] }> = [];
    
    // 前月の日を埋める
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push({ date: null, events: [] });
    }
    
    // 今月の日を埋める
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayEvents = getEventsForDate(date);
      calendarDays.push({ date, events: dayEvents });
    }
    
    // 6行になるまで次月の日を埋める
    const totalCells = 42;
    while (calendarDays.length < totalCells) {
      calendarDays.push({ date: null, events: [] });
    }
    
    return calendarDays;
  };

  // 指定された日付のイベントを取得
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return filteredEvents.filter(event => {
      // 曜日指定のイベント
      if (event.dayOfWeek) {
        const dayOfWeek = date.getDay();
        return event.dayOfWeek.includes(dayOfWeek);
      }
      
      // 期間指定のイベント
      if (event.startDate) {
        const eventStart = new Date(event.startDate);
        eventStart.setHours(0, 0, 0, 0);
        
        const eventEnd = event.endDate ? new Date(event.endDate) : new Date(3000, 0, 1);
        eventEnd.setHours(23, 59, 59, 999);
        
        const targetDate = new Date(date);
        targetDate.setHours(12, 0, 0, 0);
        
        return targetDate >= eventStart && targetDate <= eventEnd;
      }
      
      return false;
    });
  };

  // 日付選択ハンドラー
  const handleDateSelect = (date: Date | null) => {
    if (date) {
      playSound('click');
      setSelectedDate(date);
    }
  };

  // 特定の日付のイベントを表示するコンポーネント
  const renderEventsForDate = (date: Date) => {
    const eventsForDate = getEventsForDate(date);
    
    if (eventsForDate.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <i className="fas fa-calendar-times text-3xl mb-2"></i>
          <p>この日に予定されているイベントはありません。</p>
        </div>
      );
    }
    
    return (
      <ul className="space-y-4">
        {eventsForDate.map(event => renderEventCard(event))}
      </ul>
    );
  };

  // イベントカードのレンダリング
  const renderEventCard = (event: CalendarEvent) => {
    const colors = eventTypeColors[event.type];
    
    return (
      <li 
        key={event.id} 
        className={`p-4 rounded-lg shadow-md border ${colors.bg} ${colors.border} ${colors.darkBg} ${colors.darkBorder}`}
      >
        <div className="flex flex-col sm:flex-row">
          {event.image && (
            <div className="sm:w-1/4 mb-4 sm:mb-0 sm:mr-4 flex justify-center">
              <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${colors.border} ${colors.darkBorder} flex items-center justify-center`}>
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
          )}
          
          <div className="sm:w-3/4">
            <h3 className={`text-lg font-bold ${colors.text} ${colors.darkText}`}>{event.title}</h3>
            
            <div className="my-2 flex flex-wrap gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText} bg-opacity-70`}>
                {event.type}
              </span>
              
              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200`}>
                {event.category}
              </span>
              
              {event.location && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  <i className="fas fa-map-marker-alt mr-1"></i> {event.location}
                </span>
              )}
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{event.description}</p>
            
            {/* スケジュール情報 */}
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {event.dayOfWeek ? (
                <div className="flex items-center">
                  <i className="fas fa-calendar-day mr-1"></i>
                  <span>毎週 {event.dayOfWeek.map(day => weekDays[day]).join('・')}曜日</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <i className="fas fa-calendar-alt mr-1"></i>
                  <span>
                    {event.startDate?.toLocaleDateString()} 
                    {event.endDate ? ` 〜 ${event.endDate.toLocaleDateString()}` : ' から'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <main className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-700 dark:text-amber-500">
          【攻略カレンダー】
        </h1>
        <FavoriteButton
          id="calendar-page"
          title="攻略カレンダー"
          url="/calendar"
          category="攻略情報"
        />
      </div>

      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        原神の様々なイベント、ボス討伐、素材収集などのスケジュールを確認できます。
      </p>
      
      {/* モード切替とフィルター */}
      <div className="mb-6 bg-amber-50 dark:bg-gray-900 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 表示モード切替 */}
          <div className="flex space-x-2">
            <button
              onClick={() => { setViewMode('month'); playSound('click'); }}
              className={`px-4 py-2 rounded-l-md ${
                viewMode === 'month'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400'
              }`}
            >
              <i className="fas fa-calendar-alt mr-2"></i>カレンダー
            </button>
            <button
              onClick={() => { setViewMode('list'); playSound('click'); }}
              className={`px-4 py-2 rounded-r-md ${
                viewMode === 'list'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400'
              }`}
            >
              <i className="fas fa-list mr-2"></i>リスト
            </button>
          </div>
          
          <div className="flex-grow"></div>
          
          {/* フィルター */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">イベントタイプ</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full p-2 border border-amber-300 dark:border-amber-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
              >
                <option value="all">すべてのタイプ</option>
                <option value="ボス">ボス</option>
                <option value="イベント">イベント</option>
                <option value="聖遺物">聖遺物</option>
                <option value="武器素材">武器素材</option>
                <option value="天賦素材">天賦素材</option>
                <option value="バナー">バナー</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">カテゴリー</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border border-amber-300 dark:border-amber-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
              >
                <option value="all">すべてのカテゴリー</option>
                <option value="レア">レア</option>
                <option value="期間限定">期間限定</option>
                <option value="常設">常設</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* カレンダー月表示 */}
      {viewMode === 'month' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-amber-200 dark:border-amber-900">
          {/* カレンダーヘッダー */}
          <div className="p-4 border-b border-amber-200 dark:border-amber-900 flex justify-between items-center">
            <button 
              onClick={() => changeMonth(-1)}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-500">
              {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
            </h2>
            
            <button 
              onClick={() => changeMonth(1)}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          
          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 bg-amber-50 dark:bg-gray-900">
            {weekDays.map((day, index) => (
              <div 
                key={day} 
                className={`text-center py-2 font-medium ${
                  index === 0 
                    ? 'text-red-500 dark:text-red-400' 
                    : index === 6 
                      ? 'text-blue-500 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* カレンダーグリッド */}
          <div className="grid grid-cols-7 border-t border-amber-200 dark:border-amber-900">
            {generateCalendarGrid().map((cell, index) => {
              const isCurrentMonth = cell.date !== null;
              const isToday = cell.date && 
                cell.date.getDate() === new Date().getDate() && 
                cell.date.getMonth() === new Date().getMonth() && 
                cell.date.getFullYear() === new Date().getFullYear();
              const isSelected = cell.date && 
                cell.date.getDate() === selectedDate.getDate() && 
                cell.date.getMonth() === selectedDate.getMonth() && 
                cell.date.getFullYear() === selectedDate.getFullYear();
              
              return (
                <div 
                  key={index}
                  className={`min-h-[100px] p-1 border-b border-r border-amber-200 dark:border-amber-900 ${
                    !isCurrentMonth 
                      ? 'bg-gray-100 dark:bg-gray-900' 
                      : isSelected
                        ? 'bg-amber-100 dark:bg-amber-900'
                        : 'bg-white dark:bg-gray-800'
                  }`}
                  onClick={() => cell.date && handleDateSelect(cell.date)}
                >
                  {isCurrentMonth && (
                    <>
                      <div className={`text-right mb-1 ${
                        isToday 
                          ? 'font-bold text-amber-600 dark:text-amber-400' 
                          : cell.date?.getDay() === 0
                            ? 'text-red-500 dark:text-red-400'
                            : cell.date?.getDay() === 6
                              ? 'text-blue-500 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {cell.date?.getDate()}
                        {isToday && <span className="ml-1 text-xs bg-amber-500 text-white rounded-full px-1">今日</span>}
                      </div>
                      
                      <div className="overflow-y-auto max-h-[70px] text-xs space-y-1">
                        {cell.events.slice(0, 3).map((event, i) => (
                          <div 
                            key={`${event.id}-${i}`}
                            className={`px-1 py-0.5 rounded truncate ${eventTypeColors[event.type].bg} ${eventTypeColors[event.type].text} ${eventTypeColors[event.type].darkBg} ${eventTypeColors[event.type].darkText}`}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {cell.events.length > 3 && (
                          <div className="text-gray-500 dark:text-gray-400 text-center">
                            +{cell.events.length - 3}件
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* イベントリスト表示 */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-amber-200 dark:border-amber-900">
          <h2 className="text-xl font-semibold mb-4 text-amber-800 dark:text-amber-500">
            イベント一覧
          </h2>
          
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <i className="fas fa-calendar-times text-4xl mb-4"></i>
              <p>条件に一致するイベントが見つかりませんでした。</p>
              <button
                onClick={() => {
                  setFilters({ type: 'all', category: 'all' });
                  playSound('click');
                }}
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
              >
                フィルターをリセット
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredEvents.map(event => renderEventCard(event))}
            </ul>
          )}
        </div>
      )}
      
      {/* 選択された日付のイベント詳細 (月表示の場合のみ) */}
      {viewMode === 'month' && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-amber-200 dark:border-amber-900">
          <h2 className="text-xl font-semibold mb-4 text-amber-800 dark:text-amber-500">
            {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日のイベント
          </h2>
          
          {renderEventsForDate(selectedDate)}
        </div>
      )}
      
      {/* コメントセクション */}
      <div className="mt-8">
        <CommentSection pageId="calendar" pageTitle="攻略カレンダー" />
      </div>
    </main>
  );
} 