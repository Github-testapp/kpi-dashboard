'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '@/store/dashboardStore';
import type { TabKey } from '@/types/dashboard';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const setActiveTab = useDashboardStore(s => s.setActiveTab);

  const go = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const setTab = (tab: TabKey) => {
    setActiveTab(tab);
    setOpen(false);
    router.push('/dashboard');
  };

  return (
    <>
      {/* Header bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-zinc-200 px-4 h-14 flex items-center justify-between">
        <button onClick={() => go('/')} className="flex items-center gap-2 min-h-[44px]">
          <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-medium">K</span>
          </button>
          <span className="text-base font-medium text-zinc-900">{title}</span>
        </div>
        <button
          onClick={() => setOpen(p => !p)}
          className="w-11 h-11 flex flex-col items-center justify-center gap-1.5"
          aria-label="メニュー"
        >
          <span className={`block w-5 h-0.5 bg-zinc-600 transition-transform origin-center ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block w-5 h-0.5 bg-zinc-600 transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-zinc-600 transition-transform origin-center ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </header>

      {/* Drawer overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-20 bg-black/30"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-30 w-64 bg-white shadow-xl flex flex-col"
            >
              {/* Drawer header */}
              <div className="h-14 flex items-center px-4 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-medium">K</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-900">KPI Dashboard</span>
                </div>
              </div>

              {/* Menu items */}
              <ul className="flex flex-col py-3">
                <MenuItem icon="◎" label="概要"   onClick={() => { go('/dashboard'); setTab('overview'); }} active={title === '概要'} />
                <MenuItem icon="↑" label="営業"   onClick={() => { go('/dashboard'); setTab('sales');    }} active={title === '営業'} />
                <MenuItem icon="◷" label="工数"   onClick={() => { go('/dashboard'); setTab('work');     }} active={title === '工数管理'} />
                <MenuItem icon="¥" label="請求"   onClick={() => { go('/dashboard'); setTab('billing');  }} active={title === '請求管理'} />
              </ul>

              <div className="mt-auto px-4 py-6 border-t border-zinc-100">
                <button
                  onClick={() => go('/')}
                  className="w-full text-left text-sm text-zinc-400 py-2 min-h-[44px] flex items-center gap-2"
                >
                  <span>←</span> トップページ
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MenuItem({ icon, label, onClick, active }: {
  icon: string;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={[
          'w-full flex items-center gap-3 px-4 py-3 text-sm min-h-[44px] transition-colors',
          active ? 'text-emerald-600 bg-emerald-50 font-medium' : 'text-zinc-700',
        ].join(' ')}
      >
        <span className="w-5 text-center">{icon}</span>
        {label}
      </button>
    </li>
  );
}