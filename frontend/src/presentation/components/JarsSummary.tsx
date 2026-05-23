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

  const jarColorConfigs: Record<string, {
    bar: string;
    text: string;
    bg: string;
    glow: string;
    border: string;
    gradient: string;
  }> = {
    NEC: {
      bar: 'bg-emerald-500',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      glow: 'hover:shadow-emerald-500/5',
      border: 'border-emerald-500/20',
      gradient: 'from-emerald-500 to-teal-400'
    },
    FFA: {
      bar: 'bg-sky-500',
      text: 'text-sky-400',
      bg: 'bg-sky-500/10',
      glow: 'hover:shadow-sky-500/5',
      border: 'border-sky-500/20',
      gradient: 'from-sky-500 to-blue-500'
    },
    LTS: {
      bar: 'bg-purple-500',
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      glow: 'hover:shadow-purple-500/5',
      border: 'border-purple-500/20',
      gradient: 'from-purple-500 to-fuchsia-500'
    },
    EDU: {
      bar: 'bg-indigo-500',
      text: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      glow: 'hover:shadow-indigo-500/5',
      border: 'border-indigo-500/20',
      gradient: 'from-indigo-500 to-violet-500'
    },
    PLY: {
      bar: 'bg-rose-500',
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      glow: 'hover:shadow-rose-500/5',
      border: 'border-rose-500/20',
      gradient: 'from-rose-500 to-pink-500'
    },
    GIV: {
      bar: 'bg-amber-500',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      glow: 'hover:shadow-amber-500/5',
      border: 'border-amber-500/20',
      gradient: 'from-amber-500 to-yellow-500'
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedJars.map((jar) => {
        const config = jarColorConfigs[jar.type] || {
          bar: 'bg-primary',
          text: 'text-primary',
          bg: 'bg-primary/10',
          glow: 'hover:shadow-primary/5',
          border: 'border-primary/20',
          gradient: 'from-primary to-sky-400'
        };
        const percent = jar.percentage || 0;

        return (
          <div
            key={jar.type}
            className={`group p-6 rounded-2xl border border-slate-800/60 bg-slate-900/50 backdrop-blur-md shadow-2xl hover:-translate-y-1 hover:border-slate-700 ${config.glow} transition-all duration-300 relative overflow-hidden`}
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-800/40 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-100 text-sm sm:text-base tracking-tight">{getJarFullName(jar.type)}</h3>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{getJarDescription(jar.type)}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest border uppercase ${config.bg} ${config.text} ${config.border}`}>
                {jar.type}
              </span>
            </div>

            <div className="mt-6 relative z-10">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
                {formatCurrency(jar.balance)}
              </span>
            </div>

            <div className="mt-6 relative z-10">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
                <span>Jar Share</span>
                <span className="font-semibold font-mono text-slate-200">{percent.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900/80 overflow-hidden border border-slate-800/40">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-1000 ease-out`}
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

