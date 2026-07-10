import { createSlice } from "@reduxjs/toolkit";


const dashboardSlice=createSlice({
    name:'dahboard',
    initialState:{
       
        loading:false,
        error:null,
        lowStockProducts:[],
        lowStockCount:0,
        summary:{
            revenue:{
                current:0,
                previous:0,
                change:0,
            },
            profit:{
                current:0,
                previous:0,
                change:0,
            },
            invoices:{
                current:0,
                previous:0,
                difference:0
            },
            customers:{
                current:0,
                previous:0,
                difference:0
            }

        },
        salesTrend:[],
        recentInvoices:[],
        topSellingProducts:[],
        
    },
    reducers:{
        setDashboardLoading:(state)=>{
            state.loading=true;
            state.error=null;
            

        },
        

        setDashboardError:(state,action)=>{
            state.error=action.payload;
            state.loading = false;
           
        },
        
        clearDashboardError:(state)=>{
            state.error=null;
        },

        setLowStockProducts:(state,action)=>{
            state.loading = false;
            state.lowStockProducts = action.payload.lowStockProducts;
            state.lowStockCount = action.payload.lowStockCount;
            
        },
        setDashboardSummary: (state, action) => {
            state.loading = false;
            state.summary = action.payload;
        },
        setSalesTrend:(state,action)=>{
            state.loading = false;
            state.salesTrend = action.payload;

        },
        setRecentInvoices:(state,action)=>{
            state.loading=false;
            state.recentInvoices=action.payload
        },
        setTopSellingProducts:(state,action)=>{
            state.loading=false;
            state.topSellingProducts=action.payload
        }
       
        
        
    }
})

export const {setDashboardLoading,setDashboardError,clearDashboardError,setLowStockProducts,setDashboardSummary,setSalesTrend,setRecentInvoices,setTopSellingProducts}=dashboardSlice.actions;
export default dashboardSlice.reducer;