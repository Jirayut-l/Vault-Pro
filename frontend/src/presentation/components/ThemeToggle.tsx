'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useUIStore } from '../../infrastructure/store/ui';

export function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-full border border-border-color bg-card-bg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 shadow-sm focus:outline-none overflow-hidden group cursor-pointer"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 transition-transform duration-500 transform group-hover:scale-110">
        {/* Sun Icon */}
        <span className={`absolute inset-0 transform transition-all duration-500 ${
          theme === 'dark' ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}>
          <Sun className="w-5 h-5 text-amber-500 fill-amber-400" />
        </span>
        {/* Moon Icon */}
        <span className={`absolute inset-0 transform transition-all duration-500 ${
          theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
        }`}>
          <Moon className="w-5 h-5 text-primary fill-slate-950 dark:fill-primary" />
        </span>
      </div>
    </button>
  );
}
export default ThemeToggle;
