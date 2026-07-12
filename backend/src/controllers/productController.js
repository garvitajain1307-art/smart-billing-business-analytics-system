import { asyncHandler } from "../middlewares/asyncHandler.js";
import { check, validationResult } from "express-validator";
import ErrorHandler from "../middlewares/error.js";
import Category from "../models/category.js";
import Product from "../models/product.js";
import HSNMaster from "../models/HSNMaster.js";
import Notification from "../models/notification.js";

export const addProduct = [
  check("productCode").notEmpty().withMessage("Product Code is required"),

  check("name").notEmpty().withMessage("Product Name is required"),
  check("categoryId").notEmpty().withMessage("Category is required"),
  check("purchasePrice").notEmpty().withMessage("Purchasing Cost is required"),

  check("sellingPrice").notEmpty().withMessage("Selling Cost is required"),
  check("quantity").notEmpty().withMessage("Quantity is required"),
  check("unitType").notEmpty().withMessage("Unit Type is required"),
  check("hsnCode").notEmpty().withMessage("HSN Code is required"),

  asyncHandler(async (req, res, next) => {
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
    const companyId = req.admin.companyId;

    if (!companyId) {
      return next(new ErrorHandler("Please setup your company first", 400));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array().map((err) => err.msg),
        oldInput: req.body,
      });
    }
    if (Number(sellingPrice) < Number(purchasePrice)) {
      return next(
        new ErrorHandler(
          "Selling Price must be greater than or equal to Purchase Price",
          400,
        ),
      );
    }
    const existingProduct = await Product.findOne({ productCode, companyId });

    if (existingProduct) {
      return next(
        new ErrorHandler("Product with this Product Code already exists", 400),
      );
    }

    const category = await Category.findOne({ _id: categoryId, companyId });
    if (!category) {
      return next(new ErrorHandler("Invalid Category Selected", 400));
    }

    let finalHsnId = null;
    let finalHsnCode = null;
    let finalGstRate = 0;

    if (hsnCode) {
      const hsn = await HSNMaster.findOne({ hsnCode: hsnCode.trim() });
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

    await Notification.create({
      companyId,
      adminId: req.admin._id,
      productId: product._id,
      type: "product_added",
      title: "Product Added",
      message: `${product.name} ${product.unit} ${product.unitType} was added successfully.`,
    });

    if (product.quantity === 0) {
      const existingNotification = await Notification.findOne({
        companyId,
        productId: product._id,
        type: "out_of_stock",
        isResolved: false,
      });

      if (!existingNotification) {
        await Notification.create({
          companyId,
          adminId: req.admin._id,
          productId: product._id,
          type: "out_of_stock",
          title: "Product Out of Stock",
          message: `${product.name} is currently out of stock`,
        });
      }
    } else if (product.quantity > 0 && product.quantity <= 10) {
      const existingNotification = await Notification.findOne({
        companyId,
        productId: product._id,
        type: "low_stock",
        isResolved: false,
      });

      if (!existingNotification) {
        await Notification.create({
          companyId,
          adminId: req.admin._id,
          productId: product._id,
          type: "low_stock",
          title: "Low Stock Alert",
          message: `${product.name} has only ${product.quantity} units in stock`,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  }),
];

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const companyId = req.admin.companyId;
  if (!companyId) {
    return next(new ErrorHandler("Please setup your company first", 400));
  }

  const products = await Product.find({ companyId })
    .populate("categoryId", "name")
    .sort({ name: 1 });
  res.status(200).json({
    success: true,
    message: "All products fetched successfully",
    products,
  });
});

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

    await Notification.create({
      companyId,
      adminId: req.admin._id,
      productId: product._id,
      type: "product_updated",
      title: "Product Updated",
      message: `${product.name} ${product.unit} ${product.unitType} was updated successfully.`,
    });

    const currentQuantity = Number(product.quantity);

// Product is sufficiently stocked
if (currentQuantity > 10) {
  await Notification.updateMany(
    {
      companyId,
      productId: product._id,
      type: { $in: ["low_stock", "out_of_stock"] },
      isResolved: false,
    },
    {
      $set: { isResolved: true },
    },
  );
}

// Product is low stock
else if (currentQuantity > 0 && currentQuantity <= 10) {
  // Resolve any old out-of-stock notification
  await Notification.updateMany(
    {
      companyId,
      productId: product._id,
      type: "out_of_stock",
      isResolved: false,
    },
    {
      $set: { isResolved: true },
    },
  );

  // Check whether an active low-stock notification already exists
  const existingLowStockNotification = await Notification.findOne({
    companyId,
    productId: product._id,
    type: "low_stock",
    isResolved: false,
  });

  if (!existingLowStockNotification) {
    await Notification.create({
      companyId,
      adminId: req.admin._id,
      productId: product._id,
      type: "low_stock",
      title: "Low Stock Alert",
      message: `${product.name} has only ${currentQuantity} ${product.unitType} remaining.`,
      isRead: false,
      isResolved: false,
    });
  }
}

// Product is out of stock
else if (currentQuantity === 0) {
  // Resolve any old low-stock notification
  await Notification.updateMany(
    {
      companyId,
      productId: product._id,
      type: "low_stock",
      isResolved: false,
    },
    {
      $set: { isResolved: true },
    },
  );

  // Check whether an active out-of-stock notification already exists
  const existingOutOfStockNotification = await Notification.findOne({
    companyId,
    productId: product._id,
    type: "out_of_stock",
    isResolved: false,
  });

  if (!existingOutOfStockNotification) {
    await Notification.create({
      companyId,
      adminId: req.admin._id,
      productId: product._id,
      type: "out_of_stock",
      title: "Out of Stock Alert",
      message: `${product.name} is now out of stock.`,
      isRead: false,
      isResolved: false,
    });
  }
}

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

        if(product.quantity>10){
           await Notification.updateMany(
             {
               companyId,
               productId: product._id,
               type: { $in: ["low_stock", "out_of_stock"] },
               isResolved: false,
             },
             {
               $set: { isResolved: true },
             },
           );
        }
        else if(product.quantity>0 && product.quantity<=10){
           await Notification.updateMany(
             {
               companyId,
               productId: product._id,
               type: "out_of_stock",
               isResolved: false,
             },
             {
               $set: { isResolved: true },
             },
           );

        }
        
        res.status(200).json({
            success: true,
            message: "Product restocked successfully",
            product
        });
    })
];

export const getLowStockProducts=asyncHandler(async(req,res,next)=>{
    const companyId=req.admin.companyId;
    if(!companyId){
        return next(new ErrorHandler("Please setup your company first", 400));

    }

    const products=await Product.find({companyId}).populate("categoryId", "name").sort({quantity:1});
    const lowStockProducts = products.filter(
            (product) => product.quantity > 0 && product.quantity <= 10
    );
    res.status(200).json({
        success: true,
        message: "Low stock products fetched successfully",
        lowStockProducts,
        lowStockCount:lowStockProducts.length
    });

})

export const getTopSellingProducts=asyncHandler(async(req,res,next)=>{
    const companyId=req.admin.companyId;
        if(!companyId){
            return next(new ErrorHandler("Please setup your company first", 400));
    
        }
    
        const topSellingProducts=await Product.find({companyId,totalSellings:{
             $gt: 20,
            

        }}).sort({totalSellings: -1 }).limit(4);
        res.status(200).json({
            success: true,
            message: "Top Selling Products fetched successfully",
            topSellingProducts
        });


})

export const getSlowMovingProducts=asyncHandler(async(req,res,next)=>{
    const companyId=req.admin.companyId;
    if(!companyId){
        return next(new ErrorHandler("Please setup your company first", 400));
    
    }
    const slowMovingProducts = await Product.find({
        companyId,totalSellings: {
            $gt: 0,
            $lt: 20,},
    }).sort({ totalSellings: 1 });

    res.status(200).json({
        success: true,
        slowMovingProducts,
        
    });

})