# ADR-002 — MongoDB document model for battles

- **Date:** 2026-09-25
- **Status:** accepted
- **Owners:** platform/backend
- **Context:** Battles have variable participant lists, event logs, geo zones; access is by-id and by-participant with leaderboard aggregations.
- **Decision:** MongoDB with embedded `participants[]` + `events[]` on `Battle`; indexed (`type,status`, `host`, `participants.user`). Geospatial via `2dsphere` on users; battle zones store `[lng,lat]` pairs.
- **Alternatives considered:** Postgres + JSONB (rejected: team velocity with Mongoose, flexible event schema, Atlas free tier); separate Participant collection (rejected: join cost, battles are read-mostly aggregates).
- **Consequences:** Single-document reads for battle rooms; 16MB doc limit is non-binding at ≤32 participants. Aggregations for leaderboards need indexes (present).
- **Follow-ups:** If tournaments need cross-battle transactions, use Mongo multi-doc transactions; re-evaluate at >100k battles/month.
