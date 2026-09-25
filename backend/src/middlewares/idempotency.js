import ApiError from "../utils/ApiError.js";

/**
 * Idempotency-Key support for unsafe state-changing endpoints.
 * Client sends `Idempotency-Key: <uuid>` on POST /api/battles, /finish, /start.
 * - Same key + same user + same route → replay stored response (no double-write).
 * - Keys expire after 24h. In-memory by default; swap store with Redis for
 *   multi-instance deployments (see docs/ARCHITECTURE.md § Distributed Systems).
 */
const store = new Map(); // key -> { status, body, expiresAt }
const TTL_MS = 24 * 60 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store) if (v.expiresAt < now) store.delete(k);
}, 60 * 60 * 1000).unref?.();

const buildKey = (req) =>
  `${req.method}:${req.baseUrl}${req.route?.path || req.path}:${req.user?._id || "anon"}:${req.headers["idempotency-key"]}`;

export const idempotency = (req, res, next) => {
  const key = req.headers["idempotency-key"];
  if (!key || req.method === "GET") return next();
  if (typeof key !== "string" || key.length < 8 || key.length > 128) {
    return next(new ApiError(400, "Invalid Idempotency-Key (8–128 chars)"));
  }
  const storeKey = buildKey(req);
  const hit = store.get(storeKey);
  if (hit && hit.expiresAt > Date.now()) {
    res.setHeader("X-Idempotent-Replayed", "true");
    return res.status(hit.status).json(hit.body);
  }
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode < 400) {
      store.set(storeKey, { status: res.statusCode, body, expiresAt: Date.now() + TTL_MS });
    }
    return originalJson(body);
  };
  next();
};

export default idempotency;
