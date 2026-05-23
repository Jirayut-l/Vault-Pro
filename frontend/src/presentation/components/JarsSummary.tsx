'use client';

import React from 'react';
import { JarSummary } from '../../core/entities/dashboard';
import { formatCurrency, getJarFullName, getJarDescription } from '../../core/usecases/formatting';

interface JarsSummaryProps {
  jars: JarSummary[];
}

export function JarsSummary({ jars }: JarsSummaryProps) {
  const jarOrder = ['NEC', 'FFA', 'LTS', 'EDU', 'PLY', 'GIV'];
  const sortedJars = [...jars].sort((a, b) => jarOrder.indexOf(a.type) - jarOrder.indexOf(b.type));

  const jarColorClasses: Record<string, { bar: string; text: string; bg: string }> = {
    NEC: { bar: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    FFA: { bar: 'bg-blue-500', text: 'text-blue-500', bg: 'bg-blue-500/10' },
    LTS: { bar: 'bg-purple-500', text: 'text-purple-500', bg: 'bg-purple-500/10' },
    EDU: { bar: 'bg-indigo-500', text: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    PLY: { bar: 'bg-rose-500', text: 'text-rose-500', bg: 'bg-rose-500/10' },
    GIV: { bar: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedJars.map((jar) => {
        const colors = jarColorClasses[jar.type] || { bar: 'bg-primary', text: 'text-primary', bg: 'bg-primary/10' };
        const percent = jar.percentage || 0;

        return (
          <div
            key={jar.type}
            className="p-5 rounded-xl border border-border-color bg-card-bg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-foreground text-sm sm:text-base">{getJarFullName(jar.type)}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{getJarDescription(jar.type)}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors.bg} ${colors.text}`}>
                {jar.type}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground">
                {formatCurrency(jar.balance)}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Jar Share</span>
                <span className="font-semibold font-mono">{percent.toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${colors.bar} transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default JarsSummary;
