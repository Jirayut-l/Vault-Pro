import React from 'react';
import SummaryCard from './SummaryCard';
import { dashboardSummary } from '@/lib/mockData';

export default function DashboardSummary() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <SummaryCard
        title="Total Balance"
        amount={dashboardSummary.totalBalance}
        change={dashboardSummary.balanceChange}
        isPositive={dashboardSummary.balanceChange.startsWith('+')}
        gradientClass="from-cyan-600 to-emerald-600 dark:from-cyan-400 dark:to-emerald-400"
        borderHoverClass="hover:border-cyan-400 dark:hover:border-cyan-500/30"
        delayIndex={0}
      />
      <SummaryCard
        title="Monthly Income"
        amount={dashboardSummary.monthlyIncome}
        change={dashboardSummary.incomeChange}
        isPositive={dashboardSummary.incomeChange.startsWith('+')}
        gradientClass="from-slate-900 to-slate-900 dark:from-white dark:to-white" // Standard text color in mockup for this one
        borderHoverClass="hover:border-purple-400 dark:hover:border-purple-500/30"
        delayIndex={1}
      />
      <SummaryCard
        title="Spending"
        amount={dashboardSummary.spending}
        change={dashboardSummary.spendingChange}
        isPositive={false} // Force negative style based on mockup
        gradientClass="from-slate-900 to-slate-900 dark:from-white dark:to-white"
        borderHoverClass="hover:border-fuchsia-400 dark:hover:border-fuchsia-500/30"
        delayIndex={2}
      />
      <SummaryCard
        title="Total Savings"
        amount={dashboardSummary.savings}
        change={""}
        isPositive={true}
        gradientClass="from-blue-500 to-cyan-400"
        borderHoverClass="hover:border-blue-400 dark:hover:border-blue-500/30"
        delayIndex={3}
        progress={65}
      />
    </section>
  );
}
