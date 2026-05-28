"use client";

import React from 'react';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import ChartsSection from '@/components/dashboard/ChartsSection';
import TransactionList from '@/components/dashboard/TransactionList';
import CreditCardWidget from '@/components/dashboard/CreditCardWidget';
import QuickTransfer from '@/components/dashboard/QuickTransfer';
import AssetAllocationWidget from '@/components/dashboard/AssetAllocationWidget';
import UpcomingBillsWidget from '@/components/dashboard/UpcomingBillsWidget';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
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
