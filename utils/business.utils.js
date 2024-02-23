import QRCode from "qrcode";
import createHttpError from "http-errors";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";

const { InternalServerError } = createHttpError;

const currentModuleUrl = import.meta.url;
const currentModuleDir = dirname(fileURLToPath(currentModuleUrl));
const baseParentWorkingDir = path.resolve(currentModuleDir, "..");

const qrCodeDir = "data/qrcode";

const generateQR = async (dataQrCode, userBusiness) => {
    const qrCodeData = `Bank Name: ${dataQrCode.bankName}\nAccount Name: ${dataQrCode.accountName}\nAccount Number: ${dataQrCode.accountNo}`;
    const filePath = path.join(
        baseParentWorkingDir,
        qrCodeDir,
        `${userBusiness.user.id}_${userBusiness.id}_QrCode.png`
    );

    try {
        const qrCodeBuffer = await QRCode.toBuffer(qrCodeData, { width: 300 });
        fs.writeFileSync(filePath, qrCodeBuffer);

        return { qrCodeData, filePath };
    } catch (err) {
        console.error(err);
        throw InternalServerError();
    }
};

export { generateQR };
