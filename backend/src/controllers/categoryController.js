import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import Category from "../models/category.js";
import { check, validationResult } from "express-validator";


export const addCategory=[
    check('name')
    .notEmpty()
    .withMessage('category name is required')
    ,
    asyncHandler(async(req,res,next)=>{
        const{name,description}=req.body;
        const companyId=req.admin.companyId;
        if (!companyId) {
            return next(new ErrorHandler("Please setup your company first", 400));
        }
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array().map(err=>err.msg),
                        oldInput:{name,description}
            });
        }
        const existingCategory=await Category.findOne({name,companyId});
        if(existingCategory){
            return next(new ErrorHandler("Category already exists",409));
            

        }
        const category=await Category.create({name,description,companyId});
        if(!category){
            return next(new ErrorHandler("Unable to create Category",400));
        }
        res.status(201).json({
            success: true,
            message: "Category added successfully",
            category,
        });

    })

]

export const getAllCategories=asyncHandler(async(req,res,next)=>{
    
        const companyId=req.admin.companyId;
        if (!companyId) {
            return next(new ErrorHandler("Please setup your company first", 400));
        }
        
        const categories=await Category.find({companyId}).sort({name:1}); //sort alphabetically
        
        res.status(200).json({
            success: true,
            message: "All categories fetched successfully",
            categories,
        });


})