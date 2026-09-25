import Joi from "joi";

/**
 * Centralized environment validation — fail fast in production.
 * Single source of truth for all backend configuration.
 *
 * Ownership: platform/backend
 * See docs/RUNBOOK.md "Configuration" for rotation procedures.
 */

const schema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "test", "staging", "production").default("development"),
  PORT: Joi.number().port().default(5000),
  MONGO_URI: Joi.string().uri().required().messages({
    "any.required": "MONGO_URI is required (local or Atlas). See backend/.env.example",
  }),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default("7d"),

  FRONTEND_URL: Joi.string().uri().default("http://localhost:5173"),
  ADDITIONAL_ORIGINS: Joi.string().allow("").default(""), // comma-separated extra CORS origins
  COOKIE_DOMAIN: Joi.string().allow("").default(""),

  REDIS_URL: Joi.string().uri().allow("").default(""), // optional — caching/realtime degrade gracefully
  SENTRY_DSN: Joi.string().uri().allow("").default(""),

  RATE_LIMIT_WINDOW_MS: Joi.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: Joi.number().default(300), // global; auth routes use stricter limiter
  BODY_LIMIT: Joi.string().default("10kb"),

  LOG_LEVEL: Joi.string().valid("fatal", "error", "warn", "info", "debug", "trace").default("info"),
}).unknown(true);

const { error, value } = schema.validate(process.env, { abortEarly: false, stripUnknown: false });

if (error) {
  const details = error.details.map((d) => d.message).join("; ");
  console.error(`[env] Invalid configuration: ${details}`);
  if (process.env.NODE_ENV === "production") {
    throw new Error(`Invalid environment configuration: ${details}`);
  } else {
    console.warn("[env] Continuing in non-production despite invalid env (API DB ops may fail)");
  }
}

export const env = {
  ...value,
  isProduction: value.NODE_ENV === "production",
  isTest: value.NODE_ENV === "test",
  additionalOrigins: value.ADDITIONAL_ORIGINS
    ? value.ADDITIONAL_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean)
    : [],
};

export default env;
