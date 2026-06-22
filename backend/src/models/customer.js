// import bcrypt from "bcrypt";
import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";


const customerSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
        maxLength:[50,'Length cannot exceed 50 characters']
    },
    
    phone:{
        type:String,
        required:[true,'Phone number is required'],
        match:[/^[0-9]{10}$/,'Please enter a valid 10-digit phone number']
    },
    
    companyId:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
            
    },
    timesServed:{
        type:Number,
        default:0,
        min:[0,'Times Served cannot be negative']
    },
    totalRevenue:{
        type:Number,
        default:0,
        min:[0,'Revenue cannot be negative']
    }

},
{
    timestamps:true,
})





const Customer=mongoose.model('Customer',customerSchema);

export default Customer;