import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";
import generateUniqueId from "generate-unique-id";
import {
    createInvoiceSchema,
    deleteInvoiceSchema,
    getInvoiceSchema,
    sendInvoiceSchema,
    updateInvoiceSchema,
} from "../schemas/invoice.schema.js";
import {
    generateInvoicePDF,
    calculateInvoiceTotalsAsync,
} from "../utils/invoice.util.js";
import { sendInvoice } from "../services/email.service.js";

const { NotFound, BadRequest } = createHttpError;

const prisma = new PrismaClient();

const getInvoicesCtrl = expressAsyncHandler(async (req, res) => {
    const invoices = await prisma.invoice.findMany({
        where: {
            user: {
                is: {
                    id: req.payload.id,
                },
            },
        },
    });

    res.status(200).json({
        invoices,
    });
});

const getInvoiceCtrl = expressAsyncHandler(async (req, res) => {
    const { invoiceId } = await getInvoiceSchema.validateAsync(req.params);

    const invoice = await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
            userId: req.payload.id,
        },
    });

    if (!invoice) {
        throw NotFound("Invoice does not exists");
    }

    res.status(200).json({
        invoice,
    });
});

const createInvoiceCtrl = expressAsyncHandler(async (req, res) => {
    let invoiceData = await createInvoiceSchema.validateAsync(req.body);

    const invoiceNumber = generateUniqueId({
        length: 15,
        useLetters: true,
        useNumbers: true,
    });

    invoiceData = await calculateInvoiceTotalsAsync(invoiceData);

    // if customer does not exist then create
    let customer = await prisma.customer.findFirst({
        where: {
            email: invoiceData.customerEmail,
            userId: req.payload.id,
        },
    });
    if (!customer) {
        customer = await prisma.customer.create({
            data: { email: invoiceData.customerEmail, userId: req.payload.id },
        });
    }

    const invoice = await prisma.invoice.create({
        data: {
            invoiceNumber,
            customerId: customer.id,
            userId: req.payload.id,
            invoiceSubject: invoiceData.invoiceSubject,
            invoiceDueDate: invoiceData.invoiceDueDate,
            invoiceVat: invoiceData.invoiceVat,
            invoiceDiscount: invoiceData.invoiceDiscount,
            invoiceNote: invoiceData.invoiceNote,
            invoiceTotal: invoiceData.invoiceTotal,

            invoiceItems: {
                create: invoiceData.invoiceItems,
            },
        },

        include: {
            invoiceItems: true,
            customer: true,
        },
    });

    // await generateInvoicePDF(invoice);

    res.status(201).json({
        // message: "Invoice created succesfully",
        invoice: invoice,
    });
});

const sendInvoiceCtrl = expressAsyncHandler(async (req, res) => {
    const { invoiceId, customerId } = await sendInvoiceSchema.validateAsync({
        ...req.params,
        ...req.body,
    });
    const userId = req.payload.id;

    const invoice = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            customerId: customerId,
            userId: userId,
        },

        include: {
            customer: true,
            user: true,
        },
    });

    if (!invoice) {
        throw NotFound();
    }

    await sendInvoice(invoice, "Invoice! Invoice! Invoice!");

    // update invoice status after sending
    const updateInvoice = await prisma.invoice.update({
        where: {
            id: invoice.id,
        },
        data: {
            status: "SENT",
        },
    });

    res.status(200).json({
        invoice: updateInvoice,
        message: `Invoice sent to ${invoice.customer.email}`,
    });
});

const deleteInvoiceCtrl = expressAsyncHandler(async (req, res) => {
    const { invoiceId } = await deleteInvoiceSchema.validateAsync(req.params);

    try {
        await prisma.invoice.delete({
            where: {
                id: invoiceId,
                userId: req.payload.id,
            },
        });

        // await deleteGeneratedPDF(invoice);
    } catch (e) {
        console.log(e.message);
        throw NotFound();
    }

    res.status(204).json({});
});

const updateInvoiceCtrl = expressAsyncHandler(async (req, res) => {
    let invoiceData = await updateInvoiceSchema.validateAsync({
        ...req.body,
        ...req.params,
    });

    invoiceData = await calculateInvoiceTotalsAsync(invoiceData);

    let customer = await prisma.customer.findFirst({
        where: {
            email: invoiceData.customerEmail,
            userId: req.payload.id,
        },
    });
    if (!customer) {
        throw NotFound("Customer Does Not Exists");
    }

    const invoice = await prisma.invoice.update({
        where: {
            id: invoiceData.invoiceId,
            userId: req.payload.id,
            status: "DRAFT",
        },

        data: {
            customerId: customer.id,
            invoiceDueDate: invoiceData.invoiceDueDate,
            invoiceNote: invoiceData.invoiceNote,
            invoiceSubject: invoiceData.invoiceSubject,
            invoiceVat: invoiceData.invoiceVat,
            invoiceDiscount: invoiceData.invoiceDiscount,
            invoiceTotal: invoiceData.invoiceTotal,

            invoiceItems: {
                upsert: invoiceData.invoiceItems.map((invoiceItem) => ({
                    where: { id: invoiceItem.invoiceItemId }, // Assuming each invoice item has an 'id' field
                    update: {
                        description: invoiceItem.description,
                        quantity: invoiceItem.quantity,
                        unitCost: invoiceItem.unitCost,
                        vat: invoiceItem.vat,
                        subTotal: invoiceItem.subTotal,
                        subTotalPlusVat: invoiceItem.subTotal,
                    },
                    create: {
                        description: invoiceItem.description,
                        quantity: invoiceItem.quantity,
                        unitCost: invoiceItem.unitCost,
                        vat: invoiceItem.vat,
                        subTotal: invoiceItem.subTotal,
                        subTotalPlusVat: invoiceItem.subTotal,
                    },
                })),
            },
        },

        include: {
            invoiceItems: true,
            customer: true,
        },
    });

    if (!invoice) {
        throw BadRequest();
    }

    // await generateInvoicePDF(invoice);

    res.status(200).json({
        // message: "Invoice updated succesfully",
        invoice: invoice,
    });
});

export {
    getInvoicesCtrl,
    getInvoiceCtrl,
    createInvoiceCtrl,
    sendInvoiceCtrl,
    deleteInvoiceCtrl,
    updateInvoiceCtrl,
};
