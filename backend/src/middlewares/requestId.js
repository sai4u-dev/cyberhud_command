import { randomUUID } from "node:crypto";

/**
 * Request-ID propagation — required for distributed tracing.
 * Client may send `X-Request-Id`; otherwise we generate a UUIDv4.
 * The id is echoed back and attached to logs via pino-http.
 */
export const requestId = (req, res, next) => {
  const incoming = req.headers["x-request-id"];
  const id =
    (Array.isArray(incoming) ? incoming[0] : incoming)?.toString().slice(0, 64) || randomUUID();
  req.id = id;
  res.setHeader("X-Request-Id", id);
  next();
};

export default requestId;
