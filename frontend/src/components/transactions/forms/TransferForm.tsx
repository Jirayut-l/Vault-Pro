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

export const TransferForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [fromJar, setFromJar] = useState('PLY');
  const [toJar, setToJar] = useState('LTS');
  
  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Amount ($ USD)</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-3 text-2xl font-mono text-blue-400 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            placeholder="0.00"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-400 mb-1">From</label>
            <select 
              value={fromJar}
              onChange={(e) => setFromJar(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-slate-600 transition-all appearance-none"
            >
              {JARS.map(jar => (
                <option key={jar.id} value={jar.id}>{jar.id}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end pb-3 text-slate-600">
            →
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-400 mb-1">To</label>
            <select 
              value={toJar}
              onChange={(e) => setToJar(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-slate-600 transition-all appearance-none"
            >
              {JARS.map(jar => (
                <option key={jar.id} value={jar.id}>{jar.id}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_0px_rgba(59,130,246,0.6)] transition-all active:scale-[0.98]">
        Transfer Funds
      </button>
    </div>
  );
};
