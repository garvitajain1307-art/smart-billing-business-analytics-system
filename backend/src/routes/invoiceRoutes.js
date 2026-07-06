import express from "express";
import {generateInvoice,getNextInvoiceNo,previewInvoice,downloadInvoicePDF,getAllInvoices,deleteInvoice} from "../controllers/invoiceController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post("/generateInvoice",isAuthenticated,generateInvoice);
router.get("/getNextInvoiceNo",isAuthenticated,getNextInvoiceNo);
router.get("/previewInvoice/:invoiceId",isAuthenticated,previewInvoice);
router.get("/downloadInvoicePDF/:invoiceId", isAuthenticated, downloadInvoicePDF);
router.get("/getAllInvoices", isAuthenticated, getAllInvoices);
router.delete("/deleteInvoice/:invoiceId", isAuthenticated, deleteInvoice);



export default router;