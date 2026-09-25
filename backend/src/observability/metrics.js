import client from "prom-client";

/**
 * Prometheus metrics — scrape at GET /api/metrics (unauthenticated, but
 * rate-limited; restrict via ingress/network policy in production).
 *
 * Standard RED signals: rate, errors, duration + process runtime.
 */

client.collectDefaultMetrics({ prefix: "cyberhud_" });

export const httpRequestDuration = new client.Histogram({
  name: "cyberhud_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

export const httpRequestTotal = new client.Counter({
  name: "cyberhud_http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
});

/** Express middleware — records duration + count with low-cardinality routes. */
export const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    try {
      // Normalize route to avoid cardinality explosion (e.g. /api/users/:id)
      const route = req.route?.path ? `${req.baseUrl}${req.route.path}` : req.baseUrl || req.path;
      const labels = { method: req.method, route, status: String(res.statusCode) };
      const seconds = Number(process.hrtime.bigint() - start) / 1e9;
      httpRequestDuration.observe(labels, seconds);
      httpRequestTotal.inc(labels);
    } catch {
      /* metrics must never break requests */
    }
  });
  next();
};

export const getMetrics = async (_req, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  res.send(await client.register.metrics());
};

export default client;
