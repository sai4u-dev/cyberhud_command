# DEPLOYMENT

## Option A — Compose (small prod / staging, single host)
```bash
export JWT_ACCESS_SECRET=$(openssl rand -hex 32)
export JWT_REFRESH_SECRET=$(openssl rand -hex 32)
export FRONTEND_URL=https://hud.example.com
export VITE_API_URL=https://api.hud.example.com/api
docker compose up -d --build
curl https://api.hud.example.com/api/ready
```
Front with a TLS-terminating reverse proxy (Caddy/ALB) in front of `:8080`, API behind `:5000`
with `trust proxy` already set. Cookies are `Secure + SameSite=None` in production automatically.

## Option B — Managed containers (ECS / Cloud Run / App Service)
- Push: `git tag v1.1.0 && git push origin v1.1.0` → GHCR images via `release.yml`.
- Run `*-backend` with: `MONGO_URI` (Atlas), `REDIS_URL` (ElastiCache, optional), `JWT_*_SECRET` (Secrets Manager), `FRONTEND_URL` (web origin).
- Probes: liveness `GET /api/live`, readiness `GET /api/ready`, startup `GET /api/health`.
- Scale: backend replicas ≥2 + `REDIS_URL` + sticky sessions for sockets; frontend static replicas ≥2.
- Metrics: scrape `/api/metrics` (restrict via security group, not public).

## Environments
| Env | Frontend | API | DB |
|---|---|---|---|
| local | `:5173` (Vite) | `:5000` | `mongodb://localhost:27017/cyberhud_command` |
| compose | `:8080` | `:5000` | `mongo` service |
| staging/prod | CDN or container `:80` | managed `:5000` | Atlas (+ backups) |
