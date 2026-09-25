import Redis from "ioredis";
import env from "./env.js";
import logger from "../utils/logger.js";

/**
 * Optional Redis — caching, distributed rate-limit backing, Socket.io adapter.
 * Degrades gracefully: if REDIS_URL is unset/unreachable, all helpers become
 * no-ops backed by an in-memory Map (single-instance correctness preserved,
 * horizontal scaling documented in docs/ARCHITECTURE.md).
 */

let redis = null;
const memoryFallback = new Map();

export const isRedisEnabled = () => !!redis;

export const connectRedis = async () => {
  if (!env.REDIS_URL) {
    logger.info("[redis] REDIS_URL not set — using in-memory fallback (single instance)");
    return null;
  }
  try {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
      lazyConnect: false,
    });
    redis.on("error", (err) => logger.warn({ err: err.message }, "[redis] connection error — falling back to memory"));
    await redis.ping();
    logger.info("[redis] connected");
    return redis;
  } catch (err) {
    logger.warn({ err: err.message }, "[redis] unavailable — using in-memory fallback");
    redis = null;
    return null;
  }
};

export const disconnectRedis = async () => {
  if (redis) {
    try {
      await redis.quit();
    } catch {
      /* ignore */
    }
    redis = null;
  }
};

/** Get cached JSON value or null. */
export const cacheGet = async (key) => {
  try {
    if (redis) {
      const raw = await redis.get(key);
      return raw ? JSON.parse(raw) : null;
    }
    const entry = memoryFallback.get(key);
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) {
      memoryFallback.delete(key);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  }
};

/** Set cached JSON value with TTL seconds. */
export const cacheSet = async (key, value, ttlSeconds = 30) => {
  try {
    if (redis) {
      await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
      return;
    }
    memoryFallback.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  } catch {
    /* cache failures must never break requests */
  }
};

export const cacheDel = async (patternOrKey) => {
  try {
    if (redis) {
      if (patternOrKey.includes("*")) {
        const keys = await redis.keys(patternOrKey);
        if (keys.length) await redis.del(...keys);
      } else {
        await redis.del(patternOrKey);
      }
      return;
    }
    if (patternOrKey.includes("*")) {
      const prefix = patternOrKey.split("*")[0];
      for (const k of [...memoryFallback.keys()]) if (k.startsWith(prefix)) memoryFallback.delete(k);
    } else {
      memoryFallback.delete(patternOrKey);
    }
  } catch {
    /* ignore */
  }
};

/**
 * Express cache middleware for GET endpoints.
 * Usage: `router.get("/leaderboard", cacheMiddleware("lb:battles", 30), handler)`
 */
export const cacheMiddleware = (keyPrefix, ttlSeconds = 30) => async (req, res, next) => {
  if (req.method !== "GET") return next();
  const key = `${keyPrefix}:${req.originalUrl}`;
  const hit = await cacheGet(key);
  if (hit) {
    res.setHeader("X-Cache", "HIT");
    return res.status(200).json(hit);
  }
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode === 200 && body?.success !== false) {
      cacheSet(key, body, ttlSeconds).catch(() => {});
    }
    res.setHeader("X-Cache", "MISS");
    return originalJson(body);
  };
  next();
};

export const getRedisClient = () => redis;
