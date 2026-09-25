# ADR-005 — Redis optional with graceful degradation

- **Date:** 2026-09-25
- **Status:** accepted
- **Owners:** platform/backend
- **Context:** Caching + realtime fan-out + distributed rate limiting need Redis at scale, but v1 must boot with zero extra infra (Atlas + single container).
- **Decision:** `REDIS_URL` unset → in-memory fallback (Map + single-instance Socket.io). Set → Redis backs cache helpers and (with adapter packages) Socket.io. Rate-limit/idempotency stores follow the same pattern when replicas arrive.
- **Alternatives considered:** Redis required (rejected: raises local/prod floor); no cache at all (rejected: leaderboard aggregation cost).
- **Consequences:** Correct in both modes; stale windows documented (leaderboards 30–60s). Multi-instance without Redis is explicitly unsupported (documented, `/health` reports redis state).
- **Follow-ups:** `rate-limit-redis` + Redis-backed idempotency when replicas >1.
