export type TransactionType = 'TRANSFER' | 'EXPENSE' | 'INCOME';

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  target_account_id?: string;
  amount: string;
  type: TransactionType;
  category: string;
  note: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: string; // 'NEC' | 'PLY' | 'FFA' | 'LTS' | 'EDU' | 'GIV'
  balance: string;
  created_at: string;
}
