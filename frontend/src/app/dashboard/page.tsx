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
  AreaChart,
  Area,
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-md bg-slate-950/85 border border-slate-800 p-3 rounded-lg shadow-xl shadow-black/45">
        <p className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">{label}</p>
        <div className="space-y-1">
          {payload.map((pld: any) => (
            <div key={pld.dataKey} className="flex items-center space-x-6 justify-between">
              <span className="flex items-center text-[11px] text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: pld.stroke || pld.color }} />
                {pld.name}
              </span>
              <span className="text-xs font-mono font-bold" style={{ color: pld.stroke || pld.color }}>
                {formatCurrency(pld.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

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
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Decorative Concept A glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Header />
        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-widest">Dashboard</h2>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">Real-time status of your assets and Jar buckets</p>
            </div>
            {usingMock && (
              <div className="flex items-center space-x-2 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium">
                <AlertTriangle className="w-4 h-4" />
                <span>Demo mode (local API offline)</span>
              </div>
            )}
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Balance Card */}
            <div className="relative group overflow-hidden p-6 rounded-2xl border border-slate-800/60 bg-slate-900/50 backdrop-blur-md shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Total Balance</p>
                  <h3 className="text-3xl font-extrabold font-mono tracking-tight text-white">
                    {formatCurrency(activeSummary.totalBalance)}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">All accounts consolidated</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Monthly Income Card */}
            <div className="relative group overflow-hidden p-6 rounded-2xl border border-slate-800/60 bg-slate-900/50 backdrop-blur-md shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Monthly Income</p>
                  <h3 className="text-3xl font-extrabold font-mono tracking-tight text-white">
                    {formatCurrency(activeSummary.monthlyIncome)}
                  </h3>
                  <div className="flex items-center text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full w-fit">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                    <span>+12.4% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Monthly Expenses Card */}
            <div className="relative group overflow-hidden p-6 rounded-2xl border border-slate-800/60 bg-slate-900/50 backdrop-blur-md shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/20 transition-all duration-500" />
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Monthly Expenses</p>
                  <h3 className="text-3xl font-extrabold font-mono tracking-tight text-white">
                    {formatCurrency(activeSummary.monthlyExpenses)}
                  </h3>
                  <div className="flex items-center text-[10px] text-rose-400 font-semibold bg-rose-500/10 px-2.5 py-0.5 rounded-full w-fit">
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                    <span>-4.2% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <TrendingDown className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Trajectory Card */}
            <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-800/60 bg-slate-900/50 backdrop-blur-md shadow-2xl flex flex-col hover:border-slate-700 transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-200 uppercase tracking-widest text-xs flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-primary" /> Monthly Trajectory
                </h3>
                <div className="flex items-center space-x-3 text-[10px] font-semibold">
                  <span className="flex items-center text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" /> Income
                  </span>
                  <span className="flex items-center text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" /> Expense
                  </span>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockMonthlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.6} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="Income" name="Income" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="Expense" name="Expense" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expenses by Category Card */}
            <div className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/50 backdrop-blur-md shadow-2xl flex flex-col hover:border-slate-700 transition-all duration-300">
              <h3 className="font-bold text-slate-200 mb-6 uppercase tracking-widest text-xs flex items-center">
                <ChartIcon className="w-4 h-4 mr-2 text-primary" /> Expenses by Category
              </h3>
              <div className="h-48 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={74}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {mockCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="backdrop-blur-md bg-slate-950/85 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[11px] font-semibold text-slate-300">
                              <span className="flex items-center space-x-1.5">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: data.color }} />
                                <span>{data.name}:</span>
                                <span className="font-mono text-white font-bold">{formatCurrency(data.value)}</span>
                              </span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Total</span>
                  <span className="text-xl font-black font-mono text-white mt-0.5">฿15,000</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-medium">
                {mockCategories.map((c) => {
                  const totalVal = mockCategories.reduce((sum, item) => sum + item.value, 0);
                  const pct = ((c.value / totalVal) * 100).toFixed(0);
                  return (
                    <div key={c.name} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-900/50 transition-colors">
                      <div className="flex items-center space-x-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="truncate text-slate-300">{c.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold pl-1">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Jars Section */}
          <div className="space-y-6 pt-4">
            <div>
              <h3 className="text-base font-black text-slate-200 uppercase tracking-widest flex items-center">
                <span className="w-1 h-4 bg-primary rounded-full mr-2" /> 6 Jars Distribution
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold pl-3">Bucket-based budget allocation model</p>
            </div>
            <JarsSummary jars={activeSummary.jarsSummary} />
          </div>
        </main>
      </div>
    </div>
  );
}

