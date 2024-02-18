import { Router } from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import { onBoardBusinessCtrl } from "../controllers/business.controller.js";

const businessRuotes = Router();

businessRuotes.post("/", isLoggedIn, onBoardBusinessCtrl);

export default businessRuotes;
