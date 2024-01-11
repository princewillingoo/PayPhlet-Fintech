import dotenv from 'dotenv'
import express from 'express';
import morgan from 'morgan';


import { globalErrHandler, notFound } from '../middleware/errHandler.middleware.js';
import authRoutes from '../routes/auth.route.js';

// environment variables
dotenv.config()

const app = express();

app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        message: "Hello, we're building a 500 fourtune comapny. Stay tuned."
    })
})

app.use('/auth', authRoutes)

// err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;