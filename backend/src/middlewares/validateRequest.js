import ApiError from "../utils/ApiError.js";

const validateRequest = (schema, property = "body") => {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((d) => d.message);
      return next(new ApiError(400, "Validation failed", errors));
    }

    // req.query is getter-only in Express 5 (re-parsed per access), so the
    // write-back below only persists on Express 4. That is fine: validation
    // itself always runs against the live parse (fail-closed), and
    // controllers re-read + coerce whitelisted fields themselves.
    if (property === "query") {
      Object.keys(req.query || {}).forEach((k) => delete req.query[k]);
      Object.assign(req.query || {}, value);
    } else {
      req[property] = value;
    }
    next();
  };
};

export default validateRequest;
