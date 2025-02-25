import type { Metadata } from "next";

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
      <body>
        <div className="min-h-screen p-8 pt-0">
          <header className="mb-8 bg-black text-white p-6 rounded-lg">
            <h1 className="text-3xl font-bold text-center">
              原神お役立ちリンク集
            </h1>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
