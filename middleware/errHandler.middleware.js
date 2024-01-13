import createHttpError from "http-errors";

export const notFound = (req, res, next) => {
    next(createHttpError.NotFound())
};

export const globalErrHandler = (err, req, res, next) => {

    // console.log(err)
    const message = err.message;
    const stack = err?.stack;
    const statusCode = err?.statusCode ? err.statusCode :
        err?.isJoi ? 422 :
            500
    const source = err?.source ? err?.source : undefined

    res.status(statusCode).json({error: {
        message,
        stack,
        source,
    }});
};
