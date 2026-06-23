import ErrorHandler from "../middlewares/error.js";
import Admin from "../models/admin.js";
import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import bcrypt from "bcrypt";
import { check, validationResult } from "express-validator";
import { generateToken } from "../utils/generateToken.js";



export const registerAdmin=[
    check('name')
    .notEmpty()
    .withMessage('Name is required')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters')
    ,
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()

    ,
    check('phone')
    .notEmpty()
    .withMessage('Phone Number is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Not a valid Number')

    ,
    check('password')
    .isLength({min:8})
    .withMessage("Password must be atleast 8 characters long")
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage("Password must contain atleast one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain atleast one digit")
    .matches(/[!@#$%^&*(),.?":{}|<>/]/)
    .withMessage("Password must contain atleast one special character")
    .trim()
    ,
    check('confirmPassword')
             .trim()
             .custom((value,{req})=>{
                if(value!==req.body.password){
                        throw new Error('Passwords do not match')

                }
                return true
                })
    ,
    
    asyncHandler(async(req,res,next)=>{
        const {name,email,phone,password}=req.body;
        
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array().map(err=>err.msg),
                oldInput:{name,email}
            });
        }

        const existingUser= await Admin.findOne({email});
        if(existingUser){
            return next(new ErrorHandler("User already exists",400));
        }

        const hashedPassword=await bcrypt.hash(password,12);
        const admin=await Admin.create({name,email,password:hashedPassword,phone});

        if(!admin){
            return next(new ErrorHandler("Unable to create User",400));
        }

        generateToken(admin,201,"User registered successfully",res);



    })

]