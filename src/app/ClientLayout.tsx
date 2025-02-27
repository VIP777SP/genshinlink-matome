'use client';

import React from 'react';
import Navigation from "@/components/Navigation";
import { FavoritesProvider } from "@/components/FavoritesContext";
import { ThemeProvider } from "@/components/ThemeContext";
import { SoundProvider } from "@/components/SoundService";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SoundProvider>
        <FavoritesProvider>
          <div className="relative z-10 min-h-screen flex flex-col">
            <Navigation />
            <div className="flex-grow container mx-auto px-3 py-4 sm:px-4 sm:py-8">
              <main className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-3 sm:p-6 rounded-xl shadow-xl border border-white/20 dark:border-gray-700/30 text-gray-800 dark:text-gray-200 page-transition">
                {children}
              </main>
              
              <footer className="mt-6 sm:mt-12 text-center text-gray-700 dark:text-gray-400 p-3 sm:p-4 text-sm sm:text-base">
                <p className="text-xs sm:text-sm opacity-80">© 2024 原神アルティメット攻略 - ゲーム内の画像・名称等の著作権はHoYoverse社に帰属します</p>
              </footer>
            </div>
          </div>
        </FavoritesProvider>
      </SoundProvider>
    </ThemeProvider>
  );
} 