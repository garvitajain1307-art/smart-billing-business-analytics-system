import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import Notification from "../models/notification.js";

export const getAllNotifications=asyncHandler(async(req,res,next)=>{
    const companyId=req.admin.companyId;
    if(!companyId){
        return next(new ErrorHandler("Pls setup your company first",400));

    }

    const notifications=await Notification.find({companyId, $or: [
    { isResolved: false },
    { isResolved: { $exists: false } }
  ]}).populate("productId","name").sort({createdAt:-1}).limit(20);
    const unreadCount = await Notification.countDocuments({
      companyId,
      isRead: false,
      
    });
    
    res.status(200).json({
        success:true,
        message:"All notifications fetched successfully",
        notifications,
        totalNotifications:notifications.length,
        unreadCount,

    })
})

export const markRead=asyncHandler(async(req,res,next)=>{
    const companyId=req.admin.companyId;
    if(!companyId){
        return next(new ErrorHandler("Pls setup your company first",400));
    }
    const notificationId=req.params.notificationId;
    if(!notificationId){
        return next(new ErrorHandler("Please enter a notification ID first",400));
    }

    const notification= await Notification.findOne({companyId,_id:notificationId});

    if(!notification){
        return next(new ErrorHandler("Notification not found",400));
    }

    notification.isRead=true;
    await notification.save();

    return res.status(200).json({
        success:true,
        message:"Notification read successfully"
    })


})

export const markAllRead=asyncHandler(async(req,res,next)=>{
    const companyId=req.admin.companyId;
    if(!companyId){
        return next(new ErrorHandler("Pls setup your company first",400));
    }
    

   await Notification.updateMany({companyId,isRead: false,},
        {$set: {isRead: true,},});


    return res.status(200).json({
        success:true,
        message:"All notifications read successfully"
    })


})