"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import api from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardSummary {
  total_balance: string;
  jars: Record<string, string>;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await api.get("/dashboard/summary");
        if (res.data.success) {
          setSummary(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard summary", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  const jarColors: Record<string, string> = {
    NEC: "oklch(0.7 0.18 160)", // Emerald
    FFA: "oklch(0.55 0.25 285)", // Purple
    LTS: "oklch(0.65 0.22 15)", // Rose
    EDU: "oklch(0.8 0.15 200)", // Sky
    PLY: "oklch(0.9 0.12 60)", // Amber
    GIV: "oklch(0.4 0.05 260)", // Muted
  };

  const pieData = summary ? Object.keys(summary.jars).map(key => ({
    name: key,
    value: parseFloat(summary.jars[key]),
  })) : [];

  // Mock data for the trajectory chart to match Trackify look
  const chartData = [
    { name: "01", balance: 12000 },
    { name: "02", balance: 15000 },
    { name: "03", balance: 18000 },
    { name: "04", balance: 16000 },
    { name: "05", balance: 21000 },
    { name: "06", balance: 24000 },
    { name: "07", balance: 23000 },
    { name: "08", balance: 28000 },
    { name: "09", balance: 32000 },
    { name: "10", balance: 38000 },
    { name: "11", balance: 35000 },
    { name: "12", balance: 42000 },
    { name: "13", balance: 48000 },
    { name: "14", balance: 52000 },
    { name: "15", balance: 58000 },
  ];

  if (loading) {
    return (
      <div className="space-y-8 p-4">
        <div className="space-y-2">
          <Skeleton className="h-12 w-48 bg-card" />
          <Skeleton className="h-6 w-96 bg-card" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl bg-card" />
          ))}
        </div>
        <Skeleton className="h-[450px] w-full rounded-2xl bg-card" />
      </div>
    );
  }

  return (
    <div className="space-y-10 p-4">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-5xl font-bold tracking-tight text-white flex items-center gap-3">
          Dashboard <span className="text-4xl">🔥</span>
        </h1>
        <p className="text-lg text-slate-400 font-medium">
          Your systems are performing at peak efficiency. Here is your operational intelligence for today.
        </p>
      </div>

      {/* Top Quick Actions / Stats */}
      <div className="flex flex-wrap gap-3">
         <button className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
            Invite User
         </button>
         <button className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
            New Report
         </button>
         <button className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
            Launch Campaign
         </button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card rounded-2xl p-2 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
             <div className="p-3 rounded-xl bg-primary/10">
               <Wallet className="h-6 w-6 text-primary" />
             </div>
             <div className="h-1 w-1 rounded-full bg-slate-700" />
          </CardHeader>
          <CardContent className="pt-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Total Balance</CardTitle>
            <div className="text-3xl font-bold text-financial text-white">
              ฿{parseFloat(summary?.total_balance || "0").toLocaleString()}
            </div>
            <p className="text-sm font-bold text-emerald-500 flex items-center gap-1 mt-2">
              +14.5% <span className="text-slate-600 font-normal">from last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card rounded-2xl p-2 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
             <div className="p-3 rounded-xl bg-emerald-500/10">
               <TrendingUp className="h-6 w-6 text-emerald-500" />
             </div>
             <div className="h-1 w-1 rounded-full bg-slate-700" />
          </CardHeader>
          <CardContent className="pt-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Active Tenants</CardTitle>
            <div className="text-3xl font-bold text-financial text-white">
              1,245
            </div>
            <p className="text-sm font-bold text-emerald-500 flex items-center gap-1 mt-2">
              +34 <span className="text-slate-600 font-normal">today</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card rounded-2xl p-2 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
             <div className="p-3 rounded-xl bg-rose-500/10">
               <TrendingDown className="h-6 w-6 text-rose-500" />
             </div>
             <div className="h-1 w-1 rounded-full bg-slate-700" />
          </CardHeader>
          <CardContent className="pt-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">MRR Churn</CardTitle>
            <div className="text-3xl font-bold text-financial text-white">
              1.2%
            </div>
            <p className="text-sm font-bold text-rose-500 flex items-center gap-1 mt-2">
              -0.4% <span className="text-slate-600 font-normal">from average</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card rounded-2xl p-2 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
             <div className="p-3 rounded-xl bg-sky-500/10">
               <ArrowUpRight className="h-6 w-6 text-sky-500" />
             </div>
             <div className="h-1 w-1 rounded-full bg-slate-700" />
          </CardHeader>
          <CardContent className="pt-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Avg Check Size</CardTitle>
            <div className="text-3xl font-bold text-financial text-white">
              ฿48.50
            </div>
            <p className="text-sm font-bold text-amber-500 flex items-center gap-1 mt-2">
              Stable <span className="text-slate-600 font-normal">this week</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border bg-card rounded-2xl p-4">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Revenue Trajectory</CardTitle>
            <p className="text-sm text-slate-500">Trailing 15-day gross volume</p>
          </CardHeader>
          <CardContent className="h-[400px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.55 0.25 285)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="oklch(0.55 0.25 285)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="oklch(1 0 0 / 5%)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "oklch(0.7 0.02 260)", fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "oklch(0.7 0.02 260)", fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(value) => `฿${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "oklch(0.14 0.02 260)", 
                    border: "1px solid oklch(1 0 0 / 10%)", 
                    borderRadius: "12px",
                    color: "#fff" 
                  }}
                  itemStyle={{ color: "oklch(0.55 0.25 285)" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="oklch(0.55 0.25 285)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border bg-card rounded-2xl p-4 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">System Health</CardTitle>
              <div className="h-4 w-4 text-primary">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
            </div>
            <p className="text-sm text-slate-500">Overall infrastructure score</p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center">
             <div className="relative flex items-center justify-center">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="70" stroke="oklch(1 0 0 / 5%)" strokeWidth="12" fill="none" />
                  <circle cx="96" cy="96" r="70" stroke="oklch(0.55 0.25 285)" strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset="44" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                </svg>
                <div className="absolute flex flex-col items-center">
                   <span className="text-5xl font-bold text-white">94%</span>
                </div>
             </div>

             <div className="w-full mt-8 space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-sm font-semibold text-white">99.9% Uptime</span>
                   <span className="text-xs text-slate-500">Trailing 30 days availability</span>
                </div>
                <div className="h-16 w-full overflow-hidden rounded-lg bg-emerald-500/10 flex items-end gap-0.5">
                   {[...Array(40)].map((_, i) => (
                      <div key={i} className="flex-1 bg-emerald-500/40 rounded-t-sm" style={{ height: `${Math.random() * 60 + 20}%` }} />
                   ))}
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
