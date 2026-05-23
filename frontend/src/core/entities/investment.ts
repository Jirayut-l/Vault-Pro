export type FundType = 'RMF' | 'THAI_ESG' | 'ETF';

export interface Investment {
  id: string;
  userId: string;
  fundName: string;
  fundType: FundType;
  amount: string; // Stored as a string representing a decimal
  units: string;  // Stored as a string representing a decimal
  nav: string;    // Stored as a string representing a decimal
  purchaseDate: string;
}
