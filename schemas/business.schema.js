import Joi from "joi";
import joiPhoneNumberExtendCore from "joi-phone-number";

const joiPhoneNumber = Joi.extend(joiPhoneNumberExtendCore);

const onBoardBusinessSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: joiPhoneNumber
        .string()
        .phoneNumber({ defaultCountry: "NG", format: "international" }),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    notes: Joi.string(),
});

export { onBoardBusinessSchema };
