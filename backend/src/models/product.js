// import bcrypt from "bcrypt";
import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";


const productSchema=mongoose.Schema({
    productCode:{ 
        type:String,
        required:[true,'Product Code is required'],
        trim:true,
        
        maxLength:[20,'Length cannot exceed 20 characters']
    },
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
        
        maxLength:[100,'Length cannot exceed 100 characters']
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    subCategory:{
        type:String,
        default:null,
        maxLength:[50,'Length cannot exceed 50 characters'],
        

    },
    purchasePrice:{
        type:Number,
        required:[true,'Purchasing Price is required'],
        min:[0,'Price cannot be negative']

    },
    sellingPrice:{
        type:Number,
        required:[true,'Selling Price is required'],
        min:[0,'Price cannot be negative']

    },
    quantity:{
        type:Number,
        required:true,
        min:[0,'Quantity cannot be negative']

    },
    unit:{
        type:Number
        
    },
    unitType:{
        type:String,
        enum:["lit","ml","kg","gm","pcs"],
        required:true

    },
    hsnId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"HSNMaster",
        default: null
    },
    hsnCode: {
        type: String,
        default: null,
    },

    gstRate: {
        type: Number,
        default: 0,
    },
    description:{
        type:String,
        trim:true,
        maxLength:[200,'Length cannot exceed 200 characters']
    },
    expiry:{
        type:Date
    },
    manufacturer:{
        type:String,
        trim:true,
        maxLength:[100,'Length cannot exceed 100 characters']
    },
    totalSellings:{
        type:Number,
        default:0,
        min:[0,'Total Sellings cannot be negative']
    },
    lastSoldAt: {
        type: Date,
        default: null
    },
    companyId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Company",
    required:true
    }
    

},
{
    timestamps:true,
})

//Compound Index. The combination of productCode and companyId must be unique.

productSchema.index({ productCode: 1, companyId: 1 }, { unique: true });


const Product=mongoose.model('Product',productSchema);
export default Product;