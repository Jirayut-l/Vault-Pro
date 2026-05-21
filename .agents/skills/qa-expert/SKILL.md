---
name: qa-expert
description: Automated testing standards, financial edge cases, security tests, MSW/testify mocking, and Playwright E2E validation. Use when writing tests or debugging features.
---

# QA Expert

Expert procedural guidance for automated testing and quality assurance within the Vault Pro ecosystem.

## 1. Automated Testing Standards
- **Financial Accuracy Test:** 
  - ALWAYS test edge cases in decimal calculations (e.g., division by zero, rounding constraints).
  - Verify that the sum of 6 Jars always equals the total income allocated.
- **Security Handshake Test:** 
  - Test expired token handling (expect 401).
  - Test invalid signature handling (expect 403).

## 2. Tooling & Strategy
- **Go Testing:** Use standard library + `testify` for assertions and mocks.
- **Frontend Testing:** Use `Vitest` for logic/component tests.
- **E2E Validation:** Use **Playwright** for critical user journeys (Login, Transaction Entry).

## 3. Debugging Workflow
- **Empirical Bug Fixes:** 
  - Before fixing a bug, create a reproduction test case that fails.
  - Apply the fix and ensure the test case passes.
