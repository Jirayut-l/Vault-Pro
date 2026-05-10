---
name: backend-expert
description: Go development, Gin API standards, GORM modeling, Contract-First design, UUIDs, and unified JSON responses. Use when modifying Go backend logic or database schemas.
---

# Backend Expert

Expert procedural guidance for Go development and API architecture within the Vault Pro ecosystem.

## 1. Architecture & Patterns
- **Layered Structure:** Maintain a strict separation between Handler, Service, and Repository layers.
- **Gin Framework:** Use Gin for high-performance RESTful API routing.

## 2. API Standards
- **Contract-First:** Define the GORM model and the corresponding TypeScript Interface before implementing the logic.
- **Unified Response:**
  ```json
  {
    "success": true,
    "data": { ... },
    "error": null
  }
  ```

## 3. Data Integrity
- **PostgreSQL:** Use UUID (v4) for all Primary Keys.
- **Soft Deletes:** Always use `gorm.DeletedAt` for transactions and investment records.
- **Precision:** Enforce `DECIMAL` types in the DB schema for all monetary values.
