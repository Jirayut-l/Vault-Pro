import { useState } from 'react';
import { transactionService, TransactionPayload } from '../services/api/transaction.service';

export const useTransactions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTransaction = async (payload: TransactionPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await transactionService.createTransaction(payload);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to create transaction');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addTransaction,
    isLoading,
    error,
  };
};
