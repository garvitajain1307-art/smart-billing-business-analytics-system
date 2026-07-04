// import bcrypt from "bcrypt";
import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";


const counterSchema=mongoose.Schema({
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },
    date:{
        type:String,
        required:true
    },
    lastInvoiceNo: {
        type: Number,
        default: 0,
    },
    
},
{
    timestamps:true,
})

counterSchema.index({ companyId: 1, date: 1 }, { unique: true });





const Counter=mongoose.model('Counter',counterSchema);

export default Counter;