export const generateToken=(admin,statusCode,message,res)=>{
    const token=admin.generateToken();

    res.status(statusCode).cookie("token",token, {
        expires:new Date(Date.now()+ process.env.COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true
    }).json({
        success:true,
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            companyId: admin.companyId,
  },
        message,
        token,
    });

}