import { Router } from "express";

import {
    userLoginController,
    userRegisterController,
    refreshTokenController,
    resendOtpController,
    verifyEmailController,
    forgotPasswordController,
    resetPasswordController,
    passwordResetController,
} from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/register", userRegisterController);
authRoutes.post("/login", userLoginController);
authRoutes.post("/verify-email", isLoggedIn, verifyEmailController);
authRoutes.post("/resend-otp", isLoggedIn, resendOtpController);
authRoutes.post("/refresh-token", refreshTokenController);
authRoutes.post("/forgot-password", forgotPasswordController);
authRoutes.get("/reset-password", resetPasswordController);
authRoutes.post("/password-reset", passwordResetController);

// authRoutes.delete('/logout', expressAsyncHandler(
//     async(req, res, next) => {
//         res.send('logout route')
//     }
// ))

export default authRoutes;
