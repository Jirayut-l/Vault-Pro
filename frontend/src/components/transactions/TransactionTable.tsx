import React from 'react';
import { Transaction } from '@/types/transaction';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  const formatCurrency = (amount: string) => {
    const val = parseFloat(amount);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const formatDate = (dateString: string) => {
    // YYYY-MM-DD HH:MM format for high tech look
    const d = new Date(dateString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-md shadow-lg shadow-black/20 animate-fade-in relative z-10">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-[10px] text-cyan-500 uppercase tracking-[0.2em] bg-slate-950/80 border-b border-slate-700/50">
            <tr>
              <th scope="col" className="px-6 py-4 font-bold whitespace-nowrap opacity-90">Date</th>
              <th scope="col" className="px-6 py-4 font-bold opacity-90">Description</th>
              <th scope="col" className="px-6 py-4 font-bold opacity-90">Category</th>
              <th scope="col" className="px-6 py-4 font-bold opacity-90">Type</th>
              <th scope="col" className="px-6 py-4 font-bold text-right opacity-90">Amount</th>
              <th scope="col" className="px-4 py-4 font-bold text-right opacity-90">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {transactions.map((tx) => {
              const isExpense = tx.type === 'EXPENSE';
              const isIncome = tx.type === 'INCOME';
              const isTransfer = tx.type === 'TRANSFER';
              
              return (
                <tr key={tx.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-3 whitespace-nowrap text-slate-400 font-mono text-[13px]">
                    {formatDate(tx.transaction_date)}
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-slate-200 font-medium group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                      {isExpense && <span className="text-fuchsia-500/70 text-xs">▼</span>}
                      {isIncome && <span className="text-emerald-500/70 text-xs">▲</span>}
                      {isTransfer && <span className="text-indigo-400/70 text-xs">◆</span>}
                      {tx.note || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest bg-cyan-950/30 text-cyan-400 border border-cyan-800/50">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                      isExpense ? 'bg-fuchsia-950/20 text-fuchsia-400 border-fuchsia-900/30' :
                      isIncome ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30' :
                      'bg-indigo-950/20 text-indigo-400 border-indigo-900/30'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-6 py-3 whitespace-nowrap text-right font-mono font-bold tracking-tight text-sm ${
                    isExpense ? 'text-fuchsia-400' :
                    isIncome ? 'text-emerald-400' :
                    'text-indigo-400'
                  }`}>
                    {isExpense ? '-' : isIncome ? '+' : ''}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(tx)}
                        className="text-slate-400 hover:text-cyan-400 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button 
                        onClick={() => onDelete(tx.id)}
                        className="text-slate-400 hover:text-fuchsia-400 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-mono text-sm">
                  NO TRANSACTIONS DETECTED
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
