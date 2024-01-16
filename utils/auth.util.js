import { hash, compare } from "bcrypt";

import { v4 as uuidv4 } from "uuid";

function generateForgotPasswordToken() {
    return uuidv4();
}

const generateOTP = () => {
    const length = 6;
    const characters = "0123456789";

    let otp = "";
    for (let o = 0; o < length; o++) {
        const getRandomIndex = Math.floor(Math.random() * characters.length);
        otp += characters[getRandomIndex];
    }

    return otp;
};

async function hashPassword(password) {
    try {
        const saltRounds = 10;
        const hashedPassword = await hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error("Something went wrong. Try again Later");
    }
}

async function comparePasswords(enteredPassword, hashedPassword) {
    try {
        const isMatch = await compare(enteredPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error("Something went wrong. Try again Later");
    }
}

export {
    hashPassword,
    comparePasswords,
    generateOTP,
    generateForgotPasswordToken,
};
