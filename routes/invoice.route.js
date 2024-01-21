import { Router } from "express";

import {
  getInvoices,
  getInvoice,
  createInvoice,
} from "../controllers/invoice.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const invoiceRoutes = Router();

invoiceRoutes.get("/", isLoggedIn, getInvoices);
invoiceRoutes.get("/:invoiceId", isLoggedIn, getInvoice);
invoiceRoutes.post("/create", isLoggedIn, createInvoice);

export default invoiceRoutes;
