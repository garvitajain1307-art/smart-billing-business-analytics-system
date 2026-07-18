import { asyncHandler } from "../middlewares/asyncHandler.js";
import { check, validationResult } from "express-validator";
import ErrorHandler from "../middlewares/error.js";
import Customer from "../models/customer.js";
import Product from "../models/product.js";
import Company from "../models/company.js";
import Counter from "../models/counter.js";
import Invoice from "../models/invoice.js";
import Notification from "../models/notification.js";
import {generatePDF} from "../utils/generatePDF.js";
import { sendEmail } from "../utils/sendEmail.js";

import { uploadPdfToCloudinary } from "../utils/uploadPdfToCloudinary.js";


export const generateInvoice=[
    
    check("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required")
    ,
    check("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    ,

    check("customerName")
    .notEmpty()
    .withMessage("Customer name is required")
    ,
    check("customerPhone")
    .notEmpty()
    .withMessage("Customer phone is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Please enter a valid 10-digit phone number"),

    

    asyncHandler(async(req,res,next)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({
                success: false,
                errors: errors.array().map(err => err.msg),
                oldInput: req.body,
                
            })
        
        }

        const companyId=req.admin.companyId;
        const adminId=req.admin._id;

        if (!companyId) {
            return next(new ErrorHandler("Please setup your company first", 400));
        }

        const company=await Company.findById(companyId);
        if (!company) {
            return next(new ErrorHandler("Company not found", 404));
        }

        const companyDetails={
            companyName:company.companyName,
            address: company.address,
            phone: company.phone,
            email: company.email,
            gstNo: company.gstNo,

        }


        //CUSTOMER DETAILS

        const { customerId, customerName, customerPhone,customerEmail, paymentMethod, items } = req.body;
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

       if (customerEmail && !emailRegex.test(customerEmail.trim())) {
         return next(
           new ErrorHandler("Please enter a valid email address", 400),
         );
       }
        let customer=null;
        //if admin selects from dropdown
        if(customerId){
            customer=await Customer.findOne({_id:customerId, companyId });
            if (!customer) {
                return next(new ErrorHandler("Customer not found", 404));
            }
        }
        //admin doesnt select from dropdown, instead enters name and phone number
        else{
            customer=await Customer.findOne({phone: customerPhone.trim(), companyId });

        }
        //creating a new customer if not found
        if (!customer) {
            customer = await Customer.create({
                name: customerName.trim(),
                phone: customerPhone.trim(),
                companyId,
                timesServed: 0,
                totalRevenue: 0,
                totalProfit:0
            });
        }


        //PRODUCT VERIFICATION AND BILL CALCULATION

        //not trusting frontend for values
        let subTotal=0;
        let gstTotal=0;
        let totalAmount=0;
        let profit=0;

        const invoiceItems=[]

        const productIds=items.map((item)=>item.productId);

        const products=await Product.find({
            //find all the products whose id is in the productIds list
            _id:{$in:productIds},
            companyId
        });

        for(const item of items){
          const product = products.find(
            (p) => p._id.toString() === item.productId,
          );

          if (!product) {
            return next(new ErrorHandler("Product not found", 404));
          }

          if (!item.quantity || item.quantity <= 0) {
            return next(
              new ErrorHandler("Quantity must be greater than 0", 400),
            );
          }
          //product.quantity=stock and item.quantity=cart quantity
          if (product.quantity < item.quantity) {
            return next(
              new ErrorHandler(`Not enough stock for ${product.name}`, 400),
            );
          }

          // Selling price includes GST.
          const lineTotal = product.sellingPrice * item.quantity;

          // GST extracted from GST-inclusive price.
          const gstAmount =(lineTotal * product.gstRate) / (100 + product.gstRate);

          // Amount without GST.
          const taxableAmount = lineTotal - gstAmount;

          // Profit calculation.
          const itemProfit =(product.sellingPrice - product.purchasePrice) * item.quantity;

          // Add to final totals.
          subTotal += taxableAmount;
          gstTotal += gstAmount;
          totalAmount += lineTotal;
          profit += itemProfit;

         

          invoiceItems.push({
            productId: product._id,
            productName: product.name,
            productCode: product.productCode,
            quantity: item.quantity,
            purchasePrice: product.purchasePrice,
            unitPrice: product.sellingPrice,
            gstRate: product.gstRate,
            gstAmount: Number(gstAmount.toFixed(2)),
            lineTotal: Number(lineTotal.toFixed(2)),
          });
        }

        //INVOICE NUMBER GENERATION

        const today=new Date();
        const dateString=today
            .toISOString() // date and time included
            .slice(0,10)  //only include YYYY-MM-DD
            .replace(/-/g,"") //YYYYMMDD

        // const counter=await Counter.findOneAndUpdate(
        //     {companyId,date:dateString},  //Find the counter document for this company and today’s date.
        //     {$inc:{lastInvoiceNo:1}}, //Increase the lastInvoiceNo field by 1.
        //     {new:true,upsert:true} //new: true → return the updated document, upsert: true → if no document exists yet for today, create one with lastInvoiceNo = 1

        // )

        const counter = await Counter.findOneAndUpdate(
          { companyId, date: dateString },
          { $inc: { lastInvoiceNo: 1 } },
          { new: true, upsert: true, setDefaultsOnInsert: true },
        );
                                                                    //later half should contain 6 digits, starting emptynos should be filled by 0
        const invoiceNo = `INV-${dateString}-${String(counter.lastInvoiceNo).padStart(6, "0")}`;

        //ADDING INVOICE TO DB
         subTotal = Number(subTotal.toFixed(2));
          gstTotal = Number(gstTotal.toFixed(2));
          totalAmount = Number(totalAmount.toFixed(2));
          profit = Number(profit.toFixed(2));
        const invoice=await Invoice.create({
            invoiceNo,
            adminId,
            companyId,
            //its not necessary that customer will always have a id,for new customer created we need customer._id
            customerId:customer._id,
            customerDetails: {
                name: customer.name,
                phone: customer.phone
            },
            companyDetails,
            items:invoiceItems,
            subTotal,
            gstTotal,
            totalAmount,
            paymentMethod,
            profit
        })

        const pdfData = await generatePDF(invoice);
        const pdfBuffer = Buffer.from(pdfData);

        const cloudinaryResult = await uploadPdfToCloudinary(
             pdfBuffer,
            invoice.invoiceNo
        );

        invoice.pdfUrl = cloudinaryResult.secure_url;
        invoice.pdfPublicId = cloudinaryResult.public_id;

        await invoice.save();
        await Notification.create({
          companyId,
          adminId: req.admin._id,
          invoiceId: invoice._id,
          type: "invoice_generated",
          title: "Invoice Generated",
          message: `Invoice ${invoice.invoiceNo} for ₹${invoice.totalAmount} was generated successfully.`,
        });

        //UPDATE STOCK

        for (const item of items) {
         const updatedProduct= await Product.findOneAndUpdate(
            { _id: item.productId, companyId },
            {
              $inc: { quantity: -item.quantity,
                    totalSellings: item.quantity,
                    

               },
               $set:{lastSoldAt: new Date()}
            },

            {new : true},
            
          );

          if(!updatedProduct){
            continue;
          }
          if(updatedProduct.quantity===0){
            const existingNotification=await Notification.findOne({ companyId,productId:updatedProduct._id,type:"out_of_stock",isResolved: false,});
            if(!existingNotification){
                await Notification.create({
                    companyId,
                    adminId: req.admin._id,
                    productId: updatedProduct._id,
                    invoiceId: invoice._id,
                    type: "out_of_stock",
                    title: "Product Out of Stock",
                    message: `${updatedProduct.name} is now out of stock`,
            });

            }
            
          }else if(updatedProduct.quantity>0 && updatedProduct.quantity<=10){
            const existingNotification=await Notification.findOne({ companyId,productId:updatedProduct._id,type:"low_stock",isResolved: false,});
            if(!existingNotification){
                await Notification.create({
                    companyId,
                    adminId: req.admin._id,
                    productId: updatedProduct._id,
                    invoiceId: invoice._id,
                    type: "low_stock",
                    title: "Low Stock Alert",
                    message: `${updatedProduct.name} has only ${updatedProduct.quantity} units left`,
            });

            }
            
          }
        }

        //UPDATE CUSTOMER DETAILS

        await Customer.findOneAndUpdate({
            _id: customer._id,
            companyId
        },
        {
            $inc: {
                timesServed: 1,
                totalRevenue: totalAmount,
                totalProfit: profit,
            }
        }
        );

        let emailSent = false;

if (customerEmail?.trim()) {
  try {
    await sendEmail({
      email: customerEmail.trim(),
      subject: `Your Invoice ${invoice.invoiceNo}`,
      html: `
        <h2>Thank you for shopping with ${invoice.companyDetails.companyName}</h2>

        <p>Hello ${invoice.customerDetails.name || "Customer"},</p>

        <p>Your invoice has been generated successfully.</p>

        <p><strong>Invoice Number:</strong> ${invoice.invoiceNo}</p>
        <p><strong>Total Amount:</strong> ₹${invoice.totalAmount}</p>
        <p><strong>Payment Method:</strong> ${invoice.paymentMethod}</p>

        <p>Please find your invoice attached to this email.</p>
      `,
      attachments: [
        {
          filename: `${invoice.invoiceNo}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    emailSent = true;
  } catch (error) {
    console.error("Invoice email failed:", {
      message: error.message,
      code: error.code,
      response: error.response,
    });
  }
}

        return res.status(201).json({
            success: true,
            message: "Invoice generated successfully",
            invoice,
            emailSent,
        });
        
        
    })
]


export const getNextInvoiceNo=asyncHandler(async(req,res,next)=>{
    const companyId = req.admin.companyId;

    if (!companyId) {
        return next(new ErrorHandler("Please setup your company first", 400));
    }

    const today = new Date();
    const dateString = today.toISOString().slice(0, 10).replace(/-/g, "");

    const counter = await Counter.findOne({
        companyId,
        date: dateString,
    });

    const nextNo = counter ? counter.lastInvoiceNo + 1 : 1;

    const invoiceNo = `INV-${dateString}-${String(nextNo).padStart(6, "0")}`;

    return res.status(200).json({
        success: true,
    
        invoiceNo,
        
    });
})

export const previewInvoice=asyncHandler(async(req,res,next)=>{
    const invoiceId=req.params.invoiceId;

    const invoice=await Invoice.findById({_id:invoiceId,companyId:req.admin.companyId});
    if(!invoice){
        return next(new ErrorHandler("Invoice not found", 404));
    }
    return res.render("invoice", {
        success: true,

        invoice,
  });

})

export const downloadInvoicePDF = asyncHandler(async (req, res, next) => {

    const invoice = await Invoice.findOne({
        _id: req.params.invoiceId,
        companyId: req.admin.companyId,
    });

    if (!invoice) {
        return next(new ErrorHandler("Invoice not found", 404));
    }

    const pdfBuffer = await generatePDF(invoice);

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${invoice.invoiceNo}.pdf"`,
    });

    res.send(pdfBuffer);

});

export const getAllInvoices = asyncHandler(async (req, res, next) => {
    const companyId=req.admin.companyId;
        if(!companyId){
            return next(new ErrorHandler("Please setup your company first", 400));
    
        }
    
        const invoices=await Invoice.find({companyId}).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "All invoices fetched successfully",
            invoices
        });

})

export const deleteInvoice =asyncHandler(async(req,res,next)=>{
    const companyId=req.admin.companyId;
    if(!companyId){
        return next(new ErrorHandler("Please setup your company first", 400));
    }

    const invoiceId=req.params.invoiceId;
    if(!invoiceId){
        return next(new ErrorHandler("Pls eneter an invoice id first", 400));

    }
    const invoice=Invoice.findOne({_id:invoiceId,companyId:companyId});
    if(!invoice){
        return next(new ErrorHandler("Invoice not found", 400));

    }
    await invoice.deleteOne();

    res.status(200).json({
        success:true,
         message: "Invoice deleted successfully",
    })
})