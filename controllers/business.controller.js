import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import {
    generateQrCodeSchema,
    onBoardBusinessSchema,
} from "../schemas/business.schema.js";
import { notifyBusinessOnboarding } from "../services/email.service.js";
import { prisma } from "../config/prisma.config.js";
import { generateQR } from "../utils/business.utils.js";

const { Conflict, Forbidden } = createHttpError;

const onBoardBusinessCtrl = expressAsyncHandler(async (req, res) => {
    const {
        name,
        email,
        phoneNumber,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        notes,
    } = await onBoardBusinessSchema.validateAsync(req.body);

    let existingBusiness;

    existingBusiness = await prisma.business.findFirst({
        where: {
            userId: req.payload.id,
        },
    });

    if (existingBusiness) {
        throw Conflict("User already associated with a business");
    }

    existingBusiness = await prisma.business.findFirst({
        where: {
            OR: [{ name }, { email }, { phoneNumber }],
        },
    });

    if (existingBusiness) {
        throw Conflict("Details already associated with a business");
    }

    const business = await prisma.business.create({
        data: {
            name,
            email,
            phoneNumber,
            addressLine1,
            addressLine2,
            city,
            state,
            country,
            notes,

            userId: req.payload.id,
        },

        include: {
            user: true,
        },
    });

    await notifyBusinessOnboarding(
        business,
        "Welcome to PayPhlet: Your Business Onboarding is Complete!"
    );

    res.status(201).json({
        business,
    });
});

const generateQrCodeCtrl = expressAsyncHandler(async (req, res) => {
    const dataQrCode = await generateQrCodeSchema.validateAsync(req.body);

    const userBusiness = await prisma.business.findUnique({
        where: {
            userId: req.payload.id,
        },

        include: {
            user: true,
        },
    });

    if (!userBusiness) {
        throw Forbidden();
    }

    const { qrCodeData, filePath } = await generateQR(dataQrCode, userBusiness);

    const business = await prisma.business.update({
        where: {
            userId: req.payload.id,
        },

        data: {
            qrCodeData,
            qrCode: filePath,
        },

        include: {
            user: true,
        },
    });

    res.status(200).json({
        success: "QR code generated successfully!",
        business,
    });
});

export { onBoardBusinessCtrl, generateQrCodeCtrl };
