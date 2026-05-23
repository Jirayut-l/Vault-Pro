'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, Landmark, LineChart, X } from 'lucide-react';
import { useUIStore } from '../../infrastructure/store/ui';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: ReceiptText },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950/50 backdrop-blur-md text-slate-200 border-r border-slate-800/60 flex flex-col transition-all duration-300 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } md:relative md:translate-x-0`}>
      {/* Header / Brand */}
      <div className="h-16 px-6 border-b border-slate-900 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Landmark className="w-6 h-6 text-primary" />
          <span className="font-extrabold text-lg tracking-widest bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">
            VAULT PRO
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 transition-colors md:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-primary border-l-2 border-primary'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 transition-colors ${
                isActive ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'
              }`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Info */}
      <div className="p-4 border-t border-slate-900/60">
        <p className="text-xs text-slate-500 text-center font-mono">Vault Pro v11.0</p>
      </div>
    </aside>
  );
}
export default Sidebar;
