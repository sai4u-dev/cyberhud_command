/**
 * NoSQL-injection sanitizer — Express 4 & 5 compatible.
 *
 * Why in-house instead of `express-mongo-sanitize`: that package reassigns
 * `req.query`, which throws on Express 5 (`req.query` is a getter-only
 * property that re-parses per access). This middleware instead:
 *  - deep-scrubs `req.body` / `req.params` in place (drops `$`-prefixed and
 *    dotted keys, skips prototype-pollution keys), and
 *  - rewrites `req.url`'s query string to drop operator-style params
 *    (`role[$gt]`, `$where`, dotted keys) so every downstream reader
 *    (Joi, controllers, hpp) only ever sees clean input.
 *
 * Joi whitelists on each route remain the primary validator; this is the
 * defense-in-depth net. Safe to run before or after body parsing.
 */

const PROTO_KEYS = new Set(["__proto__", "constructor", "prototype"]);

const isOperatorKey = (key) =>
  typeof key === "string" &&
  (key.startsWith("$") || key.includes(".") || PROTO_KEYS.has(key));

const scrubValue = (value, onScrub) => {
  if (Array.isArray(value)) {
    for (let i = value.length - 1; i >= 0; i -= 1) {
      if (value[i] !== null && typeof value[i] === "object") scrubValue(value[i], onScrub);
    }
    return value;
  }
  if (value !== null && typeof value === "object") {
    for (const key of Object.keys(value)) {
      if (isOperatorKey(key) || PROTO_KEYS.has(key)) {
        delete value[key];
        onScrub(key);
      } else {
        scrubValue(value[key], onScrub);
      }
    }
  }
  return value;
};

const isDangerousQueryKey = (key) =>
  key.startsWith("$") ||
  key.includes(".") ||
  key.includes("[") ||
  key.includes("]") ||
  PROTO_KEYS.has(key);

/** Strip operator-style params by rewriting the raw query string. */
const cleanQueryString = (url) => {
  const qIndex = url.indexOf("?");
  if (qIndex === -1) return { url, scrubbed: [] };
  const params = new URLSearchParams(url.slice(qIndex + 1));
  const scrubbed = [];
  const kept = new URLSearchParams();
  for (const [key, value] of params) {
    if (isDangerousQueryKey(key)) {
      scrubbed.push(key);
      continue;
    }
    kept.append(key, value);
  }
  if (scrubbed.length === 0) return { url, scrubbed };
  const qs = kept.toString();
  return { url: url.slice(0, qIndex) + (qs ? `?${qs}` : ""), scrubbed };
};

const sanitizeInput = (req, _res, next) => {
  const scrubbed = [];
  const onScrub = (key) => scrubbed.push(key);

  try {
    if (req.body && typeof req.body === "object") scrubValue(req.body, onScrub);
    if (req.params && typeof req.params === "object") scrubValue(req.params, onScrub);

    // Express 5: req.query is getter-only — rewrite the raw query string instead.
    if (typeof req.url === "string" && req.url.includes("?")) {
      const { url, scrubbed: qsScrubbed } = cleanQueryString(req.url);
      if (qsScrubbed.length > 0) {
        req.url = url;
        scrubbed.push(...qsScrubbed.map((k) => `query:${k}`));
      }
    }

    if (scrubbed.length > 0 && req.log) {
      req.log.warn({ scrubbed, id: req.id }, "[sanitize] stripped operator keys");
    }
  } catch {
    // Sanitization must never break a request — validators run next anyway.
  }
  next();
};

export default sanitizeInput;
