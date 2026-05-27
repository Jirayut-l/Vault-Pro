"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { portfolioAllocation } from '@/lib/mockData';
import { useTheme } from 'next-themes';

export default function AssetAllocationWidget() {
  const { resolvedTheme } = useTheme();
  
  const isDark = resolvedTheme === 'dark';
  const tooltipBg = isDark ? '#020617e6' : '#ffffffeb';
  const tooltipBorder = isDark ? '#1e293b' : '#e2e8f0';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: tooltipBg, borderColor: tooltipBorder }} className="rounded-xl border p-3 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: payload[0].payload.color }}></div>
            <span className="text-sm font-medium" style={{ color: tooltipText }}>
              {payload[0].name}: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-slide-up delay-300 rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-[350px]">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Asset Allocation</h2>
      <div className="flex-1 flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={portfolioAllocation}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={200}
              animationDuration={1500}
            >
              {portfolioAllocation.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 6px ${entry.color}80)` }} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{portfolioAllocation.length}</span>
          <span className="text-[10px] text-slate-500">Assets</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-between mt-4 text-xs">
        {portfolioAllocation.map((item) => (
          <div key={item.name} className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span> 
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
