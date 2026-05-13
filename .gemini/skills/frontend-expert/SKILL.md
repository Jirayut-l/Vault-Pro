---
name: frontend-expert
description: Next.js (App Router) development, TypeScript safety, financial logic implementation, and API integration. Use when implementing frontend features, data fetching, or complex business logic in the web app.
---

# Frontend Expert (Engineering)

Expert procedural guidance for technical implementation within the Vault Pro frontend.

## 1. Core Architecture
- **Framework:** Next.js (App Router). Prefer Server Components for data fetching.
- **Type Safety:** Strict TypeScript usage. Define interfaces for all API responses and component props.
- **State Management:** Use `Zustand` for global UI state and `React Query` (or SWR) for server state caching.

## 2. Financial Precision
- **Formatting:** Use `Intl.NumberFormat` for currency display.
- **Logic:** Maintain precision using `Decimal.js` if performing calculations on the client side. Match backend decimal handling.

## 3. Data Integration
- **API Client:** Use a centralized API client with automatic token refresh (NextAuth.js integration).
- **Error Handling:** Implement robust error boundaries and toast notifications (Sonner) for API failures.

## 4. Testing & Quality
- **Unit Testing:** `Vitest` for business logic and utility functions.
- **E2E Testing:** `Playwright` for critical paths (Auth, Transactions).
