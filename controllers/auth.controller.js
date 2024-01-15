import expressAsyncHandler from "express-async-handler";
import createHttpError from 'http-errors';
import { PrismaClient } from "@prisma/client";

import { userRegisterSchema, userLoginSchema, resendOtpSchema, verifyEmailSchema } from "../schemas/auth.schema.js";
import { hashPassword, comparePasswords, generateOTP } from "../utils/auth.util.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.util.js";
import { sendEmailToken } from "../services/email.service.js";
import { client as redisClient } from "../config/development/redisConfig.js";


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

        const OTP = generateOTP()
        const redisResponse = await redisClient.set(user.email, OTP, { EX: 600 })
        if (redisResponse !== 'OK') {
            throw InternalServerError()
        }

        await sendEmailToken(OTP, user, "Email Verification")

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)

        res.status(201).json({
            accessToken,
            refreshToken
        })
    }
)

const resendOtpController = expressAsyncHandler(
    async (req, res) => {

        const { email } = await resendOtpSchema.validateAsync(req.body)

        const user = await prisma.user.findFirst({
            where: {
                email: email,
                isEmailVerified: false
            }
        })

        if (!user) {
            throw Unauthorized()
        }

        await redisClient.getDel(user.email)

        const OTP = generateOTP()

        const redisResponse = await redisClient.set(user.email, OTP, { EX: 1200 })
        if (redisResponse !== 'OK') {
            throw InternalServerError()
        }

        await sendEmailToken(OTP, user, "Email Verification")

        res.status(200).json({
            status: "success"
        })
    }
)

const verifyEmailController = expressAsyncHandler(
    async (req, res) => {
        const { email, otp } = await verifyEmailSchema.validateAsync(req.body)

        const user = await prisma.user.findFirst({
            where: {
                email: email,
                isEmailVerified: false
            }
        })

        if (!user) {
            throw Unauthorized()
        }

        const redisResponse = await redisClient.getDel(user.email)

        if (redisResponse === null || Number(redisResponse) !== Number(otp)) {
            throw Unauthorized("Invalid and Expired OTP")
        }

        const updatadUser = await prisma.user.update({
            where: {
                email: user.email,
            },
            data: {
                emailVerifiedAt: new Date(),
                isEmailVerified: true
            },
            // select:{
            //     email:true,
            //     password: false ,
            //     emailVerifiedAt: false,
            //     rememberToken: false           
            // }
        })

        res.status(200).json({
            message: "Email verified successfully",
            user: updatadUser
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
    async (req, res) => {

        const { token } = req.body

        if (!token) {
            throw BadRequest()
        }

        const userId = await verifyRefreshToken(token)

        const accessToken = await signAccessToken(userId)
        const refreshToken = await signRefreshToken(userId)

        res.status(200).json({
            accessToken,
            refreshToken
        })
    }
)

export { userRegisterController, userLoginController, refreshTokenController, resendOtpController, verifyEmailController }