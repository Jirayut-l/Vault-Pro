export interface Subscription {
  id: string;
  userId: string;
  accountId: string;
  name: string;
  amount: string; // Stored as a string representing a decimal
  billingCycleDay: number;
}
