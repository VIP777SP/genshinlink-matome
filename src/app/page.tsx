import Link from "next/link";

// カードの情報を配列として管理
const cards = [
  {
    href: "/recsite",
    title: "これであなたも原神マスター！？",
    subtitle: "【おすすめ便利サイト】",
    element: "anemo", // 風元素
    gradientFrom: "from-teal-500",
    gradientTo: "to-emerald-600",
    hoverShadow: "hover:shadow-anemo"
  },
  {
    href: "/reccommunity",
    title: "原神ライフが充実する！",
    subtitle: "【おすすめコミュニティ】",
    element: "geo", // 岩元素
    gradientFrom: "from-amber-500",
    gradientTo: "to-yellow-600",
    hoverShadow: "hover:shadow-geo"
  },
  {
    href: "/recyoutuber",
    title: "超タメになる！超面白い！！",
    subtitle: "【おすすめYoutuber】",
    element: "pyro", // 火元素
    gradientFrom: "from-red-500",
    gradientTo: "to-orange-600",
    hoverShadow: "hover:shadow-pyro"
  },
  {
    href: "/characters",
    title: "キャラ育成の参考に！",
    subtitle: "【キャラ攻略】",
    element: "hydro", // 水元素
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-600",
    hoverShadow: "hover:shadow-hydro"
  },
  {
    href: "/artifacts",
    title: "最強の聖遺物を目指せ！",
    subtitle: "【聖遺物攻略】",
    element: "electro", // 雷元素
    gradientFrom: "from-purple-500",
    gradientTo: "to-indigo-600",
    hoverShadow: "hover:shadow-electro"
  },
  {
    href: "/maps",
    title: "効率的な素材集め！",
    subtitle: "【マップ情報】",
    element: "cryo", // 冰元素
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-600",
    hoverShadow: "hover:shadow-cryo"
  },
  {
    href: "/events",
    title: "イベントを見逃すな！",
    subtitle: "【イベント情報】",
    element: "hydro", // 水元素
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-600",
    hoverShadow: "hover:shadow-hydro"
  },
  {
    href: "/teams",
    title: "最強パーティーを組もう！",
    subtitle: "【パーティー編成】",
    element: "anemo", // 風元素
    gradientFrom: "from-teal-500",
    gradientTo: "to-emerald-600",
    hoverShadow: "hover:shadow-anemo"
  },
  {
    href: "/news",
    title: "最新情報をチェック！",
    subtitle: "【ニュース】",
    element: "pyro", // 火元素
    gradientFrom: "from-red-500",
    gradientTo: "to-orange-600",
    hoverShadow: "hover:shadow-pyro"
  }
];

// 元素アイコンコンポーネント
const ElementIcon = ({ element }: { element: string }) => {
  const iconMap: Record<string, string> = {
    anemo: "wind-circle",
    geo: "mountain",
    pyro: "fire-flame-curved",
    hydro: "droplet",
    electro: "bolt-lightning",
    cryo: "snowflake",
    dendro: "leaf" // 念のため
  };

  const colorMap: Record<string, string> = {
    anemo: "text-teal-300",
    geo: "text-yellow-300",
    pyro: "text-red-400",
    hydro: "text-blue-300",
    electro: "text-purple-300",
    cryo: "text-cyan-300",
    dendro: "text-green-300"
  };

  return (
    <div className={`absolute top-2 right-2 ${colorMap[element]} opacity-60 text-lg`}>
      <i className={`fas fa-${iconMap[element] || 'circle'}`}></i>
    </div>
  );
};

export default function Home() {
  return (
    <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card, index) => (
          <Link 
            key={index}
            href={card.href} 
            className={`
              relative overflow-hidden
              p-4 sm:p-6 rounded-xl transition-all duration-300
              transform hover:scale-105 hover:-translate-y-1
              shadow-md ${card.hoverShadow}
              bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo}
              group flex flex-col justify-between min-h-[120px] sm:min-h-[150px]
              backdrop-filter backdrop-blur-sm
              border border-white/10
            `}
          >
            {/* 元素アイコン */}
            <ElementIcon element={card.element} />
            
            {/* キラキラエフェクト */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-white/10 animate-sparkle"></div>
            </div>
            
            {/* 背景の装飾的な円 */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white opacity-10 
                            group-hover:scale-150 transition-transform duration-700 ease-out`}></div>
            
            <h2 className="text-sm sm:text-base font-bold text-white relative z-10 drop-shadow-md">{card.title}</h2>
            <p className="text-lg sm:text-xl md:text-2xl font-bold mt-2 text-center text-white relative z-10 drop-shadow-lg">
              {card.subtitle}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
