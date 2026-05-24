"use client";

import React from 'react';
import { useTheme } from 'next-themes';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import ChartsSection from '@/components/dashboard/ChartsSection';
import TransactionList from '@/components/dashboard/TransactionList';
import CreditCardWidget from '@/components/dashboard/CreditCardWidget';
import QuickTransfer from '@/components/dashboard/QuickTransfer';
import { Bell, Sun, Moon } from 'lucide-react';

import AssetAllocationWidget from '@/components/dashboard/AssetAllocationWidget';
import UpcomingBillsWidget from '@/components/dashboard/UpcomingBillsWidget';

export default function DashboardPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6 relative h-full">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      {/* Top Header */}
      <header className="mb-10 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Dashboard Index</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Here's what's happening with your money today.</p>
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

      {/* Main Content Sections */}
      <DashboardSummary />
      
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ChartsSection />
        
        <div className="lg:col-span-1 flex flex-col gap-6 h-full">
          <CreditCardWidget />
          <QuickTransfer />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AssetAllocationWidget />
        <TransactionList />
        <UpcomingBillsWidget />
      </section>
    </div>
  );
}
