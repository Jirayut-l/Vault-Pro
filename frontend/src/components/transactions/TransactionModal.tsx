'use client';

import React, { useState } from 'react';
import { GlassModal } from '../ui/GlassModal';
import { IncomeForm } from './forms/IncomeForm';
import { ExpenseForm } from './forms/ExpenseForm';
import { TransferForm } from './forms/TransferForm';

type TabType = 'income' | 'expense' | 'transfer';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('income');

  const getGlowColor = () => {
    switch(activeTab) {
      case 'income': return 'green';
      case 'expense': return 'red';
      case 'transfer': return 'blue';
      default: return 'default';
    }
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} glowColor={getGlowColor()}>
      {/* Tab Switcher */}
      <div className="flex p-1 mb-6 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800">
        <button
          onClick={() => setActiveTab('income')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            activeTab === 'income' 
              ? 'bg-slate-800 text-emerald-400 shadow-sm' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
        >
          Income
        </button>
        <button
          onClick={() => setActiveTab('expense')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            activeTab === 'expense' 
              ? 'bg-slate-800 text-rose-400 shadow-sm' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
        >
          Expense
        </button>
        <button
          onClick={() => setActiveTab('transfer')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            activeTab === 'transfer' 
              ? 'bg-slate-800 text-blue-400 shadow-sm' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
        >
          Transfer
        </button>
      </div>

      {/* Form Area */}
      <div className="min-h-[300px]">
        {activeTab === 'income' && <IncomeForm />}
        {activeTab === 'expense' && <ExpenseForm />}
        {activeTab === 'transfer' && <TransferForm />}
      </div>
    </GlassModal>
  );
};
