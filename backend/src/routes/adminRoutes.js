import express from "express";
import {registerAdmin,login,logout} from "../controllers/authController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post("/register",registerAdmin);
router.post("/login",login);
router.get("/logout",isAuthenticated,logout);


export default router;