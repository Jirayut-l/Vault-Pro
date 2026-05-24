import React from 'react';
import { Wifi, Home, Zap, Shield } from 'lucide-react';

export default function UpcomingBillsWidget() {
  const bills = [
    { id: 1, name: 'Internet Bill', due: 'Due in 2 days', amount: 89.99, icon: Wifi, color: 'text-rose-500 dark:text-rose-400', bgClass: 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/30' },
    { id: 2, name: 'Apartment Rent', due: 'Due in 5 days', amount: 2400.00, icon: Home, color: 'text-slate-500 dark:text-slate-400', bgClass: 'hover:bg-slate-100 dark:hover:bg-white/5 border-transparent' },
    { id: 3, name: 'Electricity', due: 'Due in 8 days', amount: 145.20, icon: Zap, color: 'text-slate-500 dark:text-slate-400', bgClass: 'hover:bg-slate-100 dark:hover:bg-white/5 border-transparent' },
    { id: 4, name: 'Insurance', due: 'Due in 14 days', amount: 350.00, icon: Shield, color: 'text-slate-500 dark:text-slate-400', bgClass: 'hover:bg-slate-100 dark:hover:bg-white/5 border-transparent' },
  ];

  return (
    <div className="animate-slide-up delay-500 rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-[350px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Bills</h2>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {bills.map((bill) => {
          const Icon = bill.icon;
          return (
            <div key={bill.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${bill.bgClass}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${bill.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{bill.name}</p>
                  <p className={`text-xs font-medium ${bill.id === 1 ? 'text-rose-500 dark:text-rose-400' : 'text-slate-500'}`}>{bill.due}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(bill.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
