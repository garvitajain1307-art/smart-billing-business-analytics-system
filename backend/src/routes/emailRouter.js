import express from "express";
import {testEmail} from "../controllers/emailController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router=express.Router();
router.post("/test-email", testEmail);

export default router;