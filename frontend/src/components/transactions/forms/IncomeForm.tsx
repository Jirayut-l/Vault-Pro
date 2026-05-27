'use client';

import React, { useState } from 'react';

// Using dummy jar percentages
const JAR_SPLITS = [
  { id: 'NEC', name: 'Necessity Fund', percent: 55, color: 'bg-emerald-500' },
  { id: 'FFA', name: 'Financial Freedom', percent: 10, color: 'bg-blue-500' },
  { id: 'LTS', name: 'Long-term Savings', percent: 10, color: 'bg-indigo-500' },
  { id: 'EDU', name: 'Education', percent: 10, color: 'bg-purple-500' },
  { id: 'PLY', name: 'Play Account', percent: 10, color: 'bg-pink-500' },
  { id: 'GIV', name: 'Give', percent: 5, color: 'bg-rose-500' },
];

export const IncomeForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const numAmount = parseFloat(amount) || 0;

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Visualizer */}
      <div className="relative p-4 rounded-xl bg-slate-900/50 border border-emerald-500/20 overflow-hidden group">
        <div className="absolute inset-0 bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-colors" />
        <h4 className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">Auto-Split Preview</h4>
        
        <div className="space-y-2 relative z-10">
          {JAR_SPLITS.map(jar => {
            const splitAmount = (numAmount * jar.percent) / 100;
            return (
              <div key={jar.id} className="flex items-center text-sm">
                <div className="w-12 text-slate-400 font-medium">{jar.id}</div>
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full mx-3 overflow-hidden">
                  <div 
                    className={`h-full ${jar.color} transition-all duration-500 ease-out`} 
                    style={{ width: `${numAmount > 0 ? jar.percent : 0}%` }}
                  />
                </div>
                <div className="w-20 text-right font-mono text-slate-300">
                  ${splitAmount.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Amount ($ USD)</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-3 text-2xl font-mono text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Description (Optional)</label>
          <input 
            type="text" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-600 transition-all"
            placeholder="e.g. Monthly Salary"
          />
        </div>
      </div>

      <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_0px_rgba(16,185,129,0.6)] transition-all active:scale-[0.98]">
        Save Income
      </button>
    </div>
  );
};
