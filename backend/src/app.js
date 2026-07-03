import express from 'express';
import cors from 'cors';
import {config} from "dotenv";
import authRouter from './routes/adminRoutes.js';
import companyRouter from './routes/companyRoutes.js'
import categoryRouter from './routes/categoryRoutes.js'
import productRouter from './routes/productRoutes.js'
import hsnRouter from './routes/hsnRoutes.js';
import customerRouter from './routes/customerRoutes.js'

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
app.use("/api/v1/category",categoryRouter);
app.use("/api/v1/products",productRouter);
app.use("/api/v1/hsn",hsnRouter);
app.use("/api/v1/customer",customerRouter);




app.use(errorMiddleware);

export default app;
