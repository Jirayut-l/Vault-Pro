export type JarType = 'NEC' | 'FFA' | 'LTS' | 'EDU' | 'PLY' | 'GIV';

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: JarType;
  balance: string; // Stored as a string representing a decimal
  createdAt: string;
}
