import { hash, compare } from 'bcrypt';

async function hashPassword(password) {
    try {
        const saltRounds = 10;
        const hashedPassword = await hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error("Something went wrong. Try again Later")
    }
}

async function comparePasswords(enteredPassword, hashedPassword) {
    try{
        const isMatch = await compare(enteredPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error("Something went wrong. Try again Later")
    }
}

export { hashPassword, comparePasswords };
