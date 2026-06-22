import { config } from "dotenv";
config();

import { connectDb } from "./src/config/db.js";
import app from "./src/app.js";

connectDb()


const PORT=process.env.PORT || 4000;
const server=app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})



process.on("unhandledRejection",(err)=>{
    console.error(`UnhandledRejection:${err.message} `);
    server.close(()=>process.exit(1));

}); 



process.on("uncaughtException",(err)=>{
    console.error(`UncaughtException:${err.message} `);
    process.exit(1);

}); //server ekdum se hi bnd ho jaaega, concurrent servers ka wait ni krega to complete

export default server;