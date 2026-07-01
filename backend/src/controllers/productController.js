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

export const getAllProducts=asyncHandler(async(req,res,next)=>{
    const companyId=req.admin.companyId;
    if(!companyId){
        return next(new ErrorHandler("Please setup your company first", 400));

    }

    const products=await Product.find({companyId}).populate("categoryId", "name").sort({name:1});
    res.status(200).json({
        success: true,
        message: "All products fetched successfully",
        products
    });
})

export const getProduct=asyncHandler(async(req,res,next)=>{
    
    const companyId=req.admin.companyId;

    if (!companyId) {
        return next(new ErrorHandler("Please setup your company first", 400));
    }

    const productId=req.params.productId;
    if(!productId){
        return next(new ErrorHandler("Please enter a productId first", 400));

    }
        
    const product=await Product.findOne({_id:productId,companyId}).populate("categoryId").populate("hsnId");
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

        
    res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        product
    });
})

export const deleteProduct=asyncHandler(async(req,res,next)=>{
    
    const companyId=req.admin.companyId;

    if (!companyId) {
        return next(new ErrorHandler("Please setup your company first", 400));
    }

    const productId=req.params.productId;
    if(!productId){
        return next(new ErrorHandler("Please enter a productId first", 400));

    }
        
    const product=await Product.findOne({_id:productId,companyId});
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    await product.deleteOne()

        
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        
    });
})

export const updateProduct = asyncHandler(async (req, res, next) => {
    const companyId = req.admin.companyId;

    if (!companyId) {
        return next(new ErrorHandler("Please setup your company first", 400));
    }

    const productId = req.params.productId;

    if (!productId) {
        return next(new ErrorHandler("Please enter a productId first", 400));
    }

    const product = await Product.findOne({ _id: productId, companyId });

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const {
        productCode,
        name,
        categoryId,
        subCategory,
        purchasePrice,
        sellingPrice,
        quantity,
        unit,
        unitType,
        hsnCode,
        description,
        expiry,
        manufacturer,
    } = req.body;

    const finalPurchasePrice = purchasePrice !== undefined ? Number(purchasePrice) : product.purchasePrice;
    const finalSellingPrice = sellingPrice !== undefined ? Number(sellingPrice) : product.sellingPrice;

    if (finalSellingPrice < finalPurchasePrice) {
        return next(new ErrorHandler("Selling Price must be greater than or equal to Purchase Price", 400));
    }

    if (productCode && productCode !== product.productCode) {
        const existingProduct = await Product.findOne({
            productCode,
            companyId,
            _id: { $ne: productId },
        });

        if (existingProduct) {
            return next(new ErrorHandler("Product with this Product Code already exists", 400));
        }

        product.productCode = productCode;
    }

    if (categoryId && categoryId !== product.categoryId.toString()) {
        const category = await Category.findOne({ _id: categoryId, companyId });

        if (!category) {
            return next(new ErrorHandler("Invalid Category Selected", 400));
        }

        product.categoryId = categoryId;
    }

    if (hsnCode && hsnCode !== product.hsnCode) {
        const hsn = await HSNMaster.findOne({ hsnCode: hsnCode.trim() });

        if (!hsn) {
            return next(new ErrorHandler("Invalid HSN code", 400));
        }

        product.hsnId = hsn._id;
        product.hsnCode = hsn.hsnCode;
        product.gstRate = hsn.gstRate;
    }

    if (name !== undefined) product.name = name;
    if (subCategory !== undefined) product.subCategory = subCategory;
    if (purchasePrice !== undefined) product.purchasePrice = purchasePrice;
    if (sellingPrice !== undefined) product.sellingPrice = sellingPrice;
    if (quantity !== undefined) product.quantity = quantity;
    if (unit !== undefined) product.unit = unit;
    if (unitType !== undefined) product.unitType = unitType;
    if (description !== undefined) product.description = description;
    if (expiry !== undefined) product.expiry = expiry;
    if (manufacturer !== undefined) product.manufacturer = manufacturer;

    await product.save();

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product,
    });
});

export const restockProduct = [
    check("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isNumeric()
        .withMessage("Quantity must be a number")
        .custom((value) => {
            if (Number(value) <= 0) {
                throw new Error("Quantity must be greater than 0 for restocking");
            }
            return true;
        }),

    asyncHandler(async (req, res, next) => {

        const companyId = req.admin.companyId;

        if (!companyId) {
            return next(new ErrorHandler("Please setup your company first", 400));
        }

        const { quantity } = req.body;
        const productId = req.params.productId;

        if (!productId) {
            return next(new ErrorHandler("Please enter a productId first", 400));
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array().map(err => err.msg),
                oldInput: { quantity }
            });
        }

        const product = await Product.findOne({
            _id: productId,
            companyId
        });

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        const addedQuantity = Number(quantity);

        product.quantity += addedQuantity;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product restocked successfully",
            product
        });
    })
];