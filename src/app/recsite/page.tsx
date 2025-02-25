import Link from "next/link";

export default function RecSite() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">【これであなたも原神マスター！？おすすめ便利サイト】</h1>
      <p className="mb-8">原神の攻略やゲーム情報を効率的に集めるための便利サイトをご紹介します。</p>

      <div className="space-y-8">
        <section className="border p-4 rounded-lg">
          <Link href="https://genshin.mihoyo.com/ja/home" className="text-xl font-bold text-blue-600 hover:text-blue-800">
            1. 原神公式サイト
          </Link>
          <p className="mt-2">原神の公式サイトは、ゲームの最新情報やアップデート内容を確認するための最適なサイトです。</p>
        </section>
        {/* ... 他のセクション ... */}
      </div>
    </main>
  );
} 