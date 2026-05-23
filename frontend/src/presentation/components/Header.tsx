'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, LogOut } from 'lucide-react';
import { useUIStore } from '../../infrastructure/store/ui';
import ThemeToggle from './ThemeToggle';

export function Header() {
  const { data: session } = useSession();
  const { setSidebarOpen } = useUIStore();

  return (
    <header className="h-16 px-6 border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground tracking-wide hidden sm:block">Personal Finance</h1>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />

        {session ? (
          <div className="flex items-center space-x-3 border-l border-border-color pl-4">
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-foreground">
                {session.user?.email}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">Personal Vault</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
export default Header;
