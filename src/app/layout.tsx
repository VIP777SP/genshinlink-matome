import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import { FavoritesProvider } from "@/components/FavoritesContext";
import { ThemeProvider } from "@/components/ThemeContext";
import { SoundProvider } from "@/components/SoundService";
import "./globals.css";

export const metadata: Metadata = {
  title: "原神アルティメット攻略",
  description: "原神に関するおすすめしたいお役立ちサイトや参考になるyoutuberなど、さまざまな情報をまとめたリンク集",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* Font Awesome */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" 
          integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-100 to-amber-200 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950 transition-colors duration-300 bg-fixed">
        <div className="fixed inset-0 bg-[url('/textures/paper-texture.png')] opacity-10 pointer-events-none z-0 dark:opacity-5"></div>
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
      </body>
    </html>
  );
}
