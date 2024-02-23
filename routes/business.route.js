import { Router } from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import { generateQrCodeCtrl, onBoardBusinessCtrl } from "../controllers/business.controller.js";

const businessRuotes = Router();

businessRuotes.post("/", isLoggedIn, onBoardBusinessCtrl);
businessRuotes.post("/generate-qrcode", isLoggedIn, generateQrCodeCtrl);

export default businessRuotes;
