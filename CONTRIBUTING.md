# Contributing

## Workflow
1. Branch from `main`: `feat/<scope>-<short>` / `fix/<scope>-<short>`.
2. Copy envs: `backend/.env.example → backend/.env`, `frontend/.env.example → frontend/.env`; run `npm run seed`.
3. Small PRs with the template filled (contract impact + verification required).
4. CI must be green: backend `npm test`, frontend `npm run build`, Docker smoke on `main`.

## Standards
- **Contracts first:** update `backend/src/docs/openapi.yaml` + `docs/DOMAIN.md` when endpoints/domain change; bump `CHANGELOG.md`.
- **Security:** never trust client for RBAC/state/economy; validate with Joi at route + Mongoose at model; no secrets in logs (pino redacts) or git (`.env` ignored).
- **Observability:** include `requestId` (`X-Request-Id`) in bug reports; add metrics for new hot paths.
- **Structure:** new decisions → `docs/ADR/NNN-*.md` (copy `000-template.md`); update `docs/ARCHITECTURE.md` module map.

## Local prod-like boot
```bash
# secrets only in shell env, never committed
export JWT_ACCESS_SECRET=$(openssl rand -hex 32) JWT_REFRESH_SECRET=$(openssl rand -hex 32)
docker compose up --build
curl localhost:5000/api/health && curl localhost:5000/api/ready
```
