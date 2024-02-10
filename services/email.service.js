import { fileURLToPath } from "url";
import path, { dirname } from "path";
import ejs from "ejs";
import nodemailer from "nodemailer";
import createHttpError from "http-errors";

const { InternalServerError } = createHttpError;

const BASE_URL = "http://localhost:2024";

const currentModuleUrl = import.meta.url;
const currentModuleDir = dirname(fileURLToPath(currentModuleUrl));
const baseParentWorkingDir = path.resolve(currentModuleDir, "..");

const authTemplatesDir = `templates/emails/auths`;
const invoiceTemplatesDir = `templates/emails/invoices`;
const invoiceFilesDir = `data/invoices/`;

async function mailSender(email, title, body, attachments = []) {
    const transporter = nodemailer.createTransport({
        // service: "gmail",
        // auth: {
        //     user: process.env.MAIL_USER,
        //     pass: process.env.MAIL_PASS,
        // },
        host: process.env.MAIL_HOST_MAILTRAP,
        port: process.env.MAIL_PORT_MAILTRAP,
        auth: {
            user: process.env.MAIL_USER_MAILTRAP,
            pass: process.env.MAIL_PASS_MAILTRAP,
        },
    });

    const info = await transporter.sendMail({
        from: "Prince Inyang from PayPhlet",
        to: email,
        subject: title,
        html: body,
        attachments: attachments,
    });

    return info;
}

async function sendPasswordResetLink(emailToken, user, subject) {
    const templateFilePath = path.join(
        baseParentWorkingDir,
        authTemplatesDir,
        "resetPassword.ejs"
    );

    const data = { emailToken, user };
    const options = {};

    ejs.renderFile(templateFilePath, data, options, async function (err, str) {
        try {
            if (err) {
                throw InternalServerError();
            }
            const mailResponse = await mailSender(user.email, subject, str);
            // console.log('Email sent successfully:', mailResponse);
        } catch (e) {
            console.log("Error sending email", e);
            throw InternalServerError();
        }
    });
}

async function sendEmailVerificationToken(emailToken, user, subject) {
    const templateFilePath = path.join(
        baseParentWorkingDir,
        authTemplatesDir,
        "verifyEmail.ejs"
    );

    const data = { emailToken, user };
    const options = {};

    ejs.renderFile(templateFilePath, data, options, async function (err, str) {
        try {
            if (err) {
                throw InternalServerError();
            }
            const mailResponse = await mailSender(user.email, subject, str);
            // console.log('Email sent successfully:', mailResponse);
        } catch (e) {
            console.log("Error sending email", e);
            throw InternalServerError();
        }
    });
}

async function sendInvoice(invoice, subject) {
    const templateFilePath = path.join(
        baseParentWorkingDir,
        invoiceTemplatesDir,
        "generateInvoice.ejs"
    );

    const invoiceFilePath = path.join(
        baseParentWorkingDir,
        invoiceFilesDir,
        `${invoice.userId}_${invoice.invoiceNumber}.pdf`
    );

    const attachments = [
        {
            filename: `${invoice.userId}_${invoice.invoiceNumber}.pdf`,
            path: invoiceFilePath,
        },
    ];

    const data = {};
    const options = {};

    ejs.renderFile(templateFilePath, data, options, async function (err, str) {
        try {
            if (err) {
                throw InternalServerError();
            }
            const mailResponse = await mailSender(
                invoice.customer.email,
                subject,
                str,
                attachments
            );
            // console.log('Email sent successfully:', mailResponse);
        } catch (e) {
            console.log("Error sending email", e);
            throw InternalServerError();
        }
    });
}

export { sendEmailVerificationToken, sendPasswordResetLink, sendInvoice };
