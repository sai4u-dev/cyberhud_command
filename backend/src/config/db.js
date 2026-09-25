import mongoose from "mongoose";
import logger from "../utils/logger.js";

/**
 * MongoDB connection with pooling + retry.
 * - Pool sized for container defaults (override via MONGO_MAX_POOL env if needed)
 * - Retries with backoff on cold start (Atlas / Compose race)
 * - Timeouts prevent hung requests from exhausting the event loop
 */
const connectDB = async ({ retries = 5, baseDelayMs = 2000 } = {}) => {
  mongoose.set("strictQuery", true);

  const options = {
    maxPoolSize: parseInt(process.env.MONGO_MAX_POOL, 10) || 10,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    retryWrites: true,
  };

  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, options);
      logger.info(
        { host: conn.connection.host, db: conn.connection.name },
        "[db] MongoDB connected"
      );
      return conn;
    } catch (error) {
      lastError = error;
      logger.warn(
        { attempt, retries, err: error.message },
        "[db] connection failed — retrying"
      );
      if (attempt < retries) await new Promise((r) => setTimeout(r, baseDelayMs * attempt));
    }
  }

  logger.error({ err: lastError?.message }, "[db] all connection attempts failed");
  if (process.env.NODE_ENV === "production") throw lastError;
  logger.warn("[db] continuing without DB (non-production) — DB ops will fail until MONGO_URI is valid");
  return null;
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info("[db] disconnected");
  } catch {
    /* ignore */
  }
};

export const dbHealth = () => ({
  state: mongoose.connection.readyState, // 0=disconnected 1=connected 2=connecting 3=disconnecting
  stateLabel: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] || "unknown",
  host: mongoose.connection.host || null,
  name: mongoose.connection.name || null,
});

export default connectDB;
