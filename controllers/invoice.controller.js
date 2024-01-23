import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";
import generateUniqueId from "generate-unique-id";

import {
    createInvoiceSchema,
    getInvoiceSchema,
} from "../schemas/invoice.schema.js";

const { NotFound } = createHttpError;

const prisma = new PrismaClient();

const getInvoices = expressAsyncHandler(async (req, res) => {
    const invoices = await prisma.invoice.findMany({
        where: {
            userId: req.payload.id,
        },
    });

    res.status(200).json({
        invoices,
    });
});

const getInvoice = expressAsyncHandler(async (req, res) => {
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

const createInvoice = expressAsyncHandler(async (req, res) => {
    const {
        customer,
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

    const invoice = await prisma.invoice.create({
        data: {
            customer,
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
        },
    });

    console.log(invoice);

    //   await generatePDF(invoice);

    //   res.status(200).send("Server Error");
});

export { getInvoices, getInvoice, createInvoice };
