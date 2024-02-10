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
        formData.append("files", stringReadStream(htmlStr), { filename: "index.html" });

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

export { generateInvoicePDF };
