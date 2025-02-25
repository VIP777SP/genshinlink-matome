'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// サウンド設定の型定義
type SoundSettings = {
  enabled: boolean;
  volume: number;
};

// サウンドタイプの列挙
export type SoundType = 'hover' | 'click' | 'typing' | 'favorite-add' | 'favorite-remove' | 'theme-toggle';

// サウンドコンテキストの型定義
type SoundContextType = {
  settings: SoundSettings;
  toggleSound: () => void;
  setVolume: (volume: number) => void;
  playSound: (type: SoundType) => void;
};

// デフォルト設定
const DEFAULT_SETTINGS: SoundSettings = {
  enabled: true,
  volume: 0.5,
};

// コンテキストの作成
const SoundContext = createContext<SoundContextType | undefined>(undefined);

// プロバイダーコンポーネント
export function SoundProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SoundSettings>(DEFAULT_SETTINGS);
  const [sounds, setSounds] = useState<Record<SoundType, HTMLAudioElement | null>>({
    'hover': null,
    'click': null,
    'typing': null,
    'favorite-add': null,
    'favorite-remove': null,
    'theme-toggle': null,
  });
  const [initialized, setInitialized] = useState(false);

  // 初期化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // ローカルストレージから設定を読み込み
      const savedSettings = localStorage.getItem('soundSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }

      // 音声ファイルを読み込み
      const loadedSounds: Record<SoundType, HTMLAudioElement | null> = {
        'hover': null,
        'click': null,
        'typing': null,
        'favorite-add': null,
        'favorite-remove': null,
        'theme-toggle': null,
      };

      try {
        // 安全に音声ファイルを読み込む
        const soundTypes: SoundType[] = ['hover', 'click', 'typing', 'favorite-add', 'favorite-remove', 'theme-toggle'];
        
        soundTypes.forEach(type => {
          try {
            loadedSounds[type] = new Audio(`/sounds/${type}.mp3`);
            // 音声ファイルの読み込みエラーをハンドリング
            loadedSounds[type]?.addEventListener('error', () => {
              console.warn(`音声ファイルの読み込みに失敗しました: ${type}.mp3`);
              loadedSounds[type] = null;
            });
          } catch (e) {
            console.warn(`音声の初期化に失敗しました: ${type}`, e);
            loadedSounds[type] = null;
          }
        });
      } catch (e) {
        console.warn('音声の初期化に失敗しました', e);
      }

      // 音量を設定
      Object.values(loadedSounds).forEach((sound) => {
        if (sound) {
          sound.volume = settings.volume;
        }
      });

      setSounds(loadedSounds);
      setInitialized(true);
    }
  }, []);

  // 設定が変更されたらローカルストレージに保存
  useEffect(() => {
    if (initialized && typeof window !== 'undefined') {
      localStorage.setItem('soundSettings', JSON.stringify(settings));

      // 音量を更新
      Object.values(sounds).forEach((sound) => {
        if (sound) {
          sound.volume = settings.volume;
        }
      });
    }
  }, [settings, initialized, sounds]);

  // サウンドの有効/無効を切り替え
  const toggleSound = () => {
    setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  // 音量を設定
  const setVolume = (volume: number) => {
    setSettings(prev => ({ ...prev, volume }));
  };

  // サウンドを再生
  const playSound = (type: SoundType) => {
    if (!settings.enabled || !sounds[type]) return;

    try {
      const sound = sounds[type];
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.warn('Audio play failed:', e));
      }
    } catch (e) {
      console.warn(`音声の再生に失敗しました: ${type}`, e);
    }
  };

  return (
    <SoundContext.Provider value={{ settings, toggleSound, setVolume, playSound }}>
      {children}
    </SoundContext.Provider>
  );
}

// カスタムフック
export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
} 