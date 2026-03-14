import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DashboardState, MonthlyRecord, BillingRecord, WorkRecord, TabKey } from '@/types/dashboard';

const SEED_MONTHLY: MonthlyRecord[] = [
  { id: '1', month: '2025-10', revenue: 3200000, profit: 960000,  expense: 640000, customers: 12, deals: 8,  closed: 5, workHours: 168, manDays: 21 },
  { id: '2', month: '2025-11', revenue: 3550000, profit: 1100000, expense: 710000, customers: 14, deals: 10, closed: 6, workHours: 176, manDays: 22 },
  { id: '3', month: '2025-12', revenue: 3900000, profit: 1250000, expense: 780000, customers: 15, deals: 11, closed: 7, workHours: 184, manDays: 23 },
  { id: '4', month: '2026-01', revenue: 4100000, profit: 1350000, expense: 820000, customers: 16, deals: 12, closed: 8, workHours: 160, manDays: 20 },
  { id: '5', month: '2026-02', revenue: 4310000, profit: 1420000, expense: 862000, customers: 18, deals: 13, closed: 9, workHours: 152, manDays: 19 },
  { id: '6', month: '2026-03', revenue: 4820000, profit: 1590000, expense: 964000, customers: 20, deals: 15, closed: 11, workHours: 176, manDays: 22 },
];

const SEED_BILLING: BillingRecord[] = [
  { id: 'b1', client: '株式会社アルファ',   amount: 880000,  invoiceDate: '2026-02-28', dueDate: '2026-03-31', status: 'paid' },
  { id: 'b2', client: '合同会社ベータ',     amount: 440000,  invoiceDate: '2026-03-01', dueDate: '2026-03-31', status: 'unpaid' },
  { id: 'b3', client: '株式会社ガンマ',     amount: 1320000, invoiceDate: '2026-03-05', dueDate: '2026-04-05', status: 'unpaid' },
  { id: 'b4', client: 'デルタ商事株式会社', amount: 660000,  invoiceDate: '2026-01-31', dueDate: '2026-02-28', status: 'overdue' },
  { id: 'b5', client: '株式会社イプシロン', amount: 550000,  invoiceDate: '2026-03-10', dueDate: '2026-04-10', status: 'unpaid' },
];

const SEED_WORK: WorkRecord[] = [
  { id: 'w1', month: '2026-03', project: 'Webサイト制作 / アルファ',   hours: 64,  manDays: 8  },
  { id: 'w2', month: '2026-03', project: 'システム開発 / ガンマ',       hours: 80,  manDays: 10 },
  { id: 'w3', month: '2026-03', project: 'ITコンサル / ベータ',         hours: 32,  manDays: 4  },
  { id: 'w4', month: '2026-02', project: 'Webサイト制作 / アルファ',   hours: 56,  manDays: 7  },
  { id: 'w5', month: '2026-02', project: 'システム開発 / ガンマ',       hours: 96,  manDays: 12 },
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      activeTab: 'overview',
      monthly: SEED_MONTHLY,
      billing: SEED_BILLING,
      work: SEED_WORK,
      sheetOpen: false,
      sheetType: null,

      setActiveTab: (tab: TabKey) => set({ activeTab: tab }),
      openSheet: (type) => set({ sheetOpen: true, sheetType: type }),
      closeSheet: () => set({ sheetOpen: false, sheetType: null }),

      addMonthly: (r) => set(s => ({ monthly: [...s.monthly, r].sort((a, b) => a.month.localeCompare(b.month)) })),
      updateMonthly: (r) => set(s => ({ monthly: s.monthly.map(m => m.id === r.id ? r : m) })),
      deleteMonthly: (id) => set(s => ({ monthly: s.monthly.filter(m => m.id !== id) })),

      addBilling: (r) => set(s => ({ billing: [...s.billing, r] })),
      updateBillingStatus: (id, status) => set(s => ({ billing: s.billing.map(b => b.id === id ? { ...b, status } : b) })),
      deleteBilling: (id) => set(s => ({ billing: s.billing.filter(b => b.id !== id) })),

      addWork: (r) => set(s => ({ work: [...s.work, r] })),
      deleteWork: (id) => set(s => ({ work: s.work.filter(w => w.id !== id) })),
    }),
    { name: 'kpi-dashboard-v1' }
  )
);