import express from "express";
import mongoose from "mongoose";
import { dbHealth } from "../config/db.js";
import { isRedisEnabled } from "../config/redis.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getMetrics } from "../observability/metrics.js";

const router = express.Router();

/**
 * Health endpoints — cloud / orchestrator contract:
 * - GET /api/health  → full dependency summary (load-balancer health check)
 * - GET /api/live    → liveness: is the process alive? (k8s livenessProbe)
 * - GET /api/ready   → readiness: can we serve traffic? DB required (k8s readinessProbe)
 * - GET /api/metrics → Prometheus scrape target
 */

const STARTED_AT = Date.now();

router.get(
  "/health",
  asyncHandler(async (_req, res) => {
    const db = dbHealth();
    const healthy = db.state === 1 || process.env.NODE_ENV !== "production";
    res.status(healthy ? 200 : 503).json(
      new ApiResponse(
        healthy ? 200 : 503,
        {
          status: healthy ? "online" : "degraded",
          version: process.env.npm_package_version || "1.0.0",
          env: process.env.NODE_ENV,
          uptimeSeconds: Math.floor((Date.now() - STARTED_AT) / 1000),
          timestamp: new Date().toISOString(),
          dependencies: {
            mongodb: db,
            redis: { enabled: isRedisEnabled() },
          },
        },
        healthy ? "CYBERHUD_COMMAND API is online" : "API degraded (dependency down)"
      )
    );
  })
);

router.get("/live", (_req, res) => {
  res.status(200).json({ success: true, message: "alive", uptime: process.uptime() });
});

router.get(
  "/ready",
  asyncHandler(async (_req, res) => {
    const db = dbHealth();
    // Ping to verify a real round-trip, not just cached readyState
    let dbPing = "skipped";
    if (db.state === 1) {
      try {
        await mongoose.connection.db.admin().ping();
        dbPing = "ok";
      } catch {
        dbPing = "failed";
      }
    }
    const ready = db.state === 1 && dbPing === "ok";
    res.status(ready ? 200 : 503).json({
      success: ready,
      message: ready ? "ready" : "not ready",
      checks: { mongodb: db, dbPing },
    });
  })
);

router.get("/metrics", getMetrics);

export default router;
