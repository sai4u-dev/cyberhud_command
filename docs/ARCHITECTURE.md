# ARCHITECTURE — CYBERHUD_COMMAND

> Living document. Ownership: **platform/backend + frontend**. Update with every structural change (see ADR process below).

## 1. System overview

```
                    ┌─────────────┐
                    │   Client    │  React 19 + Vite + Redux Toolkit
                    │  (SPA)      │  Three.js / GSAP / Framer / Maps
                    └──────┬──────┘
                           │ HTTPS + WSS
                           ▼
                    ┌─────────────┐        ┌──────────────┐
                    │   Ingress   │───────▶│  Frontend    │  nginx (SPA fallback, gzip, cache)
                    │  (nginx /  │        │  static      │
                    │   ALB)      │        └──────────────┘
                    └──────┬──────┘
                           │ /api/*  /api/socket.io
                           ▼
              ┌────────────────────────┐
              │  Backend (Node 20)     │
              │  Express 4 — stateless │
              │  REST + Socket.io      │
              │  /api/health|ready|live│
              │  /api/metrics (Prom)   │
              │  /api/docs (OpenAPI)   │
              └────┬───────────┬───────┘
                   │           │ optional
                   ▼           ▼
           ┌────────────┐ ┌──────────┐
           │  MongoDB   │ │  Redis   │  cache + socket adapter
           │  (Atlas /  │ │ (Elasti- │
           │   Compose) │ │  Cache)  │
           └────────────┘ └──────────┘
```

**Key property: backend is stateless.** JWTs are self-contained; refresh-token
allowlist lives in MongoDB (queried per refresh); cache is write-through with
TTL so any instance can serve any request. Socket.io defaults to single-instance;
multi-instance requires `REDIS_URL` + sticky sessions (see §5).

## 2. Backend module map

```
src/
├── config/      env.js (Joi-validated) · db.js (pooled+retry) · redis.js (optional, memory fallback)
├── routes/      health · auth · users · battles · themes · admin  (+ /api/v1/* alias)
├── controllers/ thin HTTP adapters — parse, call domain, shape ApiResponse
├── middlewares/ protect · authorize* · validateRequest · requestId · idempotency · notFound · errorHandler
├── observability/ metrics.js (prom-client RED signals)
├── realtime/    io.js (Socket.io auth + battle:<id> rooms + emitBattleEvent)
├── utils/       logger (pino) · tokens · pagination · asyncHandler · ApiError/ApiResponse
├── validators/  Joi schemas per resource (auth, battle)
└── docs/        openapi.yaml (served at /api/docs)
```

**Request lifecycle:**

1. `requestId` → `pino-http` (trace id on every log) → `metricsMiddleware`
2. `helmet` → strict CORS allowlist → `compression` → body parse → `mongoSanitize` → `hpp`
3. global `rateLimit` (+ stricter limiter on `/auth/*`)
4. route → `validateRequest` → `protect` → `authorize*` → `idempotency` (writes) → controller
5. controller → Mongoose → `cacheDel` bust + `emitBattleEvent` broadcast
6. `notFound` → `errorHandler` (consistent `{ success:false, message, errors, requestId }`)

## 3. Data & domain invariants

See **docs/DOMAIN.md** for ubiquitous language. Critical invariants enforced in code:

| Invariant                                                                     | Enforced in                                                 |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Public register always `role=user` (no self-escalation)                       | `authController.register` + Joi                             |
| Battle state machine `waiting → in_progress → completed/cancelled` (no skips) | `battleController.start/finish/cancel` + `Battle.canJoin()` |
| Capacity: 1v1 = exactly 2; 1vN = 3–16                                         | Joi `createBattleSchema` + Mongoose validator + controller  |
| Host cannot abandon non-empty battle (must cancel)                            | `leaveBattle`                                               |
| Only host/admin can start/finish/cancel                                       | controller + `protect`                                      |
| Refresh-token rotation, max 3 sessions, reuse = reject                        | `authController.refresh`                                    |
| Banned/suspended accounts fail `protect`                                      | `middlewares/auth.js`                                       |

**Indexes (perf):** `User(role)`, `User(location:2dsphere)`, `Battle(type,status)`,
`Battle(host)`, `Battle(participants.user)`, `Battle(createdAt)`.

## 4. Auth & RBAC

- **Access token** 15m (Bearer + httpOnly cookie), **refresh** 7d (httpOnly cookie, rotation).
- Axios interceptor refreshes on 401 with a single-flight queue (no thundering herd).
- Hierarchy `admin(4) > organizer(3) > moderator(2) > user(1)`:
  `authorize(...roles)` = strict; `authorizeAtLeast(role)` = hierarchical.
- Frontend mirrors hierarchy in `useAuth.js` + `<ProtectedRoute>` — **server is authoritative**.

## 5. Distributed systems

| Concern       | Current state                                                                                | Scale-out path                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Stateless API | ✅ no server session                                                                         | already horizontally scalable behind ALB                                                          |
| Cache         | Redis if `REDIS_URL`, else memory fallback; leaderboards cached 30–60s with `X-Cache` header | set `REDIS_URL` (ElastiCache/Memorystore); no code change                                         |
| Realtime      | Socket.io rooms `battle:<id>`; JWT auth on handshake                                         | set `REDIS_URL` + install `@socket.io/redis-adapter` + `redis`; enable sticky sessions at ingress |
| Rate limiting | in-memory `express-rate-limit`                                                               | swap to `rate-limit-redis` when >1 replica (documented TODO)                                      |
| Idempotency   | in-memory `Idempotency-Key` store, 24h TTL, per-user+route                                   | move Map → Redis HASH when >1 replica (same TODO)                                                 |
| MongoDB       | pooled (10), retry w/ backoff, `ready` probe pings                                           | Atlas M10+ with auto-scaling; connection string via Secrets Manager                               |
| Tracing       | `X-Request-Id` generated/propagated, echoed, logged                                          | forward to OpenTelemetry collector (header already standard)                                      |
| Metrics       | `prom-client` RED + default process metrics at `/api/metrics`                                | scrape via Prometheus/Grafana Agent; dashboard in `observability/`                                |

**Failure modes:** Redis down → memory fallback (correct, single-instance);
Mongo down → `/ready` 503 (removed from pool), `/health` degraded;
socket emit failure → logged, REST response unaffected (fire-and-forget).

## 6. API versioning & contracts

- Canonical `/api/*` + forward-compatible alias `/api/v1/*` (both served today).
- Breaking changes → `/api/v2/*`, old version sunset with 6-month notice (see ADR-004).
- Contract: `backend/src/docs/openapi.yaml` is source of truth, served at `/api/docs`.
- CI fails if spec is unparsable (`yamljs` load check in tests — add as needed).

## 7. Observability & SLOs

- **Logs:** pino JSON in prod (`service`, `env`, `req.id`); never log secrets (redacted).
- **Metrics:** `/api/metrics` — `http_request_duration_seconds`, `http_requests_total`, process defaults.
- **Probes:** `/live` (process), `/ready` (DB ping), `/health` (summary). K8s manifests in `deploy/` map these to probes.
- **SLOs:** see `docs/SLO.md` (99.9% availability, p95 < 400ms API, <1% 5xx).

## 8. ADRs

Decisions live in `docs/ADR/`. New structural change → new ADR (copy `000-template.md`).
Current: 001 JWT-stateless, 002 MongoDB-document-model, 003 monorepo-with-compose,
004 API-versioning, 005 Redis-optional-degradation.
