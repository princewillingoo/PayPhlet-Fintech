import jwt from "jsonwebtoken"
import createHttpError from 'http-errors';

const { Unauthorized, InternalServerError } = createHttpError

const signAccessToken = (id) => {
    return new Promise((resolve, reject) => {

        const secretKey = process.env.ACCESS_TOKEN_SECRET
        const options = { expiresIn: "1h", issuer: "payphelt.com", audience: id }

        jwt.sign({ id }, secretKey, options, (err, token) => {
            if (err) {
                reject(InternalServerError())
            }
            resolve(token)
        })

    })
}

const getAccessToken = (req) => {
    // get token from header
    const token = req?.headers?.authorization?.split(" ")[1];

    if (token === undefined) {
        throw Unauthorized()
    }
    return token
}

const verifyAccessToken = (req) => {
    return new Promise((resolve, reject) => {
        const token = getAccessToken(req);
        const secretKey = process.env.ACCESS_TOKEN_SECRET;

        jwt.verify(token, secretKey, (err, payload) => {
            if (err) {
                if (err.name === "JsonWebTokenError") {
                    reject(Unauthorized());
                } else {
                    reject(Unauthorized(`${err.message}.`));
                }
            } else {
                resolve(payload);
            }
        });
    });
};


const signRefreshToken = (id) => {
    return new Promise((resolve, reject) => {

        const secretKey = process.env.REFRESH_TOKEN_SECRET
        const options = { expiresIn: "15 days", issuer: "payphelt.com", audience: id }

        jwt.sign({ id }, secretKey, options, (err, token) => {
            if (err) {
                reject(InternalServerError())
            }
            resolve(token)
        })

    })
}

const verifyRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET,
            (err, payload) => {
                if (err) {
                    if (err.name === "JsonWebTokenError") {
                        reject(Unauthorized());
                    } else {
                        reject(Unauthorized(`${err.message}. please, login`));
                    }
                } else {
                    const id = payload.id

                    resolve(id)
                }
            }
        )
    })
}

export { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken }