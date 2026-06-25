import express from "express";
import {addCategory,getAllCategories} from "../controllers/categoryController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post("/addCategory",isAuthenticated,addCategory);
router.get("/getAllCategories",isAuthenticated,getAllCategories);



export default router;