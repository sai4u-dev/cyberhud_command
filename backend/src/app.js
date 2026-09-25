import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import env from "./config/env.js";
import logger from "./utils/logger.js";
import requestId from "./middlewares/requestId.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import { metricsMiddleware } from "./observability/metrics.js";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import themeRoutes from "./routes/theme.routes.js";
import battleRoutes from "./routes/battle.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Required when behind ingress / load balancer / nginx (correct client IPs + secure cookies)
app.set("trust proxy", 1);
app.disable("x-powered-by");

// 1. Request identity + observability (first, so every log has req.id)
app.use(requestId);
app.use(
  pinoHttp({
    logger,
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 500 || err) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
    serializers: {
      req: (req) => ({ id: req.id, method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  })
);
app.use(metricsMiddleware);

// 2. Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: env.isProduction ? undefined : false,
  })
);

// 3. CORS — strict allowlist (no silent allow-all in production)
const defaultOrigins = [env.FRONTEND_URL, ...env.additionalOrigins].filter(Boolean);
if (!env.isProduction) defaultOrigins.push("http://localhost:3000", "http://localhost:5174");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // curl / health probes / same-origin
      if (defaultOrigins.includes(origin)) return callback(null, true);
      logger.warn({ origin }, "[cors] blocked origin");
      return callback(new Error(`CORS blocked for origin ${origin}`));
    },
    credentials: true,
    exposedHeaders: ["X-Request-Id", "X-Cache", "X-Idempotent-Replayed"],
  })
);

// 4. Payload + sanitization
app.use(compression());
app.use(express.json({ limit: env.BODY_LIMIT || "10kb" }));
app.use(express.urlencoded({ extended: true, limit: env.BODY_LIMIT || "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());

// 5. Global rate limit (auth routes apply an additional stricter limiter)
const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, try again later" },
});
app.use("/api", globalLimiter);

// 6. Routes — health first (unauthenticated, used by probes)
app.use("/api", healthRoutes);

// Versioned alias: /api/v1/* mirrors /api/* for forward-compatible clients
const v1 = express.Router();
v1.use("/auth", authRoutes);
v1.use("/users", userRoutes);
v1.use("/admin", adminRoutes);
v1.use("/themes", themeRoutes);
v1.use("/battles", battleRoutes);
app.use("/api/v1", v1);

// Canonical unversioned routes (backwards compatible)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/themes", themeRoutes);
app.use("/api/battles", battleRoutes);

// 7. API docs (Swagger UI) — served from checked-in OpenAPI spec
try {
  const spec = YAML.load(path.join(__dirname, "docs", "openapi.yaml"));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
  app.get("/api/openapi.yaml", (_req, res) => res.sendFile(path.join(__dirname, "docs", "openapi.yaml")));
} catch (err) {
  logger.warn({ err: err.message }, "[docs] openapi.yaml not loaded — /api/docs disabled");
}

// 8. 404 + global error handler (order matters)
app.use(notFound);
app.use(errorHandler);

export default app;
export { defaultOrigins as allowedOrigins };
