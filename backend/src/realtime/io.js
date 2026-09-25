import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/tokens.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";
import env from "../config/env.js";

/**
 * Realtime battle channel — Socket.io, stateless-ready.
 *
 * Auth: client connects with `auth: { token }` (accessToken) — same JWT as REST.
 * Rooms: `battle:<battleId>` — clients join after REST joinBattle succeeds.
 * Events (server→client): battle:joined, battle:left, battle:ready, battle:started,
 *   battle:finished, battle:cancelled, battle:event
 * Events (client→server): battle:subscribe { battleId }, battle:unsubscribe
 *
 * Horizontal scaling: single-instance works out of the box. For multi-instance,
 * set REDIS_URL and the server attaches the Redis adapter (sticky sessions via
 * ingress required). See docs/ARCHITECTURE.md § Distributed Systems.
 */

let io = null;

export const initRealtime = (httpServer, corsOrigins) => {
  io = new Server(httpServer, {
    path: "/api/socket.io",
    cors: { origin: corsOrigins, credentials: true },
    transports: ["websocket", "polling"],
  });

  // Optional Redis adapter for horizontal scale-out
  if (env.REDIS_URL) {
    import("@socket.io/redis-adapter")
      .then(async ({ createAdapter }) => {
        const { createClient } = await import("redis").catch(() => ({}));
        if (!createClient) {
          logger.warn("[socket] redis adapter package not installed — running single-instance");
          return;
        }
        try {
          const pub = createClient({ url: env.REDIS_URL });
          const sub = pub.duplicate();
          await Promise.all([pub.connect(), sub.connect()]);
          io.adapter(createAdapter(pub, sub));
          logger.info("[socket] redis adapter attached (multi-instance mode)");
        } catch (err) {
          logger.warn({ err: err.message }, "[socket] redis adapter failed — single-instance mode");
        }
      })
      .catch(() => logger.warn("[socket] @socket.io/redis-adapter not installed — single-instance mode"));
  }

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
      if (!token) return next(new Error("unauthorized: token missing"));
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select("_id username displayName avatar role status");
      if (!user || user.status !== "active") return next(new Error("unauthorized: account inactive"));
      socket.user = { id: user._id.toString(), username: user.username, role: user.role };
      next();
    } catch {
      next(new Error("unauthorized: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    logger.debug({ user: socket.user?.username }, "[socket] client connected");

    socket.on("battle:subscribe", (battleId) => {
      if (typeof battleId !== "string" || battleId.length > 64) return;
      socket.join(`battle:${battleId}`);
      socket.emit("battle:subscribed", { battleId });
    });

    socket.on("battle:unsubscribe", (battleId) => {
      socket.leave(`battle:${battleId}`);
    });

    socket.on("disconnect", () => {
      logger.debug({ user: socket.user?.username }, "[socket] client disconnected");
    });
  });

  return io;
};

/** Broadcast a battle lifecycle event to all room subscribers. Safe no-op if io not initialized. */
export const emitBattleEvent = (battleId, event, payload = {}) => {
  try {
    io?.to(`battle:${battleId}`).emit(event, {
      battleId: battleId?.toString(),
      at: new Date().toISOString(),
      ...payload,
    });
  } catch (err) {
    logger.warn({ err: err.message }, "[socket] emit failed");
  }
};

export const getIO = () => io;
