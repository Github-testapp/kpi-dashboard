'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '@/store/dashboardStore';
import type { MonthlyRecord, BillingRecord, WorkRecord } from '@/types/dashboard';

const uid = () => Math.random().toString(36).slice(2, 9);

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-zinc-500">{label}</label>
      {children}
    </div>
  );
}

function MonthlyForm({ onClose }: { onClose: () => void }) {
  const { addMonthly } = useDashboardStore();
  const [f, setF] = useState({
    month: '', revenue: '', profit: '', expense: '',
    customers: '', deals: '', closed: '', workHours: '', manDays: '',
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    if (!f.month) return;
    addMonthly({
      id: uid(), month: f.month,
      revenue: Number(f.revenue) || 0, profit: Number(f.profit) || 0, expense: Number(f.expense) || 0,
      customers: Number(f.customers) || 0, deals: Number(f.deals) || 0, closed: Number(f.closed) || 0,
      workHours: Number(f.workHours) || 0, manDays: Number(f.manDays) || 0,
    } as MonthlyRecord);
    onClose();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-emerald-50 rounded-xl px-4 py-3">
        <p className="text-xs text-emerald-700">対象月を選択して各数値を入力してください。未入力項目は0として登録されます。</p>
      </div>
      <Field label="対象月 *"><input type="month" value={f.month} onChange={set('month')} className="inp" /></Field>
      <div className="border-t border-zinc-100 pt-4">
        <p className="text-xs font-medium text-zinc-400 mb-3">財務</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="売上 (円)"><input type="number" value={f.revenue} onChange={set('revenue')} placeholder="0" className="inp" /></Field>
          <Field label="利益 (円)"><input type="number" value={f.profit} onChange={set('profit')} placeholder="0" className="inp" /></Field>
          <Field label="経費 (円)"><input type="number" value={f.expense} onChange={set('expense')} placeholder="0" className="inp" /></Field>
        </div>
      </div>
      <div className="border-t border-zinc-100 pt-4">
        <p className="text-xs font-medium text-zinc-400 mb-3">営業</p>
        <div className="grid grid-cols-3 gap-3">
          <Field label="顧客数"><input type="number" value={f.customers} onChange={set('customers')} placeholder="0" className="inp" /></Field>
          <Field label="案件数"><input type="number" value={f.deals} onChange={set('deals')} placeholder="0" className="inp" /></Field>
          <Field label="成約数"><input type="number" value={f.closed} onChange={set('closed')} placeholder="0" className="inp" /></Field>
        </div>
      </div>
      <div className="border-t border-zinc-100 pt-4">
        <p className="text-xs font-medium text-zinc-400 mb-3">工数</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="稼働時間 (h)"><input type="number" value={f.workHours} onChange={set('workHours')} placeholder="0" className="inp" /></Field>
          <Field label="工数 (人日)"><input type="number" value={f.manDays} onChange={set('manDays')} placeholder="0" className="inp" /></Field>
        </div>
      </div>
      <button onClick={submit} className="w-full py-3.5 bg-emerald-600 text-white rounded-xl text-sm font-medium mt-1 min-h-[48px] active:scale-[0.98] transition-transform">
        登録する
      </button>
    </div>
  );
}

function BillingForm({ onClose }: { onClose: () => void }) {
  const { addBilling } = useDashboardStore();
  const [f, setF] = useState({ client: '', amount: '', invoiceDate: '', dueDate: '' });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    if (!f.client || !f.amount) return;
    addBilling({ id: uid(), client: f.client, amount: Number(f.amount), invoiceDate: f.invoiceDate, dueDate: f.dueDate, status: 'unpaid' } as BillingRecord);
    onClose();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-emerald-50 rounded-xl px-4 py-3">
        <p className="text-xs text-emerald-700">新規請求を登録します。ステータスは「未入金」で作成されます。</p>
      </div>
      <Field label="クライアント名 *"><input type="text" value={f.client} onChange={set('client')} placeholder="株式会社○○" className="inp" /></Field>
      <Field label="請求金額 (円) *"><input type="number" value={f.amount} onChange={set('amount')} placeholder="0" className="inp" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="請求日"><input type="date" value={f.invoiceDate} onChange={set('invoiceDate')} className="inp" /></Field>
        <Field label="支払期限"><input type="date" value={f.dueDate} onChange={set('dueDate')} className="inp" /></Field>
      </div>
      <button onClick={submit} className="w-full py-3.5 bg-emerald-600 text-white rounded-xl text-sm font-medium min-h-[48px] active:scale-[0.98] transition-transform">
        登録する
      </button>
    </div>
  );
}

function WorkForm({ onClose }: { onClose: () => void }) {
  const { addWork } = useDashboardStore();
  const [f, setF] = useState({ month: '', project: '', hours: '', manDays: '' });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    if (!f.month || !f.project) return;
    addWork({ id: uid(), month: f.month, project: f.project, hours: Number(f.hours) || 0, manDays: Number(f.manDays) || 0 } as WorkRecord);
    onClose();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-emerald-50 rounded-xl px-4 py-3">
        <p className="text-xs text-emerald-700">プロジェクト単位で工数を登録します。</p>
      </div>
      <Field label="対象月 *"><input type="month" value={f.month} onChange={set('month')} className="inp" /></Field>
      <Field label="プロジェクト名 *"><input type="text" value={f.project} onChange={set('project')} placeholder="Webサイト制作 / ○○社" className="inp" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="稼働時間 (h)"><input type="number" value={f.hours} onChange={set('hours')} placeholder="0" className="inp" /></Field>
        <Field label="工数 (人日)"><input type="number" value={f.manDays} onChange={set('manDays')} placeholder="0" className="inp" /></Field>
      </div>
      <button onClick={submit} className="w-full py-3.5 bg-emerald-600 text-white rounded-xl text-sm font-medium min-h-[48px] active:scale-[0.98] transition-transform">
        登録する
      </button>
    </div>
  );
}

const TITLES = { monthly: '月次データ登録', billing: '請求登録', work: '工数登録' } as const;

export default function EntrySheet() {
  const { sheetOpen, sheetType, closeSheet } = useDashboardStore();

  return (
    <AnimatePresence>
      {sheetOpen && sheetType && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50"
            onClick={closeSheet}
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-2xl max-h-[90vh] flex flex-col"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Sheet handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-zinc-200 rounded-full" />
            </div>
            {/* Sheet header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
              <h2 className="text-base font-medium text-zinc-900">{TITLES[sheetType]}</h2>
              <button
                onClick={closeSheet}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 text-sm"
              >
                ✕
              </button>
            </div>
            {/* Sheet content */}
            <div className="overflow-y-auto px-4 py-4 flex-1">
              {sheetType === 'monthly' && <MonthlyForm onClose={closeSheet} />}
              {sheetType === 'billing' && <BillingForm onClose={closeSheet} />}
              {sheetType === 'work'    && <WorkForm    onClose={closeSheet} />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}