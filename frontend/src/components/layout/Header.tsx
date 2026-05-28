"use client";

import React from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { Bell, Sun, Moon } from 'lucide-react';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  let title = "Dashboard Index";
  let description = "Here's what's happening with your money today.";

  if (pathname?.includes('/transactions')) {
    title = "Transactions";
    description = "View and manage your recent transactions.";
  } else if (pathname?.includes('/analytics')) {
    title = "Analytics";
    description = "Dive deep into your financial insights.";
  } else if (pathname?.includes('/cards')) {
    title = "Cards & Accounts";
    description = "Manage your connected cards and bank accounts.";
  } else if (pathname?.includes('/scheduled')) {
    title = "Scheduled";
    description = "Review your upcoming and scheduled payments.";
  } else if (pathname?.includes('/settings')) {
    title = "Settings";
    description = "Configure your account preferences.";
  }

  return (
    <header className="mb-10 flex items-center justify-between shrink-0">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all border border-slate-200 dark:border-slate-700"
        >
          <Sun className="hidden dark:block w-5 h-5" />
          <Moon className="block dark:hidden w-5 h-5" />
        </button>
        
        <button className="relative text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-fuchsia-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse"></span>
        </button>
        
        <div className="flex items-center gap-3 cursor-pointer">
          <img src="https://ui-avatars.com/api/?name=Alex&background=0D8B93&color=fff" alt="User" className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors" />
        </div>
      </div>
    </header>
  );
}
