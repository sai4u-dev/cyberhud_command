# Changelog

All notable changes. Format: Keep a Changelog. Versions: SemVer. Images tagged `vX.Y.Z`.

## [Unreleased]

### Added
- Production baseline: Joi env validation, pino structured logs, request-id tracing, Prometheus `/api/metrics`, strict CORS, global rate limiting, compression/sanitization.
- Health contract: `/api/health`, `/api/ready` (DB ping), `/api/live`, Swagger at `/api/docs` + `src/docs/openapi.yaml`, `/api/v1/*` alias.
- Distributed readiness: optional Redis cache (leaderboards 30–60s, `X-Cache`), Socket.io battle rooms (`battle:<id>`), `Idempotency-Key` on battle writes, graceful shutdown, Mongo retry/pooling.
- Cloud: multi-stage Dockerfiles (non-root, healthchecks), nginx SPA server, `docker-compose.yml` (mongo+redis+api+web).
- CI/CD: `ci.yml` (lint/test/build/docker smoke/audit), `release.yml` (GHCR on tags), Dependabot, PR/issue templates.
- Ownership: CODEOWNERS, RUNBOOK, SLOs, SECURITY, CONTRIBUTING, ADRs, DOMAIN + ARCHITECTURE docs.
- Frontend: env validation, ErrorBoundary, Socket.io client, nginx caching.
- Community: MIT LICENSE (wired into both packages + READMEs), Contributor Covenant 2.1 Code of Conduct, CoC/license references in CONTRIBUTING.
- Quality: frontend lint zero-errors — deterministic seeded PRNG for 3D particles, render-phase state derivation (no setState-in-effect), dead-code removal, `interactive` map prop wired.

## [1.0.0] — 2026-09-25
- Initial gaming platform: JWT RBAC auth, battles lifecycle, themes, admin stats, 3D landing, maps.
