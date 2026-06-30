import express from "express";
import {searchHsn} from "../controllers/hsnController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router=express.Router();

router.get("/searchHsn",isAuthenticated,searchHsn);



export default router;