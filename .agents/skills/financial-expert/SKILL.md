---
name: financial-expert
description: Financial precision, zero-float policy, decimal handling, 6-Jars logic, and investment portfolio logic. Use when calculating math, managing transactions, or dealing with monetary values.
---

# Financial Expert

Expert procedural guidance for financial precision and logic within the Vault Pro ecosystem.

## 1. Precision Standards
- **Zero-Float Policy:** NEVER use floating-point numbers (`float32`, `float64`, `number`) for currency or investment units.
- **Go Backend:** Use `github.com/shopspring/decimal`. Always store values as `DECIMAL(15,2)` or `DECIMAL(20,8)` (for crypto/NAV) in PostgreSQL.
- **Frontend TS:** Use `decimal.js` for client-side calculations before display.
- **Rounding:** Default to "Banker's Rounding" (Half-Even) unless specified otherwise.

## 2. 6 Jars Distribution Logic
- Necessity (NEC): 55%
- Financial Freedom (FFA): 10%
- Long-term Savings (LTS): 10%
- Education (EDU): 10%
- Play (PLY): 10%
- Give (GIV): 5%

## 3. Investment Portfolio Logic
- **NAV Calculation:** `(Market Value - Liabilities) / Total Units`.
- **Cost Averaging:** Use Weighted Average Cost (WAC) method for calculating profit/loss on stock/fund sales.
- **Tax Tracking:** Tag transactions with `RMF`, `Thai-ESG`, or `SSF` to generate year-end tax deduction summaries.
