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

    req[property] = value;
    next();
  };
};

export default validateRequest;
