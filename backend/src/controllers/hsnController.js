import { asyncHandler } from "../middlewares/asyncHandler.js";
import HSNMaster from "../models/HSNMaster.js";

export const searchHsn=asyncHandler(async(req,res,next)=>{
    const {query}= req.query;
    if(!query || query.trim===""){
        return res.status(200).json({
            success: true,
            hsnList: [],
        });
    }

    const hsnList=await HSNMaster.find({
        $or:[
            {hsnCode:{$regex:query,$options:"i"}},
            {description:{$regex:query,$options:"i"}}

        ]
    }).limit(8);

    res.status(200).json({
       success: true,
       hsnList,
    });
});
