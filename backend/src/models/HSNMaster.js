// import bcrypt from "bcrypt";
import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";


const HSNMasterSchema=mongoose.Schema({
    hsnCode:{
        type:String,
        required:[true,'HSN Code is required'],
        trim:true,
        unique:true
    },
    description:{
        type:String,
        trim:true,
        maxLength:[200,'Length cannot exceed 200 characters']
    },

    gstRate:{
        type:Number,
        required:[true,'GST Rate is required']
    },
    keywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

},
{
    timestamps:true,
})


const HSNMaster=mongoose.model('HSNMaster',HSNMasterSchema);
export default HSNMaster;