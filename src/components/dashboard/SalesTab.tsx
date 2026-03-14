'use client';

import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDashboardStore } from '@/store/dashboardStore';

export default function SalesTab() {
  const monthly = useDashboardStore(s => s.monthly ?? []);

  const latest = monthly[monthly.length - 1];
  const prev   = monthly[monthly.length - 2];

  const cvr = (m: typeof latest) =>
    m && m.deals > 0 ? Math.round((m.closed / m.deals) * 1000) / 10 : 0;

  const chartData = monthly.map(m => ({
    month:    m.month.slice(5) + '月',
    顧客数:   m.customers,
    案件数:   m.deals,
    成約数:   m.closed,
    成約率:   cvr(m),
  }));

  const kpis = latest ? [
    { label: '顧客数',  value: `${latest.customers}社`,  prev: prev?.customers,  cur: latest.customers,  unit: '社' },
    { label: '案件数',  value: `${latest.deals}件`,      prev: prev?.deals,      cur: latest.deals,      unit: '件' },
    { label: '成約数',  value: `${latest.closed}件`,     prev: prev?.closed,     cur: latest.closed,     unit: '件' },
    { label: '成約率',  value: `${cvr(latest)}%`,        prev: cvr(prev),        cur: cvr(latest),       unit: '%' },
  ] : [];

  return (
    <div className="flex flex-col gap-4">

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-2">
        {kpis.map(k => {
          const d = k.prev != null && k.prev !== 0
            ? ((k.cur - k.prev) / k.prev) * 100 : null;
          return (
            <div key={k.label} className="bg-white rounded-xl border border-zinc-200 p-3 flex flex-col gap-1 min-h-[80px]">
              <span className="text-xs text-zinc-500">{k.label}</span>
              <span className="text-2xl font-medium text-zinc-900 leading-none">{k.value}</span>
              {d !== null && (
                <span className={`text-xs font-medium ${d >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {d >= 0 ? '↑' : '↓'} {Math.abs(d).toFixed(1)}% 前月比
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* 顧客・案件・成約 棒グラフ */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4">
        <h2 className="text-sm font-medium text-zinc-900 mb-3">顧客数 / 案件数 / 成約数</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="顧客数" fill="#1D9E75" radius={[3,3,0,0]} isAnimationActive animationDuration={400} />
            <Bar dataKey="案件数" fill="#534AB7" radius={[3,3,0,0]} isAnimationActive animationDuration={400} />
            <Bar dataKey="成約数" fill="#D85A30" radius={[3,3,0,0]} isAnimationActive animationDuration={400} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 成約率 折れ線グラフ */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4">
        <h2 className="text-sm font-medium text-zinc-900 mb-3">成約率推移</h2>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false}
              tickFormatter={v => `${v}%`} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 8, fontSize: 12 }}
              formatter={(v) => [`${v ?? 0}%`, '成約率']} />
            <Line type="monotone" dataKey="成約率" stroke="#534AB7" strokeWidth={2}
              dot={{ r: 3, fill: '#534AB7' }} activeDot={{ r: 5 }}
              isAnimationActive animationDuration={400} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}