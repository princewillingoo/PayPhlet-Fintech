import { Router } from "express";

import { userLoginController, userRegisterController, refreshTokenController } from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post('/register', userRegisterController)
authRoutes.post('/login', userLoginController)

authRoutes.post('/refresh-token', refreshTokenController)

// authRoutes.delete('/logout', expressAsyncHandler(
//     async(req, res, next) => {
//         res.send('logout route')
//     }
// ))


export default authRoutes;