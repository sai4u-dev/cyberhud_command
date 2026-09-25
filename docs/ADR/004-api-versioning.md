# ADR-004 — API versioning (/api + /api/v1 alias)

- **Date:** 2026-09-25
- **Status:** accepted
- **Owners:** platform/backend
- **Context:** Mobile/SPA clients cache aggressively; breaking changes must not brick deployed clients.
- **Decision:** Serve canonical `/api/*` and alias `/api/v1/*` identically today. Next breaking change ships `/api/v2/*` alongside v1 with a 6-month sunset + `Sunset` header.
- **Alternatives considered:** Header versioning (rejected: invisible, hard to route at ingress); URL-only v1 (rejected: breaks existing clients).
- **Consequences:** Controllers stay version-agnostic; versioning is a routing concern until v2 diverges.
- **Follow-ups:** Add contract tests asserting v1/v2 parity during transition windows.
