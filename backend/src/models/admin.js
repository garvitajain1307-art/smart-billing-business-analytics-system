// import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const adminSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
        maxLength:[30,'Length cannot exceed 30 characters']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        maxLength:[50,'Length cannot exceed 50 characters'],
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please enter a valid email address']

    },
    password:{
        type:String,
        required:[true,'Password is required'],
        select:false,
        minLength:[8,'Password must be of atleast 8 characters']

    },
    phone:{
        type:String,
        required:[true,'Phone number is required'],
        match:[/^[0-9]{10}$/,'Please enter a valid 10-digit phone number']
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        default: null,
    },

},
{
    timestamps:true,
})

adminSchema.methods.generateToken=function(){
    return jwt.sign({id:this._id },process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    }
    )
}





const Admin=mongoose.model('Admin',adminSchema);

export default Admin;