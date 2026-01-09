/**
 * Global Error Handler Middleware
 * Catches and formats errors consistently
 */

function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    // Default error response
    const errorResponse = {
        error: err.message || 'Internal server error',
        code: err.code || 'INTERNAL_ERROR',
    };

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    // Determine status code
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json(errorResponse);
}

module.exports = errorHandler;
