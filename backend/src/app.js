import express from 'express';
import cors from 'cors';
import {config} from "dotenv";
import authRouter from './routes/adminRoutes.js';
import companyRouter from './routes/companyRoutes.js'
import categoryRouter from './routes/categoryRoutes.js'
import productRouter from './routes/productRoutes.js'
import hsnRouter from './routes/hsnRoutes.js';
import customerRouter from './routes/customerRoutes.js'
import InvoiceRouter from './routes/invoiceRoutes.js'
import DashboardRouter from './routes/dashboardRoutes.js'
import NotificationRouter from './routes/notificationRoutes.js'
import EmailRouter from './routes/emailRouter.js'

import cookieParser from "cookie-parser";
import { errorMiddleware } from './middlewares/error.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





const app=express();


//middleware ko app.use() ke andr likhte hai
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, "../public")));



app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended:true})); 

app.use("/api/v1/admin", authRouter);
app.use("/api/v1/company",companyRouter);
app.use("/api/v1/category",categoryRouter);
app.use("/api/v1/products",productRouter);
app.use("/api/v1/hsn",hsnRouter);
app.use("/api/v1/customer",customerRouter);
app.use("/api/v1/invoice",InvoiceRouter);
app.use("/api/v1/dashboard",DashboardRouter);
app.use("/api/v1/notification",NotificationRouter);
app.use("/api/v1/email",EmailRouter);










app.use(errorMiddleware);

export default app;
