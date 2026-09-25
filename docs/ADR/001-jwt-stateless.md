# ADR-001 — Stateless JWT with refresh rotation

- **Date:** 2026-09-25
- **Status:** accepted
- **Owners:** platform/backend
- **Context:** Need auth that scales horizontally without sticky sessions or a central session store, while supporting RBAC and revocation on logout/ban.
- **Decision:** Short-lived access JWT (15m, Bearer + httpOnly cookie) + long-lived refresh JWT (7d, httpOnly cookie) with server-side rotation allowlist (max 3, stored on `User.refreshTokens`). `protect` checks account `status` on every request so bans take effect within 15m.
- **Alternatives considered:** Redis sessions (rejected: extra dependency for v1, no horizontal need yet); opaque tokens (rejected: lookup per request).
- **Consequences:** Stateless reads; writes only on login/refresh/logout. Refresh reuse → reject (theft signal). Secret rotation requires dual-secret support (follow-up).
- **Follow-ups:** Move refresh allowlist to Redis with TTL when >1 replica writes contend; add access-token denylist for instant ban (currently 15m window documented in RUNBOOK).
