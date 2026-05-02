module.exports = (err, req, res, next) => {
    // Already logged by requestLogger via the status code,
    // but for 500-class errors we want the stack trace in the console too
    const status = err.status || 500;

    if (status >= 500) {
        console.error(`[ERROR] ${req.method} ${req.originalUrl}`);
        console.error(err.stack || err.message);
    }

    const response = {
        error: err.message || 'Internal Server Error',
        status
    };

    // Include stack trace only in development, never in production
    if (process.env.NODE_ENV !== 'production' && status >= 500) {
        response.stack = err.stack;
    }

    res.status(status).json(response);
};