export const notFound = (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404
    next(err);
};

export const globalErrHandler = (err, req, res, next) => {

    // stack, statusCode, source
    const stack = err?.stack;
    const statusCode = err?.statusCode ? err?.statusCode : 500;
    const source = err?.source ? err?.source : undefined

    res.status(statusCode).json({
        message: err.message,
        stack,
        source,
    });
};
