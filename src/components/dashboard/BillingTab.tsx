'use client';

import { useDashboardStore } from '@/store/dashboardStore';
import type { BillingRecord } from '@/types/dashboard';

const STATUS_LABEL: Record<BillingRecord['status'], string> = {
  unpaid:  '未入金',
  paid:    '入金済',
  overdue: '期限超過',
};
const STATUS_CLASS: Record<BillingRecord['status'], string> = {
  unpaid:  'bg-amber-50 text-amber-700 border-amber-200',
  paid:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  overdue: 'bg-red-50 text-red-600 border-red-200',
};

function fmt(n: number) {
  return `¥${n.toLocaleString('ja-JP')}`;
}

export default function BillingTab() {
  const { billing: rawB, updateBillingStatus, deleteBilling } = useDashboardStore();
  const billing = rawB ?? [];

  const total   = billing.reduce((s, b) => s + b.amount, 0);
  const paid    = billing.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0);
  const unpaid  = billing.filter(b => b.status === 'unpaid').reduce((s, b) => s + b.amount, 0);
  const overdue = billing.filter(b => b.status === 'overdue').reduce((s, b) => s + b.amount, 0);

  return (
    <div className="flex flex-col gap-4">

      {/* サマリー */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: '請求合計',  value: fmt(total),   cls: 'text-zinc-900' },
          { label: '入金済',    value: fmt(paid),    cls: 'text-emerald-600' },
          { label: '未入金',    value: fmt(unpaid),  cls: 'text-amber-600' },
          { label: '期限超過',  value: fmt(overdue), cls: 'text-red-500' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-zinc-200 p-3 flex flex-col gap-1">
            <span className="text-xs text-zinc-500">{k.label}</span>
            <span className={`text-lg font-medium leading-none ${k.cls}`}>{k.value}</span>
          </div>
        ))}
      </div>

      {/* 請求一覧 */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-100">
          <h2 className="text-sm font-medium text-zinc-900">請求一覧</h2>
        </div>
        {billing.length === 0 ? (
          <p className="px-4 py-6 text-sm text-zinc-400 text-center">データなし</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {billing.map(b => (
              <li key={b.id} className="px-4 py-3 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-800">{b.client}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_CLASS[b.status]}`}>
                    {STATUS_LABEL[b.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-zinc-900">{fmt(b.amount)}</span>
                  <span className="text-xs text-zinc-400">期限: {b.dueDate}</span>
                </div>
                {/* ステータス変更 */}
                <div className="flex gap-1.5 mt-1">
                  {(['unpaid', 'paid', 'overdue'] as BillingRecord['status'][]).map(s => (
                    <button
                      key={s}
                      onClick={() => updateBillingStatus(b.id, s)}
                      className={[
                        'text-xs px-2.5 py-1 rounded-full border min-h-[28px] transition-colors',
                        b.status === s
                          ? STATUS_CLASS[s]
                          : 'text-zinc-400 border-zinc-200',
                      ].join(' ')}
                    >
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                  <button
                    onClick={() => deleteBilling(b.id)}
                    className="ml-auto text-xs text-red-400 px-2 py-1 rounded min-h-[28px]"
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}