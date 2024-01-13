import expressAsyncHandler from "express-async-handler";
import createHttpError from 'http-errors';
import { PrismaClient } from "@prisma/client";

import { userRegisterSchema, userLoginSchema } from "../schemas/requestSchema/auth.schema.js";
import { hashPassword, comparePasswords } from "../utils/auth.util.js"
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.util.js";

const { BadRequest, Conflict, NotFound, Unauthorized } = createHttpError

const prisma = new PrismaClient()

const userRegisterController = expressAsyncHandler(
    async (req, res) => {

        let { email, password, name } = await userRegisterSchema.validateAsync(req.body)

        const userExist = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (userExist) {
            throw Conflict(`${email} is unavailable!!!`)
        }

        password = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password
            },

            select: {
                id: true,
                name: true,
                email: true
            }
        })

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)

        res.status(201).json({
            accessToken,
            refreshToken
        })
    }
)

const userLoginController = expressAsyncHandler(
    async (req, res) => {
        try {
            const { email, password } = await userLoginSchema.validateAsync(req.body)

            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            if (!user) {
                throw NotFound("Invalid Email or Password!")
            }

            const isMatch = await comparePasswords(password, user.password)
            if (!isMatch) {
                throw Unauthorized("Invalid Email or Password!!!")
            }

            const accessToken = await signAccessToken(user.id)
            const refreshToken = await signRefreshToken(user.id)

            res.status(200).json({
                accessToken,
                refreshToken
            })

        } catch (error) {
            if (error.isJoi) {
                throw BadRequest("Invalid Email or Password!!!")
            }
            throw error
        }

    }
)

const refreshTokenController = expressAsyncHandler(
    async (req, res, next) => {
        const { token } = req.body

        if (!token) {
            throw BadRequest()
        }

        const userId = await verifyRefreshToken(token)

        const accessToken = await signAccessToken(userId)
        // const refreshToken = await signRefreshToken(userId)

        res.status(200).json({
            accessToken,
            // refreshToken
        })
    }
)

export { userRegisterController, userLoginController, refreshTokenController }