import { JarType } from '../entities/account';

export function formatCurrency(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(isNaN(num) ? 0 : num);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function getJarFullName(type: JarType): string {
  const names: Record<JarType, string> = {
    NEC: 'Necessity Fund (55%)',
    FFA: 'Financial Freedom (10%)',
    LTS: 'Long-term Savings (10%)',
    EDU: 'Education (10%)',
    PLY: 'Play (10%)',
    GIV: 'Give (5%)',
  };
  return names[type] || type;
}

export function getJarDescription(type: JarType): string {
  const descriptions: Record<JarType, string> = {
    NEC: 'Daily necessities, bills, food, rent',
    FFA: 'Investments, passive income assets',
    LTS: 'Big future purchases, emergency fund',
    EDU: 'Books, courses, self-improvement',
    PLY: 'Fun, dining out, hobbies, movies',
    GIV: 'Charity, gifts, parents, donations',
  };
  return descriptions[type] || '';
}
