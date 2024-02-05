import { Router } from "express";

import {
    getInvoicesCtrl,
    getInvoiceCtrl,
    createInvoiceCtrl,
    sendInvoiceCtrl
} from "../controllers/invoice.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const invoiceRoutes = Router();

invoiceRoutes.get("/", isLoggedIn, getInvoicesCtrl);
invoiceRoutes.get("/:invoiceId", isLoggedIn, getInvoiceCtrl);
invoiceRoutes.post("/create", isLoggedIn, createInvoiceCtrl);
invoiceRoutes.get("/:invoiceId/send/:customerId", isLoggedIn, sendInvoiceCtrl);

export default invoiceRoutes;
