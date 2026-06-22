import express from 'express';
import cors from 'cors';
import {config} from "dotenv";

import cookieParser from "cookie-parser";

const app=express();


//middleware ko app.use() ke andr likhte hai
app.use(cors({
    origin:[process.env.FRONTEND_URL], //all the url written here can access backend
    methods:["GET","POST","PUT","DELETE"],
    credentials:true 
}));



app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended:true})); 




export default app;
