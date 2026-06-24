import express from 'express';
import cors from 'cors';
import {config} from "dotenv";
import authRouter from './routes/adminRoutes.js';
import companyRouter from './routes/companyRoutes.js'

import cookieParser from "cookie-parser";
import { errorMiddleware } from './middlewares/error.js';

const app=express();


//middleware ko app.use() ke andr likhte hai
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true
}));



app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended:true})); 

app.use("/api/v1/admin", authRouter);
app.use("/api/v1/company",companyRouter);


app.use(errorMiddleware);

export default app;
