import Joi from "joi";

const getInvoiceSchema = Joi.object({
    invoiceId: Joi.string().uuid(),
});

const createInvoiceSchema = Joi.object({
    customerEmail: Joi.string().email().required(),
    invoiceDueDate: Joi.date().required(),
    invoiceDiscount: Joi.string().default("0%"),
    invoiceSubject: Joi.string().min(10).max(100).required(),
    invoiceNote: Joi.string()
        .min(10)
        .max(100)
        .default("Thanks for your patronage. It's a pleasure serving you.")
        .required(),

    invoiceItems: Joi.array().items({
        description: Joi.string().min(10).max(50).required(),
        quantity: Joi.number().required(),
        unitCost: Joi.number().required(),
        vat: Joi.string().default("0%"),
    }),
});

const sendInvoiceSchema = Joi.object({
    invoiceId: Joi.string().uuid().required(),
    customerId: Joi.string().uuid().required(),
});

const deleteInvoiceSchema = Joi.object({
    invoiceId: Joi.string().uuid().required(),
});

const updateInvoiceSchema = Joi.object({
    invoiceId: Joi.string().uuid().required(),

    customerEmail: Joi.string().email().required(),
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

export {
    getInvoiceSchema,
    createInvoiceSchema,
    sendInvoiceSchema,
    deleteInvoiceSchema,
    updateInvoiceSchema,
};
