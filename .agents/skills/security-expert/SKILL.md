---
name: security-expert
description: Full-stack authentication handshake, token flow, JWTs, cookies, token rotation, and bcrypt hashing. Use when implementing login, protection routes, or user data security.
---

# Security Expert

Expert procedural guidance for security and authentication within the Vault Pro ecosystem.

## 1. Full-Stack Authentication Handshake
- **Token Flow:** 
    1. Frontend requests login -> Backend signs Access Token (JWT) & Refresh Token (JWT).
    2. Access Token: Returned in JSON body (stored in NextAuth session).
    3. Refresh Token: Set in `HttpOnly`, `Secure`, `SameSite=Strict` Cookie.
- **Middleware:** Go backend must verify JWT on every protected route.
- **Token Rotation:** Frontend must handle 401 Unauthorized by attempting a silent refresh via `/api/v1/auth/refresh`.

## 2. Data Protection
- **Hashing:** Use Bcrypt for password hashing with a secure cost factor.
- **Token Validation:** Backend must check signature, expiration (exp), and user identity (sub/uid) before processing any request.
