'use client';

import { useDashboardStore } from '@/store/dashboardStore';
import type { TabKey } from '@/types/dashboard';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'overview', label: '概要',  icon: '◎' },
  { key: 'sales',    label: '営業',  icon: '↑' },
  { key: 'work',     label: '工数',  icon: '◷' },
  { key: 'billing',  label: '請求',  icon: '¥' },
];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useDashboardStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-zinc-100 flex safe-area-pb"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map(t => {
        const active = activeTab === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] relative transition-colors"
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-600 rounded-full" />
            )}
            <span className={`text-lg leading-none transition-colors ${active ? 'text-emerald-600' : 'text-zinc-300'}`}>
              {t.icon}
            </span>
            <span className={`text-xs font-medium transition-colors ${active ? 'text-emerald-600' : 'text-zinc-400'}`}>
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}