import express from "express";
import {registerAdmin,login,logout,getAdmin} from "../controllers/authController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post("/register",registerAdmin);
router.post("/login",login);
router.get("/logout",isAuthenticated,logout);
router.get("/getMe",isAuthenticated,getAdmin);


export default router;