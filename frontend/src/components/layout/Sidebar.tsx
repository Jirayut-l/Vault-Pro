import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Wallet, ArrowRightLeft, Target, Settings, LogOut, Hexagon } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, active: true },
    { name: 'Analytics', href: '/dashboard/analytics', icon: Target, active: false },
    { name: 'Cards & Accounts', href: '/dashboard/cards', icon: Wallet, active: false },
    { name: 'Scheduled', href: '/dashboard/scheduled', icon: ArrowRightLeft, active: false },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl p-6 fixed left-0 top-0 h-screen z-40 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <Hexagon className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
          FinPulse
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                item.active
                  ? 'bg-cyan-50 dark:bg-white/5 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800/60 space-y-2">
        <Link
          href="/dashboard/settings"
          className="group flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
        <button className="group flex w-full items-center gap-3 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
