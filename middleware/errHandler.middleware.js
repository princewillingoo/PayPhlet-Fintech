import createHttpError from "http-errors";
import prisma from "@prisma/client";

const { PrismaClientKnownRequestError } = prisma;
const { NotFound } = createHttpError;

/**
 * Middleware to handle 404 Not Found errors.
 */
export const notFound = (req, res, next) => {
    const error = NotFound();
    next(error);
};

/**
 * Global error handler middleware.
 * @param {Error} err - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 */
export const globalErrHandler = (err, req, res, next) => {
    // Log the error
    console.error(err);

    // Extract error properties
    const statusCode = err?.statusCode || (err?.isJoi ? 422 : 500);
    const message = err?.message || "Internal Server Error";
    // const stack = err?.stack;
    // const source = err?.source;

    // Send error response
    res.status(statusCode).json({
        error: {
            isError: true,
            message,
            // stack,
            // source,
        },
    });
};
