# RUNBOOK — on-call operations

## 1. Topology & probes
- API: `GET /api/health` (summary) · `/api/live` (process) · `/api/ready` (DB ping) · `/api/metrics` (Prom) · `/api/docs` (contract).
- Web: `/` (nginx SPA). Compose: `mongo` (27017) · `redis` (6379) · `backend` (5000) · `frontend` (80→8080).

## 2. Triage (first 5 min)
1. `curl /api/health` — note `dependencies` + `requestId` header `X-Request-Id`.
2. `curl /api/ready` — 503 = Mongo down → §3. 200 but 5xx on routes → §4.
3. Check logs: `docker compose logs backend --tail=200` (JSON, grep `req.id`); metrics: `/api/metrics`.
4. Declare incident in chat with: symptom, scope, version/tag (`/api/health → version`), start time.

## 3. Dependency failures
| Symptom | Action |
|---|---|
| `/ready` 503, `mongodb.disconnected` | verify `MONGO_URI`, Atlas IP allowlist, `mongosh --eval "db.adminCommand('ping')"`. API serves 503 on ready only; live stays 200. Restart after secret fix: `docker compose up -d backend`. |
| Redis errors in logs | benign — memory fallback active (`/health → redis.enabled=false`). Fix `REDIS_URL`, restart; no data loss (cache-only). |
| Socket connect failures | check JWT expiry + ingress WebSocket upgrade + sticky sessions (multi-replica). REST unaffected. |

## 4. App failures
- **5xx spike:** pull top routes from metrics (`http_requests_total{status="5xx"}`); correlate `requestId`s in logs; rollback: `docker compose up -d --build` previous tag (GHCR `v*` images immutable).
- **401 wave:** check `JWT_*_SECRET` / clock skew / cookie `Secure` vs HTTP local. Secret rotation invalidates all sessions by design (announce).
- **429 wave:** legitimate spike → raise `RATE_LIMIT_MAX` env; attack → block IPs at ingress, tighten auth limiter.
- **Ban not taking effect:** ≤15m window by design (access-token TTL); to force: rotate user refresh tokens (delete `User.refreshTokens[]`).

## 5. Data & backups
- Mongo: Atlas continuous backup (prod) + pre-deploy snapshot. Restore: new cluster → update `MONGO_URI` → verify `/ready` → cut over.
- No user-data deletes without `bustUserCaches` path (leaderboards cached 60s — stale reads are expected, not a bug).

## 6. Deploys & rollback
- Tag `vX.Y.Z` → `release.yml` publishes GHCR images → deploy tag (never `latest` in prod).
- Smoke: `/api/health` 200 → `/api/ready` 200 → login → create/join/finish battle → `/api/docs` loads.
- Rollback: redeploy previous tag; migrations (when introduced) must be backward-compatible (expand→migrate→contract).

## 7. Configuration
Secrets (`MONGO_URI`, `JWT_*_SECRET`, `REDIS_URL`) via env/Secrets Manager only — never in git. Validate with `backend/.env.example`. Non-prod boots warn instead of exit; **prod refuses to boot** on invalid env.
