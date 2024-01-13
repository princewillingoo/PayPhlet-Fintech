import { verifyAccessToken } from "../utils/jwt.util.js"

const isLoggedIn = async (req, res, next) => {

    try {
        const payload = await verifyAccessToken(req);
        req.payload = payload;
        next()
    } catch (error) {
        throw  error
    }
}

export { isLoggedIn }