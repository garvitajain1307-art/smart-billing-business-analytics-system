import express from "express";
import {createCustomer,getAllCustomers,searchCustomer,getCustomerDetails,deleteCustomer} from "../controllers/customerController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post("/createCustomer",isAuthenticated,createCustomer);
router.get("/getAllCustomers",isAuthenticated,getAllCustomers);
router.get("/searchCustomer",isAuthenticated,searchCustomer);
router.get("/getCustomerDetails/:id",isAuthenticated,getCustomerDetails);
router.delete("/deleteCustomer/:customerId", isAuthenticated, deleteCustomer);



export default router;