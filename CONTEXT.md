# Glossary

This document defines the ubiquitous language for the Vault Pro project. These terms should be used consistently in code, database schemas, UI, and team discussions.

## Core Concepts

### Jars
The core concept of money allocation in Vault Pro. Funds are divided into 6 distinct accounts/jars.

* **Necessity Fund (NEC)**: For everyday living expenses (e.g., rent, food, bills).
* **Play Account (PLY)**: For guilt-free spending and entertainment.
* **Financial Freedom (FFA)**: For investments and creating passive income.
* **Long-term Savings (LTS)**: For big purchases or emergency funds.
* **Education (EDU)**: For personal growth, courses, and books.
* **Give (GIV)**: For donations, charity, or gifts to others.

### Transaction
A financial record that affects the balances of the Jars. There are three types of transactions:
* **Income**: Money entering the system. Income is typically split into the 6 Jars.
* **Expense**: Money leaving the system. An expense must specify which specific Jar it is deducting from.
* **Transfer**: Moving funds from one Jar to another Jar without changing the total net worth.
