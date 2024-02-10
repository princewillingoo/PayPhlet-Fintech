import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";
import generateUniqueId from "generate-unique-id";
import {
    createInvoiceSchema,
    deleteInvoiceSchema,
    getInvoiceSchema,
    sendInvoiceSchema,
} from "../schemas/invoice.schema.js";
import { generateInvoicePDF } from "../utils/invoice.util.js";
import { sendInvoice } from "../services/email.service.js";

const { NotFound } = createHttpError;

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
    const {
        customerEmail,
        invoiceDueDate,
        invoiceSubject,
        invoiceNote,
        invoiceVat,
        invoiceDiscount,
        invoiceTotal,
        invoiceItems,
    } = await createInvoiceSchema.validateAsync(req.body);

    const status = "DRAFT";
    const userId = req.payload.id;
    const invoiceNumber = generateUniqueId({
        length: 15,
        useLetters: true,
        useNumbers: true,
    });

    // if customer does not exist and create
    let customer = await prisma.customer.findUnique({
        where: {
            email: customerEmail,
        },
    });
    if (!customer) {
        customer = await prisma.customer.create({
            data: { email: customerEmail, userId: userId },
        });
    }
    const customerId = customer.id;

    const invoice = await prisma.invoice.create({
        data: {
            customerId,
            invoiceDueDate,
            invoiceNote,
            invoiceSubject,
            invoiceVat,
            invoiceDiscount,

            userId,
            invoiceNumber,
            invoiceTotal,
            status,

            invoiceItems: {
                create: invoiceItems,
            },
        },

        include: {
            invoiceItems: true,
            customer: true,
        },
    });

    // console.log(invoice);

    await generateInvoicePDF(invoice);

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

export {
    getInvoicesCtrl,
    getInvoiceCtrl,
    createInvoiceCtrl,
    sendInvoiceCtrl,
    deleteInvoiceCtrl,
};
