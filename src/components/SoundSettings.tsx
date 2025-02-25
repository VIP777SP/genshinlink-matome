'use client';

import { useState } from 'react';
import { useSound } from './SoundService';

export default function SoundSettings() {
  const { settings, toggleSound, setVolume, playSound } = useSound();
  const [isOpen, setIsOpen] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    // テストサウンドを再生
    playSound('click');
  };

  return (
    <div className="relative">
      {/* サウンドトグルボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
        aria-label="サウンド設定"
      >
        <i className={`fas ${settings.enabled ? 'fa-volume-up' : 'fa-volume-mute'} text-amber-600 dark:text-amber-400`}></i>
      </button>

      {/* 設定パネル */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-amber-200 dark:border-amber-800 p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800 dark:text-white">サウンド設定</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* サウンド有効/無効トグル */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-300">サウンド効果</span>
            <button
              onClick={() => {
                toggleSound();
                if (!settings.enabled) {
                  // 有効にした直後にクリック音を再生
                  setTimeout(() => playSound('click'), 100);
                }
              }}
              className={`
                relative inline-flex items-center h-6 rounded-full w-11
                ${settings.enabled ? 'bg-amber-600' : 'bg-gray-300 dark:bg-gray-600'}
                transition-colors duration-300
              `}
            >
              <span
                className={`
                  inline-block w-5 h-5 transform rounded-full bg-white
                  transition-transform duration-300
                  ${settings.enabled ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          {/* 音量スライダー */}
          <div className="mb-2">
            <label htmlFor="volume" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              音量: {Math.round(settings.volume * 100)}%
            </label>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-amber-200 dark:bg-amber-900 rounded-lg appearance-none cursor-pointer"
              disabled={!settings.enabled}
            />
          </div>

          {/* テストボタン */}
          <button
            onClick={() => playSound('click')}
            className={`
              mt-3 w-full py-2 px-4 rounded
              ${settings.enabled
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              }
              transition-colors
            `}
            disabled={!settings.enabled}
          >
            テストサウンド再生
          </button>
        </div>
      )}
    </div>
  );
} 