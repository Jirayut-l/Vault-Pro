import React from 'react';
import { Plus, Send } from 'lucide-react';

export default function QuickTransfer() {
  return (
    <div className="animate-slide-up delay-400 rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-5 flex-1 flex flex-col justify-between mt-6">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Quick Transfer</h2>
      
      <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
        <button className="shrink-0 w-10 h-10 rounded-full border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-cyan-500 hover:border-cyan-500 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
        <img src="https://ui-avatars.com/api/?name=Jane&background=A855F7&color=fff" className="shrink-0 w-10 h-10 rounded-full cursor-pointer hover:ring-2 ring-purple-500 transition-all" alt="Jane" />
        <img src="https://ui-avatars.com/api/?name=Bob&background=10B981&color=fff" className="shrink-0 w-10 h-10 rounded-full cursor-pointer hover:ring-2 ring-emerald-500 transition-all" alt="Bob" />
        <img src="https://ui-avatars.com/api/?name=Alice&background=3B82F6&color=fff" className="shrink-0 w-10 h-10 rounded-full cursor-pointer hover:ring-2 ring-blue-500 transition-all" alt="Alice" />
      </div>
      
      <div className="flex gap-2 mt-auto">
        <input 
          type="text" 
          placeholder="$ 0.00" 
          className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button className="bg-cyan-500 hover:bg-cyan-400 text-white p-2 rounded-lg transition-colors shadow-[0_0_10px_rgba(34,211,238,0.3)] shrink-0">
          <Send className="w-5 h-5 -rotate-45 ml-0.5 mb-0.5" />
        </button>
      </div>
    </div>
  );
}
