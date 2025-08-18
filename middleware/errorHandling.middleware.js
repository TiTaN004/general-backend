// middleware/errorHandling.middleware.js

// Global error handling middleware
export const errorHandling = (error, req, res, next) => {
    console.error('Global Error Handler:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Default error response
    let statusCode = 500;
    let message = "Internal Server Error";

    // Handle specific error types
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = error.message;
    } else if (error.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        message = "Duplicate entry - resource already exists";
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
        statusCode = 500;
        message = "Database configuration error";
    } else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = "Invalid token";
    } else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = "Token expired";
    }

    // Don't leak sensitive error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(statusCode).json({
        success: false,
        message: message,
        ...(isDevelopment && { 
            error: error.message,
            stack: error.stack 
        })
    });
}

// 404 Not Found middleware (should be placed before error handling)
export const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404;
    next(error);
}

// Async error wrapper - eliminates need for try/catch in every controller
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}