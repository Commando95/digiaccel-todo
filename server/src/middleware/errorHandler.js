export function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  let status = err.status || 500;
  let message = err.message || 'Internal server error';
  let details;
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Please check the submitted task details.';
    details = Object.values(err.errors).map((item) => item.message);
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid task ID.';
  } else if (err.code === 11000) {
    status = 409;
    message = 'A record with this value already exists.';
  }
  if (status >= 500) console.error(err);
  res.status(status).json({ message, ...(details ? { details } : {}), ...(process.env.NODE_ENV !== 'production' && status >= 500 ? { stack: err.stack } : {}) });
}
