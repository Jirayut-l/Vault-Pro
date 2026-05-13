---
name: devops-expert
description: Containerization (Docker), multi-stage builds, Docker Compose, CI/CD pipelines, and infrastructure as code. Use when managing Dockerfiles, orchestrating services, or automating deployments.
---

# DevOps Expert

Expert guidance for containerization, infrastructure, and automation within the Vault Pro ecosystem.

## 1. Containerization Standards
- **Multi-Stage Builds:** Always use multi-stage builds (e.g., `golang:alpine` to `alpine`, `node:alpine` to `node:alpine` with standalone mode) to minimize image size and attack surface.
- **Base Images:** Prefer `alpine` or `distroless` for production images to maintain security and efficiency.
- **Security:** Run applications as non-root users where possible (see Frontend `runner` stage).

## 2. Service Orchestration (Docker Compose)
- **Healthchecks:** Implement `healthcheck` for critical services like PostgreSQL to ensure dependent services (Backend) only start when the database is ready.
- **Environment Management:** Use `.env` files for configuration. Never hardcode secrets in `docker-compose.yml`.
- **Volumes:** Ensure data persistence for PostgreSQL using named volumes (e.g., `pgdata`).

## 3. Infrastructure & Deployment
- **Directory:** Manage custom scripts, Terraform, or Kubernetes manifests within the `/infra` directory.
- **CI/CD:** Focus on automated linting, testing, and container building. Ensure `NEXT_PUBLIC_` environment variables are correctly passed as build arguments during the frontend build stage.

## 4. Best Practices
- **Layer Caching:** Order `Dockerfile` instructions to maximize layer caching (e.g., copy dependency files before source code).
- **Logging:** Ensure applications log to `stdout/stderr` for proper log aggregation by container engines.
- **Resource Limits:** Define CPU and memory limits in production compose or orchestrator files to prevent resource exhaustion.
