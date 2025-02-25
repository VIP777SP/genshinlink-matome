import Image from "next/image";
import Link from "next/link";

// カードの情報を配列として管理
const cards = [
  {
    href: "/recsite",
    title: "これであなたも原神マスター！？",
    subtitle: "【おすすめ便利サイト】",
    element: "anemo" // 風元素
  },
  {
    href: "/reccommunity",
    title: "原神ライフが充実する！",
    subtitle: "【おすすめコミュニティ】",
    element: "geo" // 岩元素
  },
  {
    href: "/recyoutuber",
    title: "超タメになる！超面白い！！",
    subtitle: "【おすすめYoutuber】",
    element: "pyro" // 火元素
  },
  {
    href: "/characters",
    title: "キャラ育成の参考に！",
    subtitle: "【キャラ攻略】",
    element: "hydro" // 水元素
  },
  {
    href: "/artifacts",
    title: "最強の聖遺物を目指せ！",
    subtitle: "【聖遺物攻略】",
    element: "electro" // 雷元素
  },
  {
    href: "/maps",
    title: "効率的な素材集め！",
    subtitle: "【マップ情報】",
    element: "cryo" // 冰元素
  },
  {
    href: "/events",
    title: "イベントを見逃すな！",
    subtitle: "【イベント情報】",
    element: "hydro" // 水元素
  },
  {
    href: "/teams",
    title: "最強パーティーを組もう！",
    subtitle: "【パーティー編成】",
    element: "anemo" // 風元素
  },
  {
    href: "/news",
    title: "最新情報をチェック！",
    subtitle: "【ニュース】",
    element: "pyro" // 火元素
  }
];

export default function Home() {
  return (
    <main className="container mx-auto">
      <div className="grid grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <Link 
            key={index}
            href={card.href} 
            className={`
              relative overflow-hidden
              p-6 rounded-lg transition-all duration-300
              transform hover:scale-105
              hover:shadow-lg hover:shadow-${card.element}
              bg-gradient-to-br from-orange-500 to-orange-600
              group
            `}
          >
            {/* キラキラエフェクト */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-white/10 animate-sparkle"></div>
            </div>
            
            <h2 className="text-base font-bold text-white relative z-10">{card.title}</h2>
            <p className="text-3xl font-bold mt-2 opacity-90 text-center text-white relative z-10">
              {card.subtitle}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
