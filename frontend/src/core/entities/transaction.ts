export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  targetAccountId: string | null;
  amount: string; // Stored as a string representing a decimal
  type: TransactionType;
  category: string;
  note: string;
  transactionDate: string;
}
