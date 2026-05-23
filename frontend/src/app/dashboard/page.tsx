'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as ChartIcon,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ChartTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import Sidebar from '../../presentation/components/Sidebar';
import Header from '../../presentation/components/Header';
import JarsSummary from '../../presentation/components/JarsSummary';
import { apiClient } from '../../infrastructure/api/client';
import { formatCurrency } from '../../core/usecases/formatting';

const mockSummary = {
  totalBalance: '85000.00',
  monthlyIncome: '100000.00',
  monthlyExpenses: '15000.00',
  jarsSummary: [
    { type: 'NEC', balance: '40000.00', percentage: 47.05 },
    { type: 'FFA', balance: '15000.00', percentage: 17.64 },
    { type: 'LTS', balance: '10000.00', percentage: 11.76 },
    { type: 'EDU', balance: '8000.00', percentage: 9.41 },
    { type: 'PLY', balance: '7000.00', percentage: 8.24 },
    { type: 'GIV', balance: '5000.00', percentage: 5.88 },
  ],
};

const mockCategories = [
  { name: 'Food & Dining', value: 5500, color: '#10b981' },
  { name: 'Transportation', value: 2000, color: '#0ea5e9' },
  { name: 'Utilities', value: 1500, color: '#a855f7' },
  { name: 'Rent & Living', value: 4500, color: '#f43f5e' },
  { name: 'Other', value: 1500, color: '#64748b' },
];

const mockMonthlyStats = [
  { name: 'Jan', Income: 80000, Expense: 12000 },
  { name: 'Feb', Income: 95000, Expense: 14000 },
  { name: 'Mar', Income: 90000, Expense: 18000 },
  { name: 'Apr', Income: 110000, Expense: 20000 },
  { name: 'May', Income: 100000, Expense: 15000 },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [usingMock, setUsingMock] = useState(false);

  const { data: summaryData, isLoading: loadingSummary } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      try {
        const data = await apiClient('/api/v1/dashboard/summary');
        return {
          totalBalance: data.total_balance,
          monthlyIncome: data.monthly_income,
          monthlyExpenses: data.monthly_expenses,
          jarsSummary: data.jars_summary.map((j: any) => ({
            type: j.type,
            balance: j.balance,
            percentage: j.percentage,
          })),
        };
      } catch (err) {
        console.warn('API connection failed. Using mock data instead.');
        setUsingMock(true);
        return mockSummary;
      }
    },
    enabled: status === 'authenticated',
  });

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading' || (status === 'authenticated' && loadingSummary)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const activeSummary = summaryData || mockSummary;

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-foreground uppercase tracking-wider">Dashboard</h2>
              <p className="text-xs text-slate-500 mt-1">Real-time status of your assets and Jar buckets</p>
            </div>
            {usingMock && (
              <div className="flex items-center space-x-2 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Running in demo mode (Local API disconnected)</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-border-color bg-card-bg shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Balance</p>
                <h3 className="text-2xl font-bold font-mono tracking-tight text-foreground">
                  {formatCurrency(activeSummary.totalBalance)}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Wallet className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-xl border border-border-color bg-card-bg shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Monthly Income</p>
                <h3 className="text-2xl font-bold font-mono tracking-tight text-foreground">
                  {formatCurrency(activeSummary.monthlyIncome)}
                </h3>
                <div className="flex items-center text-[10px] text-emerald-500 font-semibold">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  <span>+12.4% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-xl border border-border-color bg-card-bg shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Monthly Expenses</p>
                <h3 className="text-2xl font-bold font-mono tracking-tight text-foreground">
                  {formatCurrency(activeSummary.monthlyExpenses)}
                </h3>
                <div className="flex items-center text-[10px] text-rose-500 font-semibold">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  <span>-4.2% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <TrendingDown className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-xl border border-border-color bg-card-bg shadow-sm flex flex-col">
              <h3 className="font-bold text-foreground mb-4 uppercase tracking-wider text-xs flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-primary" /> Monthly Trajectory
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockMonthlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="name" stroke="var(--foreground)" opacity={0.5} fontSize={11} />
                    <YAxis stroke="var(--foreground)" opacity={0.5} fontSize={11} />
                    <ChartTooltip
                      contentStyle={{
                        background: 'var(--card-bg)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--foreground)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-border-color bg-card-bg shadow-sm flex flex-col">
              <h3 className="font-bold text-foreground mb-4 uppercase tracking-wider text-xs flex items-center">
                <ChartIcon className="w-4 h-4 mr-2 text-primary" /> Expenses by Category
              </h3>
              <div className="h-48 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {mockCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      contentStyle={{
                        background: 'var(--card-bg)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--foreground)',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest">Total</span>
                  <span className="text-xs sm:text-sm font-bold font-mono">฿15,000</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] sm:text-xs text-slate-500 font-medium">
                {mockCategories.map((c) => (
                  <div key={c.name} className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="truncate">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground uppercase tracking-wider">6 Jars Distribution</h3>
            <JarsSummary jars={activeSummary.jarsSummary} />
          </div>
        </main>
      </div>
    </div>
  );
}
