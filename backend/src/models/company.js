// import bcrypt from "bcrypt";
import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";


const companySchema=mongoose.Schema({
    companyName:{
        type:String,
        required:[true,'Company name is required'],
        trim:true,
        maxLength:[100,'Length cannot exceed 100 characters']
    },
    gstNo:{
        type:String,
        required:[true,'GST number is required'],
        uppercase:true,
        unique:true
        
    },
    // adminId:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"Admin",
    //     required:true
    // },
    address:{
        type:String,
        required:[true,'Company address is required'],
        trim:true,
        maxLength:[200,'Length cannot exceed 200 characters']

    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        maxLength:[50,'Length cannot exceed 50 characters'],
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please enter a valid email address']

    },
    
    phone:{
        type:String,
        required:[true,'Phone number is required'],
        match:[/^[0-9]{10}$/,'Please enter a valid 10-digit phone number']
    },
    
    
},
{
    timestamps:true,
})





const Company=mongoose.model('Company',companySchema);

export default Company;