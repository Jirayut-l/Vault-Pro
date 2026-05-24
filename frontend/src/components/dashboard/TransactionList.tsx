import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { recentTransactions } from '@/lib/mockData';

export default function TransactionList() {
  return (
    <div className="animate-slide-up delay-400 rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-[350px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
        <a href="#" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">View All</a>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {recentTransactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                tx.type === 'income' 
                  ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
                {tx.type === 'income' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">{tx.title}</p>
                <p className="text-[10px] text-slate-500">{tx.category} • Today</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                {tx.type === 'income' ? '+' : '-'}
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
