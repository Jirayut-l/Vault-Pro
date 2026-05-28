"use client";

import React, { useState } from 'react';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionFormSlideover } from '@/components/transactions/TransactionFormSlideover';
import { Transaction } from '@/types/transaction';

// Initial mock data based on the API JSON response
const initialMockTransactions: Transaction[] = [
  {
    id: "880e8400-e29b-41d4-a716-446655440000",
    user_id: "123e4567-e89b-12d3-a456-426614174000",
    account_id: "550e8400-e29b-41d4-a716-446655440000",
    target_account_id: "660e8400-e29b-41d4-a716-446655440001",
    amount: "500",
    type: "TRANSFER",
    category: "Internal Transfer",
    note: "Transfer to Play Account",
    transaction_date: "2026-05-22T11:00:00Z",
    created_at: "2026-05-22T09:37:40.754707Z",
    updated_at: "2026-05-22T09:37:40.754707Z"
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440000",
    user_id: "123e4567-e89b-12d3-a456-426614174000",
    account_id: "550e8400-e29b-41d4-a716-446655440000",
    amount: "120",
    type: "EXPENSE",
    category: "Groceries",
    note: "Supermarket purchase",
    transaction_date: "2026-05-22T10:30:00Z",
    created_at: "2026-05-22T09:37:40.752985Z",
    updated_at: "2026-05-22T09:37:40.752985Z"
  },
  {
    id: "7709919b-bad3-4530-9d34-e12d29705cbc",
    user_id: "123e4567-e89b-12d3-a456-426614174000",
    account_id: "660e8400-e29b-41d4-a716-446655440001",
    amount: "3000",
    type: "EXPENSE",
    category: "PLY Expense",
    note: "Mock transaction for PLY",
    transaction_date: "2026-05-09T10:00:00Z",
    created_at: "2026-05-22T09:37:40.761402Z",
    updated_at: "2026-05-22T09:37:40.761402Z"
  }
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialMockTransactions);
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleOpenCreate = () => {
    setEditingTransaction(null);
    setIsSlideoverOpen(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsSlideoverOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleSaveTransaction = (txData: Partial<Transaction>) => {
    if (txData.id) {
      // Update existing
      setTransactions((prev) => prev.map(t => t.id === txData.id ? { ...t, ...txData } as Transaction : t));
    } else {
      // Create new (mock ID and timestamps)
      const newTx: Transaction = {
        ...(txData as Transaction),
        id: crypto.randomUUID(),
        user_id: "123e4567-e89b-12d3-a456-426614174000",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
    setIsSlideoverOpen(false);
  };

  return (
    <div className="animate-fade-in z-0 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-end gap-3 border-b border-slate-200 dark:border-slate-800/60 pb-6">
          <button className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Export CSV
          </button>
          <button 
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center rounded-lg bg-cyan-600/90 dark:bg-cyan-500/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-500 dark:hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all border border-cyan-400/30"
          >
            + New Transaction
          </button>
        </div>
        
        <TransactionFilters />
        
        <div>
          <TransactionTable 
            transactions={transactions} 
            onEdit={handleOpenEdit} 
            onDelete={handleDelete} 
          />
        </div>
      </div>

      <TransactionFormSlideover 
        isOpen={isSlideoverOpen} 
        onClose={() => setIsSlideoverOpen(false)} 
        onSave={handleSaveTransaction} 
        transactionToEdit={editingTransaction} 
      />
    </div>
  );
}
