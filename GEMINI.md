# Vault Pro - Project Instructions & Standards

This document serves as the foundational mandate for all development activities within the **Vault Pro** project. It takes precedence over general workflows.

## 1. Project Overview
Vault Pro is a professional-grade personal finance management system designed to replace manual tracking with a robust software architecture.

## 2. Core Tech Stack
- **Frontend:** Next.js (TypeScript), Tailwind CSS V4+, NextAuth.js (Auth.js)
- **Backend:** Go (Golang), GORM (ORM)
- **Database:** PostgreSQL (using Decimal for financial precision)
- **Security:** JWT (Access/Refresh Tokens), Bcrypt for password hashing
- **Infrastructure:** Docker & Docker Compose for containerization

## 3. Project Structure
- `/backend`: Go source code (API, Business Logic, Database Models)
- `/frontend`: Next.js source code (Pages, Components, Styles)
- `/infra`: Infrastructure configuration files (Docker, Scripts)
- `/Document`: System design and architectural documentation

## 4. Engineering Standards & Conventions

### 4.1 Backend (Go)
- **Architecture:** Clean Architecture or Layered Architecture (Handler, Service, Repository).
- **Naming:** Use `PascalCase` for exported symbols and `camelCase` for internal ones.
- **Error Handling:** Always check for errors; do not suppress them. Return meaningful error messages to the frontend.
- **Precision:** Use `shopspring/decimal` or similar for all financial calculations. NEVER use float for currency.

### 4.2 Frontend (Next.js)
- **Styling:** Strictly use **Tailwind CSS V4+**. Follow a clean, modern, and dark-mode-first aesthetic.
- **Components:** Functional components with TypeScript interfaces for props.
- **State Management:** Use React Context or specialized hooks for local state. Session management via NextAuth.js.
- **Visualization:** Use `Recharts` or `Chart.js` for dashboard metrics.

### 4.3 Database (PostgreSQL)
- **Primary Keys:** Use `UUID` (v4) for all tables.
- **Relationships:** Enforce foreign key constraints.
- **Audit Logs:** All main tables should have `created_at`, `updated_at`, and `deleted_at` (soft delete).

### 4.4 Security
- **JWT:** 
  - Access Tokens: Short-lived (15-30 mins), stored in memory.
  - Refresh Tokens: Long-lived (7-30 days), stored in `HttpOnly` Cookies.
- **Validation:** Always validate input on the server-side, even if validated on the client.

## 5. Automated Testing Standards
- **Mandatory Coverage:** Every new feature or bug fix MUST include corresponding tests.
- **Backend (Go):** 
  - Use `testing` package for unit tests and `testify` for assertions/mocks.
  - Integration tests must run against a real PostgreSQL instance (via Docker).
- **Frontend (Next.js):** 
  - Use `Vitest` for logic tests and `Playwright` for E2E flows (Login, Transaction).
- **Validation:** A task is not considered complete until all tests pass.

## 6. Specialized Skills
- Custom project guidance is modularized in the `.gemini/skills/` directory:
  - `financial-expert`: Math, 6-Jar logic, and investments.
  - `security-expert`: Auth flow, JWT, and encryption.
  - `frontend-expert`: Next.js, Tailwind V4+, and Data Viz.
  - `backend-expert`: Go (Gin) standards and GORM modeling.
  - `qa-expert`: Testing standards and Playwright E2E.
- The AI will automatically trigger these skills based on the task domain.

## 7. Development Workflow
1. **Research:** Verify existing implementation before making changes.
2. **Strategy:** Propose a plan that aligns with this document.
3. **Execution:** Surgical edits only. Follow idiomatic Go and React patterns.
4. **Validation:** Ensure the system builds and tests pass.

## 6. Docker Management
- Use `docker-compose.yml` in the root directory to manage services.
- Data persistence must be handled via Docker Volumes.
