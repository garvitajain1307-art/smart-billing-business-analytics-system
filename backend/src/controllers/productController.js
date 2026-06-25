import { asyncHandler } from "../middlewares/asyncHandler.js";
import { check, validationResult } from "express-validator";
import ErrorHandler from "../middlewares/error.js";
import Category from "../models/category.js";
import Product from "../models/product.js";
import HSNMaster from "../models/HSNMaster.js";

export const addProduct=[
    check('productCode')
    .notEmpty()
    .withMessage('Product Code is required')
    ,

    check('name')
    .notEmpty()
    .withMessage('Product Name is required')
    ,
    check('categoryId')
    .notEmpty()
    .withMessage("Category is required")
    ,
    check('purchasePrice')
    .notEmpty()
    .withMessage('Purchasing Cost is required')
    ,
    
    check('sellingPrice')
    .notEmpty()
    .withMessage('Selling Cost is required')
    ,
    check('quantity')
    .notEmpty()
    .withMessage('Quantity is required')

    ,
    check('unitType')
    .notEmpty()
    .withMessage('Unit Type is required')
    ,
    check("hsnCode")
    .notEmpty()
    .withMessage("HSN Code is required")
    ,

    asyncHandler(async(req,res,next)=>{
    

        const {productCode,name,categoryId,subCategory,purchasePrice,sellingPrice,quantity,unit,unitType,hsnCode,description,expiry,manufacturer}=req.body;
        const companyId=req.admin.companyId;

        if (!companyId) {
            return next(new ErrorHandler("Please setup your company first", 400));
        }
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({
                success: false,
                errors: errors.array().map(err => err.msg),
                oldInput: req.body,
        
            })

        }
        if(Number(sellingPrice)<Number(purchasePrice)){
            return next(new ErrorHandler("Selling Price must be greater than or equal to Purchase Price", 400));

        }
        const existingProduct=await Product.findOne({productCode,companyId});

        if(existingProduct){
            return next(new ErrorHandler("Product with this Product Code already exists", 400));
        
        }

        const category=await Category.findOne({_id:categoryId,companyId});
        if(!category){
            return next(new ErrorHandler("Invalid Category Selected", 400));

        }

        let finalHsnId=null;
        let finalHsnCode = null;
        let finalGstRate = 0;

        if(hsnCode){
            const hsn=await HSNMaster.findOne({hsnCode:hsnCode.trim()});
            if (!hsn) {
                return next(new ErrorHandler("Invalid HSN code", 400));
            }
            finalHsnId = hsn._id;
            finalHsnCode = hsn.hsnCode;
            finalGstRate = hsn.gstRate;
        }
        
        const product = await Product.create({
            productCode,
            name,
            categoryId,
            subCategory,
            purchasePrice,
            sellingPrice,
            quantity,
            unit,
            unitType,
            hsnId: finalHsnId,
            hsnCode: finalHsnCode,
            gstRate: finalGstRate,
            description,
            expiry,
            manufacturer,
            companyId,
        });

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product,
        });

    
})

]