import express from "express";
import {createCustomer,getAllCustomers,searchCustomer} from "../controllers/customerController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post("/createCustomer",isAuthenticated,createCustomer);
router.get("/getAllCustomers",isAuthenticated,getAllCustomers);
router.get("/searchCustomer",isAuthenticated,searchCustomer);

export default router;