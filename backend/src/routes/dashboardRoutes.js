import express from "express";
import {getDashboardSummary,getSalesTrend,getRecentInvoices,getTopSellingProducts,getPaymentMethodSummary,getBusinessInsights,getDeadStock,getCustomerMix,getBusinessHealth,getInventoryValue,getAdminDetails} from "../controllers/dashboardController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router=express.Router();


router.get("/getDashboardSummary",isAuthenticated,getDashboardSummary);
router.get("/getSalesTrend",isAuthenticated,getSalesTrend);
router.get("/getRecentInvoices",isAuthenticated,getRecentInvoices);
router.get("/getTopSellingProducts",isAuthenticated,getTopSellingProducts);
router.get("/getPaymentMethodSummary",isAuthenticated,getPaymentMethodSummary);
router.get("/getBusinessInsights",isAuthenticated,getBusinessInsights);
router.get("/getDeadStock",isAuthenticated,getDeadStock);
router.get("/getCustomerMix",isAuthenticated,getCustomerMix);
router.get("/getBusinessHealth",isAuthenticated,getBusinessHealth);
router.get("/getInventoryValue",isAuthenticated,getInventoryValue);
router.get("/getAdminDetails",isAuthenticated,getAdminDetails);





export default router;