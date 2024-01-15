import { Router } from "express";

import { userLoginController, userRegisterController, refreshTokenController, resendOtpController, verifyEmailController } from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

// isLoggedIn

const authRoutes = Router();

authRoutes.post('/register', userRegisterController)
authRoutes.post('/login', userLoginController)
authRoutes.post('/verify-email', verifyEmailController)
authRoutes.post('/resend-otp', resendOtpController)
authRoutes.post('/refresh-token', refreshTokenController)

// authRoutes.delete('/logout', expressAsyncHandler(
//     async(req, res, next) => {
//         res.send('logout route')
//     }
// ))


export default authRoutes;