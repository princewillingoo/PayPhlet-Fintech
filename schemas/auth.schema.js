import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
import joiPhoneNumberExtendCore from "joi-phone-number";

const joiPhoneNumber = Joi.extend(joiPhoneNumberExtendCore);
const joiPassword = Joi.extend(joiPasswordExtendCore);

const userRegisterSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    name: Joi.string().required(),
    phone_number: joiPhoneNumber
        .string()
        .phoneNumber({ defaultCountry: "NG", format: "international" }),
    password: joiPassword
        .string()
        .minOfSpecialCharacters(2)
        .minOfLowercase(2)
        .minOfUppercase(2)
        .minOfNumeric(2)
        .noWhiteSpaces()
        .required(),
    confirm_password: Joi.ref("password"),
});

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
});

const resendOtpSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
});

const verifyEmailSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    otp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required(),
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().uuid().required(),
});

const passwordResetSchema = Joi.object({
    token: Joi.string().uuid().required(),
    userId: Joi.string().uuid().required(),
    password: joiPassword
        .string()
        .minOfSpecialCharacters(2)
        .minOfLowercase(2)
        .minOfUppercase(2)
        .minOfNumeric(2)
        .noWhiteSpaces()
        .required(),
});

export {
    userRegisterSchema,
    userLoginSchema,
    resendOtpSchema,
    verifyEmailSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    passwordResetSchema,
};
