import { JarType } from './account';

export interface JarSummary {
  type: JarType;
  balance: string;
  percentage: number;
}

export interface DashboardSummary {
  totalBalance: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  jarsSummary: JarSummary[];
}

export interface CategoryExpense {
  category: string;
  total: string;
}
