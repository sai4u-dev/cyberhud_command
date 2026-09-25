import dotenv from "dotenv";
dotenv.config();

import http from "node:http";
import env from "./config/env.js";
import logger from "./utils/logger.js";
import app, { allowedOrigins } from "./app.js";
import connectDB, { disconnectDB } from "./config/db.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";
import { initRealtime } from "./realtime/io.js";

/**
 * Production process lifecycle:
 * - Validated env (config/env.js) before boot
 * - DB + Redis connected before accepting traffic
 * - Graceful shutdown drains HTTP keep-alives, sockets, DB, Redis
 * - Unhandled rejections crash loudly (orchestrator restarts) instead of limping
 */

process.on("unhandledRejection", (reason) => {
  logger.fatal({ err: reason }, "[process] unhandledRejection — exiting");
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "[process] uncaughtException — exiting");
  process.exit(1);
});

const PORT = env.PORT || 5000;

const start = async () => {
  if (!process.env.MONGO_URI && env.isProduction) {
    logger.fatal("[boot] MONGO_URI missing in production — refusing to boot");
    process.exit(1);
  }

  await connectDB();
  await connectRedis();

  const server = http.createServer(app);
  initRealtime(server, allowedOrigins);

  server.listen(PORT, "0.0.0.0", () => {
    logger.info(
      { port: PORT, env: env.NODE_ENV, cors: allowedOrigins },
      "CYBERHUD_COMMAND backend online"
    );
  });

  // Graceful shutdown — SIGTERM (k8s/ECS) + SIGINT (local)
  let shuttingDown = false;
  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, "[shutdown] draining…");

    const forceExit = setTimeout(() => {
      logger.error("[shutdown] forced exit after 15s");
      process.exit(1);
    }, 15000);
    forceExit.unref?.();

    try {
      await new Promise((resolve) => server.close(resolve));
      logger.info("[shutdown] http server closed");
      await disconnectRedis();
      await disconnectDB();
      logger.info("[shutdown] clean exit");
      process.exit(0);
    } catch (err) {
      logger.error({ err }, "[shutdown] error during shutdown");
      process.exit(1);
    }
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

start();
