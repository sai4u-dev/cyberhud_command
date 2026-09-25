# ADR-003 — Monorepo with Compose for local, containers for cloud

- **Date:** 2026-09-25
- **Status:** accepted
- **Owners:** platform
- **Context:** Team ships frontend SPA + backend API + Mongo together; need reproducible local boot and a straight path to ECS/Cloud Run/K8s.
- **Decision:** Single repo (`backend/`, `frontend/`, `docker-compose.yml`, `docs/`, `.github/`). Multi-stage Dockerfiles per service; Compose wires mongo + redis + api + web for local/prod-like. Cloud deploys reuse the same images.
- **Alternatives considered:** Split repos (rejected: contract drift, double CI); serverless (rejected: Socket.io long-lived connections).
- **Consequences:** One CI pipeline builds/tests both; versioned together (`CHANGELOG.md`). Images must stay small (alpine, non-root, .dockerignore).
- **Follow-ups:** Extract `deploy/` k8s manifests per environment when second environment ships.
