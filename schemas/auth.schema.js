import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

const userRegisterSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    name: Joi.string().required(),
    password: joiPassword
        .string()
        .minOfSpecialCharacters(2)
        .minOfLowercase(2)
        .minOfUppercase(2)
        .minOfNumeric(2)
        .noWhiteSpaces()
        .required(),
})

const userLoginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: joiPassword
        .string()
        .minOfSpecialCharacters(2)
        .minOfLowercase(2)
        .minOfUppercase(2)
        .minOfNumeric(2)
        .noWhiteSpaces()
        .required(),
})


const resendOtpSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
})

const verifyEmailSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
})

export { userRegisterSchema, userLoginSchema, resendOtpSchema, verifyEmailSchema}