import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { client as redisClient } from "../config/development/redisConfig.js";

const { Unauthorized, InternalServerError } = createHttpError;

const getAccessToken = (req) => {
    // get token from header
    const token = req?.headers?.authorization?.split(" ")[1];
    if (token === undefined) {
        throw Unauthorized();
    }
    return token;
};

const signAccessToken = (id) => {
    return new Promise((resolve, reject) => {
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: "24h",
            issuer: "payphelt.com",
            audience: id,
        };

        jwt.sign({ id }, secretKey, options, (err, token) => {
            if (err) {
                return reject(InternalServerError());
            }
            return resolve(token);
        });
    });
};

const verifyAccessToken = (req) => {
    const token = getAccessToken(req);

    return jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, payload) => {
            if (err) {
                if (err.name === "JsonWebTokenError") {
                    throw Unauthorized();
                } else {
                    throw Unauthorized(`${err.message}.`);
                }
            } else {
                return payload;
            }
        }
    );
};

const signRefreshToken = (id) => {
    return new Promise((resolve, reject) => {
        const secretKey = process.env.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn: "5 days",
            issuer: "payphelt.com",
            audience: id,
        };

        jwt.sign({ id }, secretKey, options, async (err, token) => {
            if (err) {
                return reject(InternalServerError());
            }

            const redisResponse = await redisClient.set(id, token, {
                EX: 5 * 24 * 60 * 60,
            });
            if (redisResponse !== "OK") {
                return reject(InternalServerError());
            }
            return resolve(token);
        });
    });
};

const verifyRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, payload) => {
                if (err) {
                    // console.log(err)
                    return reject(Unauthorized());
                }

                const userId = payload.id;
                console.log(payload.id, payload.aud);
                const redisResponse = await redisClient.GET(userId);
                console.log(redisResponse);
                if (!redisResponse) {
                    return reject(InternalServerError());
                }
                if (token === redisResponse) {
                    return resolve(userId);
                }

                return reject(Unauthorized("Unauthorized!!!"));
            }
        );
    });
};

export {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
};
