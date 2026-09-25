import logger from "../utils/logger.js";

/**
 * Global error handler — consistent envelope + structured logging.
 * - Operational errors (ApiError, Joi, Mongoose validation, JWT) → 4xx with message
 * - Programming errors → 500 with generic message (no leak), full log with requestId
 * - Never leaks stack traces outside development
 */
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors || {}).map((e) => e.message);
  }
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists`;
  }
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired token";
  }
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  const logPayload = {
    err: { name: err.name, message: err.message, stack: err.stack?.split("\n").slice(0, 5).join("\n") },
    req: { method: req.method, url: req.originalUrl, id: req.id, user: req.user?._id || req.user?.id },
    statusCode,
  };
  if (statusCode >= 500) logger.error(logPayload, "[http] unhandled error");
  else logger.warn(logPayload, "[http] request error");

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    requestId: req.id,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
