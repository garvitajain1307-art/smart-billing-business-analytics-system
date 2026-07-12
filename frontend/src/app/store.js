import {configureStore} from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice"
import companyReducer from "../features/company/companySlice"
import productReducer from "../features/product/productSlice"
import billingReducer from "../features/billing/billingSlice"
import invoiceReducer from "../features/invoices/invoiceSlice"
import customerReducer from "../features/customers/customerSlice"
import dashboardReducer from "../features/dashboard/dashboardSlice"
import notificationReducer from "../features/notification/notificationSlice"


export const store=configureStore({
    reducer:{
        auth:authReducer,
        company:companyReducer,
        product:productReducer,
        billing:billingReducer,
        invoice:invoiceReducer,
        customer:customerReducer,
        dashboard:dashboardReducer,
        notification:notificationReducer,

    }
})