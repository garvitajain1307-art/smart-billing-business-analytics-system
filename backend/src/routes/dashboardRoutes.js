import express from "express";
import {getDashboardSummary,getSalesTrend,getRecentInvoices,getTopSellingProducts} from "../controllers/dashboardController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router=express.Router();


router.get("/getDashboardSummary",isAuthenticated,getDashboardSummary);
router.get("/getSalesTrend",isAuthenticated,getSalesTrend);
router.get("/getRecentInvoices",isAuthenticated,getRecentInvoices);
router.get("/getTopSellingProducts",isAuthenticated,getTopSellingProducts);



export default router;