import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: string | number;
  change: string;
  isPositive: boolean;
  gradientClass: string;
  borderHoverClass: string;
  delayIndex?: number;
  progress?: number;
}

export default function SummaryCard({
  title,
  amount,
  change,
  isPositive,
  gradientClass,
  borderHoverClass,
  delayIndex = 0,
  progress,
}: SummaryCardProps) {
  const delayClass = `delay-${delayIndex * 100}`;
  
  return (
    <div
      className={`group animate-slide-up ${delayClass} rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 hover:-translate-y-1 ${borderHoverClass} transition-all duration-300`}
    >
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">{title}</h3>
      <div className={`text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradientClass} mb-2`}>
        {typeof amount === 'number' 
          ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
          : amount}
      </div>
      
      {progress !== undefined ? (
        <>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-4">
            <div className={`bg-gradient-to-r ${gradientClass} h-1.5 rounded-full`} style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">{progress}% of yearly goal</p>
        </>
      ) : (
        <div className={`flex items-center gap-2 text-sm ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-fuchsia-600 dark:text-fuchsia-400'}`}>
          <span>{change} vs last month</span>
        </div>
      )}
    </div>
  );
}
