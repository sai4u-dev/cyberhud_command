/**
 * 404 handler — must be registered AFTER all routes, BEFORE errorHandler.
 * Returns a consistent envelope so clients never parse HTML errors.
 */
const notFound = (req, res, _next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    requestId: req.id,
  });
};

export default notFound;
