import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

import axios from "axios";
import fs from "fs";
import FormData from "form-data";

import createHttpError from "http-errors";

const { InternalServerError } = createHttpError;

// environment variables
dotenv.config();

const currentModuleUrl = import.meta.url;
const currentModuleDir = dirname(fileURLToPath(currentModuleUrl));
const baseParentWorkingDir = path.resolve(currentModuleDir, "..");

const invoiceTemplatesDir = "templates/invoices";
const inputFilePath = path.join(
    baseParentWorkingDir,
    invoiceTemplatesDir,
    "generate.html"
);

async function generateInvoicePDF(invoice) {
    try {
        const formData = new FormData();
        formData.append("files", fs.createReadStream(inputFilePath), { filename: "index.html" });

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

        // Get the current timestamp in milliseconds
        // const timestamp = Date.now();
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
        // console.error("Error:", error || error.message);
        throw error
    }
}

export { generateInvoicePDF };
