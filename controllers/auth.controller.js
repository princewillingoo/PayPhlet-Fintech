import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";

import {
    userRegisterSchema,
    userLoginSchema,
    resendOtpSchema,
    verifyEmailSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    passwordResetSchema,
} from "../schemas/auth.schema.js";
import {
    hashPassword,
    comparePasswords,
    generateOTP,
    generateForgotPasswordToken,
} from "../utils/auth.util.js";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt.util.js";
import {
    sendEmailVerificationToken,
    sendPasswordResetLink,
} from "../services/email.service.js";
import { client as redisClient } from "../config/development/redisConfig.js";

const { BadRequest, Conflict, NotFound, Unauthorized, InternalServerError } =
    createHttpError;

const prisma = new PrismaClient();

const userRegisterController = expressAsyncHandler(async (req, res) => {
    let { email, phone_number, password, name } =
        await userRegisterSchema.validateAsync(req.body);

    const userExist = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (userExist) {
        throw Conflict(`${email} is unavailable!!!`);
    }

    password = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email: email,
            name: name,
            phoneNumber: phone_number,
            password: password,
        },

        // select: {
        //   id: true,
        //   name: true,
        //   email: true,
        // },
    });

    const OTP = generateOTP();
    const redisResponse = await redisClient.set(user.email, OTP, { EX: 600 });
    if (redisResponse !== "OK") {
        throw InternalServerError();
    }

    await sendEmailVerificationToken(OTP, user, "Email Verification");

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);

    res.status(201).json({
        accessToken,
        refreshToken,
    });
});

const userLoginController = expressAsyncHandler(async (req, res) => {
    try {
        const { email, password } = await userLoginSchema.validateAsync(
            req.body
        );

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw NotFound("Invalid Email or Password!");
        }

        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) {
            throw Unauthorized("Invalid Email or Password!!!");
        }

        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        res.status(200).json({
            accessToken,
            refreshToken,
        });
    } catch (error) {
        if (error.isJoi) {
            throw BadRequest("Invalid Email or Password!!!");
        }
        throw error;
    }
});

const verifyEmailController = expressAsyncHandler(async (req, res) => {
    const { email, otp } = await verifyEmailSchema.validateAsync(req.body);

    const user = await prisma.user.findFirst({
        where: {
            email: email,
            isEmailVerified: false,
        },
    });

    if (!user) {
        throw Unauthorized();
    }

    const redisResponse = await redisClient.getDel(user.email);

    if (redisResponse === null || Number(redisResponse) !== Number(otp)) {
        throw Unauthorized("Invalid and Expired OTP");
    }

    const updatadUser = await prisma.user.update({
        where: {
            email: user.email,
        },
        data: {
            emailVerifiedAt: new Date(),
            isEmailVerified: true,
        },
        // select:{
        //     email:true,
        //     password: false ,
        //     emailVerifiedAt: false,
        //     rememberToken: false
        // }
    });

    res.status(200).json({
        message: "Email verified successfully",
        user: updatadUser,
    });
});

const resendOtpController = expressAsyncHandler(async (req, res) => {
    const { email } = await resendOtpSchema.validateAsync(req.body);

    const user = await prisma.user.findFirst({
        where: {
            email: email,
            isEmailVerified: false,
        },
    });

    if (!user) {
        throw Unauthorized();
    }

    await redisClient.getDel(user.email);

    const OTP = generateOTP();

    const redisResponse = await redisClient.set(user.email, OTP, { EX: 600 });
    if (redisResponse !== "OK") {
        throw InternalServerError();
    }

    await sendEmailVerificationToken(OTP, user, "Email Verification");

    res.status(200).json({
        status: "success",
    });
});

const refreshTokenController = expressAsyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
        throw BadRequest();
    }

    const userId = await verifyRefreshToken(token);

    const accessToken = await signAccessToken(userId);
    const refreshToken = await signRefreshToken(userId);

    res.status(200).json({
        accessToken,
        refreshToken,
    });
});

const forgotPasswordController = expressAsyncHandler(async (req, res) => {
    const { email } = await forgotPasswordSchema.validateAsync(req.body);

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw NotFound("Check your email for your password reset link");
    }

    const token = generateForgotPasswordToken();
    const redisResponse = await redisClient.SET(token, user.id, { EX: 800 });
    if (redisResponse !== "OK") {
        throw InternalServerError();
    }

    await sendPasswordResetLink(token, user, "Passwaord Reset Request");

    res.status(200).json({
        message: "Check your email for your password reset link",
    });
});

const resetPasswordController = expressAsyncHandler(async (req, res) => {
    const { token } = await resetPasswordSchema.validateAsync(req.query);

    const redisResponse = await redisClient.GET(token);
    if (redisResponse === null) {
        throw Unauthorized("Invalid and Expired Link");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: redisResponse,
        },
    });

    if (!user) {
        throw Unauthorized("Invalid and Expired Link");
    }

    res.status(200).json({
        token: token,
        userId: user.id,
    });
});

const passwordResetController = expressAsyncHandler(async (req, res) => {
    const { token, userId, password } = await passwordResetSchema.validateAsync(
        req.body
    );

    const redisResponse = await redisClient.GETDEL(token);
    if (redisResponse === null || redisResponse !== userId) {
        throw Unauthorized("Invalid and Expired Link");
    }

    const hashedPassword = await hashPassword(password);

    const updatedUser = await prisma.user.update({
        where: {
            id: redisResponse,
        },
        data: {
            password: hashedPassword,
        },
    });

    if (!updatedUser) {
        throw Unauthorized("Invalid and Expired Link");
    }

    res.status(200).json({
        updatedUser,
    });
});

const logoutController = expressAsyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
        throw BadRequest();
    }

    const userId = await verifyRefreshToken(token);

    const redisResponse = await redisClient.GETDEL(userId);
    if (redisResponse === null || redisResponse !== token) {
        throw Unauthorized();
    }

    console.log(redisResponse);

    res.sendStatus(204);
});

export {
    userRegisterController,
    userLoginController,
    refreshTokenController,
    resendOtpController,
    verifyEmailController,
    forgotPasswordController,
    resetPasswordController,
    passwordResetController,
    logoutController,
};
