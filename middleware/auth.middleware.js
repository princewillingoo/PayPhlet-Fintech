import { verifyAccessToken } from "../utils/jwtUtil.js"
import createHttpError from 'http-errors';

const { Unauthorized } = createHttpError

const isLoggedIn = (req, res, next) => {

    const payload = verifyAccessToken(req);

    if (!payload) {
        throw Unauthorized()
    }

    req.payload = payload;
    next()
}

export { isLoggedIn }