'use client';

import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { motion, AnimatePresence } from 'framer-motion';
import Header     from '@/components/dashboard/Header';
import BottomNav  from '@/components/dashboard/BottomNav';
import OverviewTab from '@/components/dashboard/OverviewTab';
import SalesTab    from '@/components/dashboard/SalesTab';
import WorkTab     from '@/components/dashboard/WorkTab';
import BillingTab  from '@/components/dashboard/BillingTab';
import EntrySheet  from '@/components/dashboard/EntrySheet';

const FAB_CONFIG = {
  overview: { type: 'monthly', label: '月次登録' },
  sales:    { type: 'monthly', label: '月次登録' },
  work:     { type: 'work',    label: '工数登録' },
  billing:  { type: 'billing', label: '請求登録' },
} as const;

const TAB_TITLES = {
  overview: '概要',
  sales:    '営業',
  work:     '工数管理',
  billing:  '請求管理',
};

export default function KpiDashboard() {
  const { activeTab, openSheet } = useDashboardStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const fab = FAB_CONFIG[activeTab];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-zinc-400">読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header title={TAB_TITLES[activeTab]} />

      {/* Tab content with fade transition */}
      <main className="px-4 pt-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'sales'    && <SalesTab />}
            {activeTab === 'work'     && <WorkTab />}
            {activeTab === 'billing'  && <BillingTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => openSheet(fab.type)}
        className="fixed bottom-20 right-4 z-20 bg-emerald-600 text-white rounded-full pl-4 pr-5 py-3 text-sm font-medium flex items-center gap-2 min-h-[48px] shadow-lg shadow-emerald-200"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <span className="w-5 h-5 bg-white/25 rounded-full flex items-center justify-center text-base leading-none font-medium">+</span>
        {fab.label}
      </motion.button>

      <BottomNav />
      <EntrySheet />
    </div>
  );
}