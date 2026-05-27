'use client';

import React, { useState } from 'react';

const JARS = [
  { id: 'NEC', name: 'Necessity Fund' },
  { id: 'PLY', name: 'Play Account' },
  { id: 'FFA', name: 'Financial Freedom' },
  { id: 'LTS', name: 'Long-term Savings' },
  { id: 'EDU', name: 'Education' },
  { id: 'GIV', name: 'Give' },
];

export const ExpenseForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [jarId, setJarId] = useState('NEC');
  const [description, setDescription] = useState('');

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Amount ($ USD)</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-3 text-2xl font-mono text-rose-400 placeholder:text-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Deduct From</label>
          <select 
            value={jarId}
            onChange={(e) => setJarId(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-slate-600 transition-all appearance-none"
          >
            {JARS.map(jar => (
              <option key={jar.id} value={jar.id}>
                {jar.name} ({jar.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
          <input 
            type="text" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-600 transition-all"
            placeholder="e.g. Groceries"
          />
        </div>
      </div>

      <button className="w-full bg-rose-500 hover:bg-rose-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_0_20px_-5px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_0px_rgba(244,63,94,0.6)] transition-all active:scale-[0.98]">
        Record Expense
      </button>
    </div>
  );
};
