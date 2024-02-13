import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { Readable } from "stream";

import createHttpError from "http-errors";
import { renderFile } from "ejs";

const { InternalServerError } = createHttpError;

// environment variables
dotenv.config();

const currentModuleUrl = import.meta.url;
const currentModuleDir = dirname(fileURLToPath(currentModuleUrl));
const baseParentWorkingDir = path.resolve(currentModuleDir, "..");

const invoiceTemplatesDir = "templates/emails/invoices";

function stringReadStream(str) {
    const stream = new Readable();
    stream.push(str);
    stream.push(null);
    return stream;
}

async function generateInvoicePDF(invoice) {
    let htmlStr = undefined;

    const templateFilePath = path.join(
        baseParentWorkingDir,
        invoiceTemplatesDir,
        "generateInvoice.ejs"
    );

    renderFile(templateFilePath, {}, {}, function (err, str) {
        if (err) {
            throw InternalServerError();
        }

        htmlStr = str;
    });
    // console.log(htmlStr)
    try {
        const formData = new FormData();
        formData.append("files", stringReadStream(htmlStr), {
            filename: "index.html",
        });

        const response = await axios.post(
            process.env.PDF_GENERATION_API,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
                responseType: "stream",
            }
        );

        const outputFilePath = path.join(
            baseParentWorkingDir,
            "data/invoices",
            `${invoice.userId}_${invoice.invoiceNumber}.pdf`
        );

        const outputStream = fs.createWriteStream(outputFilePath);
        response.data.pipe(outputStream);

        await new Promise((resolve, reject) => {
            outputStream.on("finish", resolve("Invoice created succesfully"));
            outputStream.on("error", reject(InternalServerError()));
        });

        // console.log(`File saved as ${outputFilePath}`);
    } catch (error) {
        console.error("Error:", error || error.message);
        throw InternalServerError();
    }
}

function calculateInvoiceTotalsAsync(invoiceData) {
    return new Promise((resolve, reject) => {
        // Calculate subtotal for each item and update the item object
        invoiceData.invoiceItems.forEach((item) => {
            const vatRate = parseFloat(item.vat) / 100;
            item.subTotal = parseFloat(
                (item.quantity * item.unitCost).toFixed(2)
            );
            item.subTotalPlusVat = parseFloat(
                (item.subTotal * (1 + vatRate)).toFixed(2)
            );
        });

        // Calculate net-total and net-total plus VAT for all items
        const netTotal = invoiceData.invoiceItems
            .reduce((total, item) => {
                return total + parseFloat(item.subTotal);
            }, 0)
            .toFixed(2);

        const netTotalPlusVat = invoiceData.invoiceItems
            .reduce((total, item) => {
                return total + parseFloat(item.subTotalPlusVat);
            }, 0)
            .toFixed(2);

        // Calculate VAT total for all items
        const netVatTotal = (netTotalPlusVat - netTotal).toFixed(2);

        // Calculate discount amount
        const discountAmount = (
            (parseFloat(invoiceData.invoiceDiscount) / 100) *
            netTotalPlusVat
        ).toFixed(2);

        // Calculate invoice total
        const netInvoiceTotal = (netTotalPlusVat - discountAmount).toFixed(2);

        // Update invoice object
        invoiceData.invoiceTotal = parseFloat(netInvoiceTotal);
        invoiceData.invoiceVat = parseFloat(netVatTotal);

        // Resolve the promise with the updated invoice object
        resolve(invoiceData);
    });
}

export { generateInvoicePDF, calculateInvoiceTotalsAsync };
