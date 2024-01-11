import createHttpError from "http-errors";

export const notFound = (req, res, next) => {
    next(createHttpError.NotFound())
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
