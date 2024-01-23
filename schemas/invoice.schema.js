import Joi from "joi";

const getInvoiceSchema = Joi.object({
    invoiceId: Joi.string().uuid(),
});

const createInvoiceSchema = Joi.object({
    customer: Joi.string().email().required(),
    invoiceDueDate: Joi.date().required(),
    invoiceVat: Joi.number().default(0.0),
    invoiceDiscount: Joi.number().default(0.0),
    invoiceSubject: Joi.string().min(10).max(100).required(),
    invoiceNote: Joi.string()
        .min(10)
        .max(100)
        .default("Thanks for your patronage")
        .required(),
    invoiceTotal: Joi.number().required(),

    invoiceItems: Joi.array().items({
        description: Joi.string().min(10).max(50).required(),
        quantity: Joi.number().required(),
        unitCost: Joi.number().required(),
    }),
});

export { getInvoiceSchema, createInvoiceSchema };
