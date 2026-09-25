# Security Policy

## Supported
Latest `main` and latest `v*` tag. Older tags receive no patches — upgrade.

## Report a vulnerability
**Do not open a public issue.** Email the maintainers (see CODEOWNERS) with:
repro, impact, affected version/tag, logs with `X-Request-Id`. Expect triage in 48h.

## Built-in controls
- Helmet headers, strict CORS allowlist, global + auth-strict rate limits.
- `express-mongo-sanitize`, `hpp`, 10kb body limit, Joi validation on all writes.
- JWT access 15m / refresh 7d rotation (max 3 sessions); `httpOnly`, `Secure` + `SameSite=None` in prod.
- Bcrypt cost 12; banned accounts rejected in `protect` (≤15m propagation).
- Private battle passwords `select:false`, never serialized.
- Images run as non-root; secrets via env/Secrets Manager only.

## Rotating secrets
`JWT_*_SECRET` rotation requires dual-secret support (tracked follow-up). Today:
rotate → all sessions invalidate → users re-login. Coordinate via RUNBOOK incident flow.
