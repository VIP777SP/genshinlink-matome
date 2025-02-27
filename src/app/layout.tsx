import type { Metadata } from "next";
import { ClientLayout } from "./ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "原神 個人wiki",
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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
