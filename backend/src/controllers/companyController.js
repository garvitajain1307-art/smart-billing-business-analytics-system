import { asyncHandler } from "../middlewares/asyncHandler.js";
import { check, validationResult } from "express-validator";
import ErrorHandler from "../middlewares/error.js";
import Company from "../models/company.js";
import Admin from "../models/admin.js";

export const registerCompany=[
    check('companyName')
    .notEmpty()
    .withMessage('Company Name is required')

    ,

    check('ownerName')
    .notEmpty()
    .withMessage('Owner Name is required')
    ,
    check('gstNo')
    .notEmpty()
    .withMessage('GST Number is required')
    ,
    
    check('email')
    .notEmpty()
    .withMessage('Email is required')
    ,
    check('phone')
    .notEmpty()
    .withMessage('Phone is required')

    ,
    check('address')
    .notEmpty()
    .withMessage('Address is required')
    ,

    asyncHandler(async(req,res,next)=>{
    

    const {companyName,ownerName,gstNo,email,phone,address}=req.body;
    

    const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({
                success: false,
               errors: errors.array().map(err => err.msg),
               oldInput: { companyName,ownerName,gstNo,email,phone,address}

             })
        }
        
    const existingCompany = await Company.findOne({ gstNo });
    if(existingCompany){
        return next(new ErrorHandler("Company already exists with this GST",400));

    }
    const admin=req.admin;
    if(admin.companyId){
        return next(new ErrorHandler("You already have a company registered",400));

    }
    const company=await Company.create({companyName,ownerName,gstNo,email,phone,address,adminId: admin._id});
    if(!company){
        return next(new ErrorHandler("Unable to create Company",400));
        

    }
    
    admin.companyId=company._id;
    await admin.save();

    res.status(201).json({
        success: true,
        message: "Company registered successfully",
        company,
        admin
    });

})

]