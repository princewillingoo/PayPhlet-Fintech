import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

const authRoutes = Router();

authRoutes.post('/register', expressAsyncHandler(
    async(req, res, next) => {
        res.send('register route')
    }
))

authRoutes.post('/login', expressAsyncHandler(
    async(req, res, next) => {
        res.send('login route')
    }
))

authRoutes.post('/refresh-token', expressAsyncHandler(
    async(req, res, next) => {
        res.send('refresh token route')
    }
))

authRoutes.delete('/logout', expressAsyncHandler(
    async(req, res, next) => {
        res.send('logout route')
    }
))


export default authRoutes;