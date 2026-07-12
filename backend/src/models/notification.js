// import bcrypt from "bcrypt";
import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";


const notificationSchema=mongoose.Schema({
     companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },
    type: {
      type: String,
      enum: ["low_stock", "out_of_stock", "dead_stock", "expiring_soon","invoice_generated","product_added","product_updated"],
      
    },
    title:{ 
        type:String,
        required:[true,'Notification title is required'],
        trim:true,
        
        maxLength:[50,'Length cannot exceed 50 characters']
    },
    message:{ 
        type:String,
        trim:true,
        maxLength:[100,'Length cannot exceed 100 characters']
    },
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        required:true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        
    },
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
        
    },

    isRead:{
        type:Boolean,
        default:false,
    },
    isResolved:{
        type:Boolean,
        default:false,
    }

},
{
    timestamps:true,
})

notificationSchema.index({ companyId: 1, createdAt: -1 });


const Notification=mongoose.model('Notification',notificationSchema);
export default Notification;