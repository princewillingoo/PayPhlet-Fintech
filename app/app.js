import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import {
    globalErrHandler,
    notFound,
} from "../middleware/errHandler.middleware.js";
import authRoutes from "../routes/auth.route.js";
import invoiceRoutes from "../routes/invoice.route.js";
import businessRuotes from "../routes/business.route.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import "../config/development/redisConfig.js";

// environment variables
dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", "./templates");
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    res.render("index");
});

app.use("/auth", authRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/business", businessRuotes);

// err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;
