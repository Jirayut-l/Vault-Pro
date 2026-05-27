'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TransactionModal } from './TransactionModal';

export const TransactionFAB: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-40 p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_0px_rgba(16,185,129,0.7)] transition-all duration-300 hover:scale-110 active:scale-95 group"
        aria-label="Add Transaction"
      >
        <Plus size={28} className="transition-transform duration-300 group-hover:rotate-90" />
      </button>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};
