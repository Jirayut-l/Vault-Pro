import Decimal from 'decimal.js';

export function calculatePercentage(balance: string | number, total: string | number): number {
  try {
    const totalDec = new Decimal(total);
    if (totalDec.isZero()) return 0;
    return new Decimal(balance)
      .dividedBy(totalDec)
      .times(100)
      .toNumber();
  } catch {
    return 0;
  }
}

export function distributeSixJars(incomeAmount: string | number): Record<string, string> {
  try {
    const amount = new Decimal(incomeAmount);
    return {
      NEC: amount.times(0.55).toFixed(2),
      FFA: amount.times(0.10).toFixed(2),
      LTS: amount.times(0.10).toFixed(2),
      EDU: amount.times(0.10).toFixed(2),
      PLY: amount.times(0.10).toFixed(2),
      GIV: amount.times(0.05).toFixed(2),
    };
  } catch {
    return { NEC: '0.00', FFA: '0.00', LTS: '0.00', EDU: '0.00', PLY: '0.00', GIV: '0.00' };
  }
}

export function calculateInvestmentNAV(marketValue: string | number, liabilities: string | number, totalUnits: string | number): string {
  try {
    const units = new Decimal(totalUnits);
    if (units.isZero()) return '0.0000';
    return new Decimal(marketValue)
      .minus(new Decimal(liabilities))
      .dividedBy(units)
      .toFixed(4);
  } catch {
    return '0.0000';
  }
}
