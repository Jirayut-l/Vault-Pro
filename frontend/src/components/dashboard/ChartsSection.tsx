"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cashFlowData, portfolioAllocation } from '@/lib/mockData';
import { useTheme } from 'next-themes';

export default function ChartsSection() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="animate-slide-up delay-200 lg:col-span-2 rounded-2xl bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 h-[400px]"></div>
    );
  }

  const isDark = resolvedTheme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipBg = isDark ? '#020617e6' : '#ffffffeb';
  const tooltipBorder = isDark ? '#1e293b' : '#e2e8f0';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: tooltipBg, borderColor: tooltipBorder }} className="rounded-xl border p-4 shadow-xl backdrop-blur-md">
          <p style={{ color: tooltipText }} className="mb-2 font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-sm capitalize" style={{ color: textColor }}>{entry.name}:</span>
              <span className="text-sm font-medium" style={{ color: tooltipText }}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-slide-up delay-200 lg:col-span-2 rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Cash Flow Analytics</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-md text-xs font-medium bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30">1M</button>
          <button className="px-3 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:text-white transition-colors">1Y</button>
        </div>
      </div>
      
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cashFlowData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke={textColor} 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke={textColor} 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="income" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" style={{ filter: `drop-shadow(0 0 6px rgba(6,182,212,0.6))` }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
