/**
 * asyncHandler — eliminates try/catch boilerplate in controllers.
 * Wrap every async route handler: `router.get("/", asyncHandler(fn))`.
 * Errors flow to the global errorHandler with request context.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
