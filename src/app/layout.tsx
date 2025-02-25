import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import SearchBar from "@/components/SearchBar";
import { FavoritesProvider } from "@/components/FavoritesContext";
import { ThemeProvider } from "@/components/ThemeContext";
import { SoundProvider } from "@/components/SoundService";
import ThemeToggle from "@/components/ThemeToggle";
import SoundSettings from "@/components/SoundSettings";
import "./globals.css";

export const metadata: Metadata = {
  title: "原神お役立ちリンク集",
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
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" 
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body className="bg-gradient-to-br from-orange-100 to-amber-200 dark:from-gray-900 dark:to-amber-950 transition-colors duration-300">
        <ThemeProvider>
          <SoundProvider>
            <FavoritesProvider>
              <div className="min-h-screen">
                <Navigation />
                <div className="container mx-auto px-4 py-8">
                  <header className="mb-8 bg-gradient-to-r from-orange-600 to-amber-700 dark:from-orange-800 dark:to-amber-900 text-white p-6 rounded-lg shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h1 className="text-3xl md:text-4xl font-bold text-center drop-shadow-md">
                        原神お役立ちリンク集
                      </h1>
                      <div className="flex space-x-3">
                        <SoundSettings />
                        <ThemeToggle />
                      </div>
                    </div>
                    <SearchBar />
                  </header>
                  <main className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-lg shadow-xl text-gray-800 dark:text-gray-200 page-transition">
                    {children}
                  </main>
                  <footer className="mt-12 text-center text-gray-700 dark:text-gray-400 p-4">
                    <p>© 2024 原神お役立ちリンク集 - ゲーム内の画像・名称等の著作権はHoYoverse社に帰属します</p>
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
