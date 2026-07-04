import express from "express";
import {generateInvoice,getNextInvoiceNo} from "../controllers/invoiceController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post("/generateInvoice",isAuthenticated,generateInvoice);
router.get("/getNextInvoiceNo",isAuthenticated,getNextInvoiceNo);


export default router;