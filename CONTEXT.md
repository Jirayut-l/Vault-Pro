# Glossary

This document defines the ubiquitous language for the Vault Pro project. These terms should be used consistently in code, database schemas, UI, and team discussions.

## Core Concepts

### Vault
The primary container for a user's money and asset portfolio. It replaces generic concepts like "Wallet" to emphasize the security, long-term storage, and professional nature of the platform. A Vault can contain various Jars and Assets.

### Asset
A generic term for any item of positive financial value held within a Vault (e.g., Cash, Crypto, Stocks).
### Jars (Implemented as Accounts)
The core concept of money allocation in Vault Pro. Funds are divided into 6 distinct accounts/jars. In the database and API, these are referred to as **Accounts** (e.g., `account_id`), and they are distinguished by their `type` field (e.g., `NEC`, `PLY`). Visually, each Jar is represented by a distinct canonical color across the application.

* **Necessity Fund (NEC)**: For everyday living expenses (e.g., rent, food, bills).
* **Play Account (PLY)**: For guilt-free spending and entertainment.
* **Financial Freedom (FFA)**: For investments and creating passive income.
* **Long-term Savings (LTS)**: For big purchases or emergency funds.
* **Education (EDU)**: For personal growth, courses, and books.
* **Give (GIV)**: For donations, charity, or gifts to others.

### Transaction
A financial record that affects the balances of the Jars. There are three types of transactions, represented with semantic styling (e.g., Income is positive/green, Expense is negative/red, Transfer is neutral) while retaining their association with a specific Jar:
* **Income**: Money entering the system. In the data model, an income transaction is logged against one specific Jar at a time. (If income needs to be split across all 6 Jars, it is handled as separate transactions or via a specialized split action).
* **Expense**: Money leaving the system. An expense must specify which specific Jar it is deducting from.
* **Transfer**: Moving funds from one Jar to another Jar without changing the total net worth.

### Payment Method
A mechanism or instrument (e.g., a physical Credit Card) used to facilitate a transaction. Payment methods are distinct from Jars; they are not allocations of money, but simply the means by which money is drawn from or deposited into a Jar.

### Transaction Ledger
The comprehensive, chronologically ordered master list of all transactions (Income, Expense, Transfer) across all Jars. It serves as the single source of truth for the user's financial history.

### Dashboard
The central overview providing a high-level summary of the user's financial state. It aggregates data across all Jars to present total balances, recent activity, and visual insights.
