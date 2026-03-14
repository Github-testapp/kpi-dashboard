'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { useDashboardStore } from '@/store/dashboardStore';

export default function WorkTab() {
  const { monthly: rawM, work: rawW, deleteWork } = useDashboardStore();
  const monthly = rawM ?? [];
  const work    = rawW ?? [];

  const chartData = monthly.map(m => ({
    month:    m.month.slice(5) + '月',
    稼働時間: m.workHours,
    工数人日: m.manDays,
  }));

  const latest   = monthly[monthly.length - 1];
  const prev     = monthly[monthly.length - 2];
  const diff = (cur: number, p: number) =>
    p > 0 ? ((cur - p) / p * 100).toFixed(1) : null;

  // 最新月のプロジェクト別工数
  const latestMonth = latest?.month ?? '';
  const projects = work.filter(w => w.month === latestMonth);

  return (
    <div className="flex flex-col gap-4">

      {/* KPI */}
      {latest && (
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: '稼働時間', value: `${latest.workHours}h`, cur: latest.workHours, p: prev?.workHours ?? 0 },
            { label: '工数',     value: `${latest.manDays}人日`, cur: latest.manDays,   p: prev?.manDays ?? 0 },
          ].map(k => {
            const d = diff(k.cur, k.p);
            return (
              <div key={k.label} className="bg-white rounded-xl border border-zinc-200 p-3 flex flex-col gap-1 min-h-[80px]">
                <span className="text-xs text-zinc-500">{k.label}</span>
                <span className="text-2xl font-medium text-zinc-900 leading-none">{k.value}</span>
                {d !== null && (
                  <span className={`text-xs font-medium ${Number(d) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {Number(d) >= 0 ? '↑' : '↓'} {Math.abs(Number(d))}% 前月比
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4">
        <h2 className="text-sm font-medium text-zinc-900 mb-3">稼働時間 / 工数推移</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="稼働時間" fill="#1D9E75" radius={[3,3,0,0]} isAnimationActive animationDuration={400} />
            <Bar dataKey="工数人日" fill="#534AB7" radius={[3,3,0,0]} isAnimationActive animationDuration={400} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* プロジェクト別工数 */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-900">プロジェクト別工数 ({latestMonth})</h2>
        </div>
        {projects.length === 0 ? (
          <p className="px-4 py-6 text-sm text-zinc-400 text-center">データなし</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {projects.map(w => (
              <li key={w.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm text-zinc-800">{w.project}</p>
                  <p className="text-xs text-zinc-400">{w.hours}h / {w.manDays}人日</p>
                </div>
                <button
                  onClick={() => deleteWork(w.id)}
                  className="text-xs text-red-400 px-2 py-1 rounded min-h-[32px]"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}