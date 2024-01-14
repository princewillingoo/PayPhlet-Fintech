import dotenv from 'dotenv'
import express from 'express';
import morgan from 'morgan';
import expressAsyncHandler from 'express-async-handler';

import { globalErrHandler, notFound } from '../middleware/errHandler.middleware.js';
import authRoutes from '../routes/auth.route.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';
import "../config/development/redisConfig.js";

// environment variables
dotenv.config()

const app = express();

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', isLoggedIn, async (req, res) => {
    res.json({
        message: "Hello, I'm building a 500 fourtune comapny. Stay tuned."
    })
})

app.use('/auth', authRoutes)

// err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;