import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '@/types/transaction';

interface TransactionFormSlideoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Partial<Transaction>) => void;
  transactionToEdit: Transaction | null;
}

export function TransactionFormSlideover({ isOpen, onClose, onSave, transactionToEdit }: TransactionFormSlideoverProps) {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [accountId, setAccountId] = useState('');
  const [targetAccountId, setTargetAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setAccountId(transactionToEdit.account_id);
      setTargetAccountId(transactionToEdit.target_account_id || '');
      setAmount(transactionToEdit.amount);
      setCategory(transactionToEdit.category);
      setNote(transactionToEdit.note);
    } else {
      setType('EXPENSE');
      setAccountId('');
      setTargetAccountId('');
      setAmount('');
      setCategory('');
      setNote('');
    }
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: transactionToEdit?.id || undefined,
      type,
      account_id: accountId,
      target_account_id: type === 'TRANSFER' ? targetAccountId : undefined,
      amount,
      category,
      note,
      transaction_date: transactionToEdit?.transaction_date || new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Slide-over panel */}
      <div className="relative w-full max-w-md h-full bg-slate-900/90 border-l border-cyan-500/30 backdrop-blur-xl shadow-2xl shadow-cyan-900/20 transform transition-transform overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8 border-b border-slate-700/50 pb-4">
            <h2 className="text-lg font-bold text-cyan-400 uppercase tracking-widest font-mono">
              {transactionToEdit ? 'Edit Record' : 'New Record'}
            </h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-1.5 block opacity-80">
                Transaction Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['EXPENSE', 'INCOME', 'TRANSFER'] as TransactionType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-2 text-[10px] font-mono font-bold tracking-widest uppercase rounded border ${
                      type === t 
                        ? (t === 'EXPENSE' ? 'bg-fuchsia-950/40 text-fuchsia-400 border-fuchsia-500/50' : 
                           t === 'INCOME' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/50' : 
                           'bg-indigo-950/40 text-indigo-400 border-indigo-500/50')
                        : 'bg-slate-950/50 text-slate-500 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-1.5 block opacity-80">
                Amount
              </label>
              <input 
                type="number" 
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00" 
                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-lg px-4 py-3 text-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-slate-200 placeholder:text-slate-600 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-1.5 block opacity-80">
                {type === 'TRANSFER' ? 'Source Jar' : 'Jar / Account'}
              </label>
              <select 
                required
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-all text-slate-200 font-mono"
              >
                <option value="">SELECT JAR...</option>
                <option value="NEC_ID">NECESSITY [NEC]</option>
                <option value="PLY_ID">PLAY [PLY]</option>
                <option value="FFA_ID">FREEDOM [FFA]</option>
              </select>
            </div>

            {type === 'TRANSFER' && (
              <div className="animate-fade-in">
                <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-1.5 block opacity-80">
                  Destination Jar
                </label>
                <select 
                  required
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  className="w-full bg-slate-950/80 border border-indigo-700/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-all text-slate-200 font-mono"
                >
                  <option value="">SELECT DESTINATION...</option>
                  <option value="NEC_ID">NECESSITY [NEC]</option>
                  <option value="PLY_ID">PLAY [PLY]</option>
                  <option value="FFA_ID">FREEDOM [FFA]</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-1.5 block opacity-80">
                Category
              </label>
              <input 
                type="text" 
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Groceries, Salary" 
                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-all text-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-1.5 block opacity-80">
                Description / Note
              </label>
              <input 
                type="text" 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional notes..." 
                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-all text-slate-200 font-mono"
              />
            </div>

            <div className="pt-6 border-t border-slate-700/50">
              <button 
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-lg bg-cyan-600/20 border border-cyan-500/50 px-4 py-3 text-sm font-bold tracking-widest uppercase text-cyan-400 hover:bg-cyan-500/30 hover:border-cyan-400 transition-all font-mono shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              >
                COMMIT TRANSACTION
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
