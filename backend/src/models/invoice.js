// import bcrypt from "bcrypt";
import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";


const invoiceSchema=mongoose.Schema({
    invoiceNo:{ 
        type:String,
        required:[true,'Invoice No is required'],
        trim:true,
        unique:true,
        maxLength:[50,'Length cannot exceed 50 characters']
    },
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        required:true
    },
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customer",
        required:true
    },
    customerDetails: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },

    companyDetails: {
      companyName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      gstNo: {
        type: String,
        required: true,
      },
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        productName: {
          type: String,
          required: true,
        },

        productCode: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        purchasePrice: {
            type: Number,
            required: true
        },

        unitPrice: {
          type: Number,
          required: true,
        },

        gstRate: {
          type: Number,
          required: true,
        },

        gstAmount: {
          type: Number,
          required: true,
        },

        finalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    subTotal:{
        type:Number,
        required:[true,'SubTotal is required'],
        

    },
    gstTotal:{
        
        type:Number,
        required:[true,'GST Total is required'],

    },
    totalAmount:{
        
        type:Number,
        required:[true,'Total Amount is required'],

    },
    
    paymentMethod:{
        type:String,
        enum:["cash","upi","credit card","debit card","net banking"],
        default:"cash"
    },
    profit:{
        
        type:Number,
        required:[true,'Profit is required'],

    },
    
    
    
    

},
{
    timestamps:true,
})


const Invoice=mongoose.model('Invoice',invoiceSchema);
export default Invoice;