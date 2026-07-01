import express from "express";
import {addProduct,getAllProducts,getProduct,deleteProduct,updateProduct,restockProduct} from "../controllers/productController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post("/addProduct",isAuthenticated,addProduct);
router.get("/getAllProducts",isAuthenticated,getAllProducts);
router.get("/getProduct/:productId",isAuthenticated,getProduct);
router.delete("/deleteProduct/:productId",isAuthenticated,deleteProduct);
router.put("/updateProduct/:productId",isAuthenticated,updateProduct);
router.put("/restockProduct/:productId",isAuthenticated,restockProduct);




export default router;