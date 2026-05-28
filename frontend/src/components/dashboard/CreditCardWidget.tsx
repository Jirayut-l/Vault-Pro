import React from 'react';
import { Hexagon } from 'lucide-react';

export default function CreditCardWidget() {
  return (
    <div className="animate-slide-up delay-300 relative rounded-2xl p-6 overflow-hidden bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-950 text-slate-900 dark:text-white shadow-xl dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-slate-700 flex-1 transition-colors duration-300 min-h-[200px]">
      {/* Background radial glows */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex justify-between items-center mb-6">
        <span className="font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
          Vault Pro
        </span>
        <Hexagon className="w-8 h-8 text-slate-400 dark:text-slate-400 opacity-80" />
      </div>

      <div className="relative z-10 text-xl font-mono mb-6 tracking-[0.2em] text-slate-600 dark:text-slate-200">
        **** **** **** 4289
      </div>

      <div className="relative z-10 flex justify-between text-sm mt-auto">
        <div>
          <span className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Card Holder</span><br />
          <span className="font-medium text-slate-900 dark:text-white">ALEX DOE</span>
        </div>
        <div className="text-right">
          <span className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Expires</span><br />
          <span className="font-medium text-slate-900 dark:text-white">12/28</span>
        </div>
      </div>
    </div>
  );
}
