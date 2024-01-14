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


// const refreshTokenSchema = Joi.object({
//     token: Joi.string().alphanum().min(3).max(200).required()
// })

export { userRegisterSchema, userLoginSchema }