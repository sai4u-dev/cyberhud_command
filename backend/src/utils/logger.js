import pino from "pino";
import env from "../config/env.js";

/**
 * Structured JSON logger — production standard.
 * - JSON in production (collect via CloudWatch / ELK / Loki)
 * - Pretty-printed in development
 * - Redacts secrets, cookies, auth headers
 */

const logger = pino({
  level: env.LOG_LEVEL || "info",
  base: { service: "cyberhud-backend", env: env.NODE_ENV },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers['set-cookie']",
      "*.password",
      "*.refreshToken",
      "*.refreshTokens",
      "*.accessToken",
    ],
    censor: "[REDACTED]",
  },
  ...(env.isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:standard", ignore: "pid,hostname" },
        },
      }),
});

export default logger;
