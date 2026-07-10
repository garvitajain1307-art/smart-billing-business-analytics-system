import express from "express";
import {getDashboardSummary,getSalesTrend} from "../controllers/dashboardController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router=express.Router();


router.get("/getDashboardSummary",isAuthenticated,getDashboardSummary);
router.get("/getSalesTrend",isAuthenticated,getSalesTrend);



export default router;