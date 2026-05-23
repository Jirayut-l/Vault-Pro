import { describe, it, expect } from 'vitest';
import { calculatePercentage, distributeSixJars, calculateInvestmentNAV } from './finance';
import { formatCurrency, formatPercent, getJarFullName } from './formatting';

describe('Financial Calculations', () => {
  it('should calculate percentages correctly', () => {
    expect(calculatePercentage(50, 100)).toBe(50);
    expect(calculatePercentage(10, 0)).toBe(0);
    expect(calculatePercentage('15', '60')).toBe(25);
  });

  it('should distribute 6 jars correctly according to percentages', () => {
    const split = distributeSixJars(10000);
    expect(split.NEC).toBe('5500.00'); // 55%
    expect(split.FFA).toBe('1000.00'); // 10%
    expect(split.LTS).toBe('1000.00'); // 10%
    expect(split.EDU).toBe('1000.00'); // 10%
    expect(split.PLY).toBe('1000.00'); // 10%
    expect(split.GIV).toBe('500.00');  // 5%
  });

  it('should calculate investment NAV correctly', () => {
    expect(calculateInvestmentNAV(10500, 500, 1000)).toBe('10.0000');
    expect(calculateInvestmentNAV(5000, 0, 0)).toBe('0.0000');
  });
});

describe('Formatting Logic', () => {
  it('should format currency correctly', () => {
    const formatted = formatCurrency(1250.5);
    expect(formatted).toContain('1,250.50');
  });

  it('should format percentage labels correctly', () => {
    expect(formatPercent(12.5)).toContain('12.5');
  });

  it('should return correct jar full name details', () => {
    expect(getJarFullName('NEC')).toContain('Necessity');
  });
});
