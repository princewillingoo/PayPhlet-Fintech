import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { onBoardBusinessSchema } from "../schemas/business.schema.js";
import { notifyBusinessOnboarding } from "../services/email.service.js";

const { Conflict } = createHttpError;

const prisma = new PrismaClient();

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

export { onBoardBusinessCtrl };
