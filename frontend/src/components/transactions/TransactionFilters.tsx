import React from 'react';

export function TransactionFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-700/50 backdrop-blur-md shadow-lg shadow-black/20">
      <div className="flex-1">
        <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-1.5 block opacity-80">Search Ledger</label>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full bg-slate-950/80 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-slate-200 placeholder:text-slate-500 font-mono shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
          />
        </div>
      </div>
      <div className="w-full sm:w-48">
        <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-1.5 block opacity-80">Account Focus</label>
        <select className="w-full bg-slate-950/80 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-slate-200 appearance-none font-mono shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
          <option value="ALL">ALL JARS</option>
          <option value="NEC">NECESSITY [NEC]</option>
          <option value="PLY">PLAY [PLY]</option>
          <option value="FFA">FREEDOM [FFA]</option>
        </select>
      </div>
      <div className="w-full sm:w-48">
        <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-1.5 block opacity-80">Timeframe</label>
        <select className="w-full bg-slate-950/80 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-slate-200 appearance-none font-mono shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
          <option value="30">T-30 DAYS</option>
          <option value="90">T-90 DAYS</option>
          <option value="all">ALL TIME</option>
        </select>
      </div>
    </div>
  );
}
