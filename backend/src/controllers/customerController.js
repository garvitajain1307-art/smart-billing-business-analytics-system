import { asyncHandler } from "../middlewares/asyncHandler.js";
import { check, validationResult } from "express-validator";
import ErrorHandler from "../middlewares/error.js";
import Customer from "../models/customer.js";


export const createCustomer=[
    check('name')
    .notEmpty()
    .withMessage('Name is required')
    ,
    check('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please enter a valid 10-digit phone number')  
    ,
    asyncHandler(async(req,res,next)=>{
        const {name,phone}=req.body;
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
        const trimmedPhone=phone.trim()
        const trimmedName=name.trim()
        const existingCustomer = await Customer.findOne({ phone:trimmedPhone, companyId });
        if(existingCustomer){
            return next(new ErrorHandler("Customer already exists", 400));
        }
        const customer = await Customer.create({
            name:trimmedName,phone:trimmedPhone,companyId
        });
        

        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            customer,
        });
    })
]



export const searchCustomer=asyncHandler(async(req,res,next)=>{
    const {query}= req.query;
    if(!query || query.trim()===""){
        return res.status(200).json({
            success: true,
            customerList: [],
        });
    }
    const search=query.trim();
    const companyId = req.admin.companyId;

    if (!companyId) {
        return next(new ErrorHandler("Please setup your company first", 400));
    }
    const customerList=await Customer.find({
        companyId,
        $or:[
            {name:{$regex:search,$options:"i"}},
            {phone:{$regex:search}}

        ]
    }).limit(8);

    res.status(200).json({
       success: true,
       customerList,
    });
});

export const getAllCustomers=asyncHandler(async(req,res,next)=>{
    const companyId=req.admin.companyId;
    if(!companyId){
        return next(new ErrorHandler("Please setup your company first", 400));

    }

    const customers=await Customer.find({companyId}).sort({name:1});
    res.status(200).json({
        success: true,
        message: "All customers fetched successfully",
        customers
    });
})
