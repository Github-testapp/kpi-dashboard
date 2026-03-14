'use client';

import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useDashboardStore } from '@/store/dashboardStore';

type MetricKey = 'revenue' | 'profit' | 'expense';

const METRICS: { key: MetricKey; label: string; color: string }[] = [
  { key: 'revenue', label: '売上',   color: '#1D9E75' },
  { key: 'profit',  label: '利益',   color: '#534AB7' },
  { key: 'expense', label: '経費',   color: '#D85A30' },
];

function fmt(n: number) {
  if (n >= 1000000) return `¥${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `¥${(n / 1000).toFixed(0)}K`;
  return `¥${n}`;
}

export default function OverviewTab() {
  const { monthly: raw, } = useDashboardStore();
  const monthly = raw ?? [];
  const [active, setActive] = useState<MetricKey[]>(['revenue', 'profit', 'expense']);

  const latest  = monthly[monthly.length - 1];
  const prev    = monthly[monthly.length - 2];

  const diff = (key: MetricKey) => {
    if (!latest || !prev) return null;
    const d = ((latest[key] - prev[key]) / prev[key]) * 100;
    return d;
  };

  const chartData = monthly.map(m => ({
    month: m.month.slice(5) + '月',
    revenue: m.revenue,
    profit:  m.profit,
    expense: m.expense,
  }));

  const toggle = (key: MetricKey) =>
    setActive(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );

  return (
    <div className="flex flex-col gap-4">

      {/* KPI cards */}
      {latest && (
        <div className="grid grid-cols-3 gap-2">
          {METRICS.map(m => {
            const d = diff(m.key);
            return (
              <div key={m.key} className="bg-white rounded-xl border border-zinc-200 p-3 flex flex-col gap-1">
                <span className="text-xs text-zinc-500">{m.label}</span>
                <span className="text-lg font-medium text-zinc-900 leading-none">{fmt(latest[m.key])}</span>
                {d !== null && (
                  <span className={`text-xs font-medium ${d >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {d >= 0 ? '↑' : '↓'} {Math.abs(d).toFixed(1)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-zinc-900">月次推移</h2>
          <div className="flex gap-1.5">
            {METRICS.map(m => (
              <button
                key={m.key}
                onClick={() => toggle(m.key)}
                className={[
                  'text-xs px-2 py-1 rounded-full border transition-colors min-h-[28px]',
                  active.includes(m.key)
                    ? 'text-white border-transparent'
                    : 'text-zinc-400 border-zinc-200 bg-white',
                ].join(' ')}
                style={active.includes(m.key) ? { background: m.color, borderColor: m.color } : {}}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              {METRICS.map(m => (
                <linearGradient key={m.key} id={`grad-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={m.color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false}
              tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 8, fontSize: 12 }}
              formatter={(v) => fmt(Number(v ?? 0))}
            />
            {METRICS.filter(m => active.includes(m.key)).map(m => (
              <Area key={m.key} type="monotone" dataKey={m.key} name={m.label}
                stroke={m.color} strokeWidth={2}
                fill={`url(#grad-${m.key})`}
                dot={{ r: 2, fill: m.color }} activeDot={{ r: 4 }}
                isAnimationActive animationDuration={400}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly table */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-100">
          <h2 className="text-sm font-medium text-zinc-900">月次データ</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500">
                <th className="px-3 py-2 text-left font-medium">月</th>
                <th className="px-3 py-2 text-right font-medium">売上</th>
                <th className="px-3 py-2 text-right font-medium">利益</th>
                <th className="px-3 py-2 text-right font-medium">経費</th>
              </tr>
            </thead>
            <tbody>
              {[...monthly].reverse().map((m, i) => (
                <tr key={m.id} className={i % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}>
                  <td className="px-3 py-2.5 text-zinc-700">{m.month}</td>
                  <td className="px-3 py-2.5 text-right text-zinc-900 font-medium">{fmt(m.revenue)}</td>
                  <td className="px-3 py-2.5 text-right text-emerald-600">{fmt(m.profit)}</td>
                  <td className="px-3 py-2.5 text-right text-red-500">{fmt(m.expense)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}