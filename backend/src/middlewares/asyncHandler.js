export const asyncHandler=(theFunction)=>(req,res,next)=>{
    return Promise.resolve(theFunction(req,res,next)).catch(next);
    //catch passes the error to error middleware used in app.js
    //now no need of writing repeated try catch blocks in every controller

}