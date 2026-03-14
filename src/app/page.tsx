'use client';

import { useRouter } from 'next/navigation';

const FEATURES = [
  { icon: '◎', label: '概要',   desc: '売上・利益・経費の月次推移' },
  { icon: '↑', label: '営業',   desc: '顧客数・案件数・成約率' },
  { icon: '◷', label: '工数',   desc: '稼働時間・プロジェクト管理' },
  { icon: '¥', label: '請求',   desc: '請求・入金ステータス管理' },
];

export default function TopPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Header */}
      <header className="px-5 h-14 flex items-center border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-medium leading-none">K</span>
          </div>
          <span className="text-sm font-medium text-zinc-900">KPI Dashboard</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col">

        {/* Hero */}
        <div className="bg-emerald-600 px-6 pt-12 pb-16 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-white text-3xl font-medium leading-none">K</span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-medium text-white tracking-tight">KPI Dashboard</h1>
            <p className="text-sm text-emerald-100 leading-relaxed">
              売上・営業・工数・請求を<br />ひとつの画面で管理する
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-2 w-full max-w-xs py-3.5 bg-white text-emerald-700 rounded-xl text-sm font-medium min-h-[48px] active:scale-[0.98] transition-transform shadow-sm"
          >
            ダッシュボードを開く →
          </button>
        </div>

        {/* Features */}
        <div className="px-4 py-6 flex flex-col gap-3">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider px-1">機能</p>
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map(f => (
              <button
                key={f.label}
                onClick={() => router.push('/dashboard')}
                className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col gap-2 text-left active:scale-[0.97] transition-transform"
              >
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-600 text-base">{f.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">{f.label}</p>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="px-4 pb-6">
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="text-zinc-400 text-base mt-0.5">i</span>
            <p className="text-xs text-zinc-500 leading-relaxed">
              データはすべてこのデバイスのLocalStorageに保存されます。サーバー不要でそのまま利用できます。
            </p>
          </div>
        </div>

      </main>

      <footer className="px-5 py-4 text-center text-xs text-zinc-300 border-t border-zinc-100">
        KPI Dashboard v1.0.0
      </footer>
    </div>
  );
}