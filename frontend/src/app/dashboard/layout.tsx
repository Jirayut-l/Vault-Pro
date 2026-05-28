import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex selection:bg-cyan-500/30">
      <Sidebar />
      <main className="flex-1 lg:pl-64 h-screen overflow-hidden">
        <div className="flex flex-col h-full overflow-y-auto p-8 relative">
          {/* Background ambient glows */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          
          <Header />
          <div className="flex-1">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
