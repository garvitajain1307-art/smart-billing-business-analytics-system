import express from "express";
import {registerCompany} from "../controllers/companyController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post("/registerCompany",isAuthenticated,registerCompany);

export default router;