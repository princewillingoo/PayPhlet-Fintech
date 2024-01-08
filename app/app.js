import dotenv from 'dotenv'
import express from 'express';

import { globalErrHandler, notFound } from '../middleware/errHandler.middleware.js';

// environment variables
dotenv.config()

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        message: "Hello, we're building a 500 fourtune comapny. Stay tuned."
    })
})

// err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;