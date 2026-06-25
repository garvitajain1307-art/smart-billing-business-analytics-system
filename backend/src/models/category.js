// import bcrypt from "bcrypt";
import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";


const categorySchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
        maxLength:[30,'Length cannot exceed 30 characters'],
        
    },
    description:{
        type:String,
        trim:true,
        default:null,
        maxLength:[200,'Length cannot exceed 200 characters']
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    
},
{
    timestamps:true,
})

categorySchema.index({ name: 1, companyId: 1 }, { unique: true });





const Category=mongoose.model('Category',categorySchema);

export default Category;