import React from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex selection:bg-cyan-500/30">
      <Sidebar />
      <main className="flex-1 lg:pl-64 h-screen overflow-hidden">
        {children}
      </main>
    </div>
  );
}
