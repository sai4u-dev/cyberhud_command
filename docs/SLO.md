# SLOs — CYBERHUD_COMMAND

| Signal | Objective (30d) | Measure |
|---|---|---|
| Availability | 99.9% 2xx/3xx on `/api/*` | ingress logs / Prometheus `http_requests_total` |
| Latency | p95 < 400ms (API, excl. aggregations) | `http_request_duration_seconds` histogram |
| Error rate | < 1% 5xx | same counter, `status=5xx` |
| Freshness | leaderboards ≤ 90s stale | cache TTL (30–60s) + `X-Cache` header |
| Realtime | socket connect p95 < 1s | client instrumentation (roadmap) |

**Burn:** page on >2% 5xx for 5m or `/ready` failing on all replicas; ticket on p95 >600ms for 30m.
Dashboards scrape `/api/metrics`; alerts route per RUNBOOK. Review SLOs quarterly.
