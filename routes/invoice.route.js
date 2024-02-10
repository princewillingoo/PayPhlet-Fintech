import { Router } from "express";

import {
    getInvoicesCtrl,
    getInvoiceCtrl,
    createInvoiceCtrl,
    sendInvoiceCtrl,
    deleteInvoiceCtrl,
    updateInvoiceCtrl,
} from "../controllers/invoice.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const invoiceRoutes = Router();

invoiceRoutes.get("/", isLoggedIn, getInvoicesCtrl);
invoiceRoutes.get("/:invoiceId", isLoggedIn, getInvoiceCtrl);
invoiceRoutes.post("/", isLoggedIn, createInvoiceCtrl);
invoiceRoutes.post(":invoiceId/send/", isLoggedIn, sendInvoiceCtrl);
invoiceRoutes.delete("/:invoiceId/", isLoggedIn, deleteInvoiceCtrl);
invoiceRoutes.put("/:invoiceId/", isLoggedIn, updateInvoiceCtrl);

export default invoiceRoutes;
