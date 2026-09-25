# OWNERSHIP

| Area | Owner | Reviewers | Notes |
|---|---|---|---|
| platform/backend (Express, auth, battles) | @sai4u-dev | — | ADR + contract changes need owner sign-off |
| frontend (SPA, 3D, maps) | @sai4u-dev | — | visual changes need screenshots in PR |
| data (Mongo indexes, seed) | @sai4u-dev | — | index changes need `explain()` note |
| realtime (Socket.io rooms) | @sai4u-dev | — | sticky-session + Redis implications |
| cloud/compose/deploy | @sai4u-dev | — | image size + probe config |
| docs (ARCH/DOMAIN/RUNBOOK/SLO) | @sai4u-dev | — | docs are code — stale docs = bug |

**Rules:** every PR needs CODEOWNER review; `main` is protected (CI green + 1 approval);
on-call rotation in RUNBOOK; replace `@sai4u-dev` with team handles as the team grows.
