import { createSlice } from "@reduxjs/toolkit";


const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    loading: false,
    error: null,
    lowStockProducts: [],
    lowStockCount: 0,
    summary: {
      revenue: {
        current: 0,
        previous: 0,
        change: 0,
      },
      profit: {
        current: 0,
        previous: 0,
        change: 0,
      },
      invoices: {
        current: 0,
        previous: 0,
        difference: 0,
      },
      customers: {
        current: 0,
        previous: 0,
        difference: 0,
      },
    },
    salesTrend: [],
    recentInvoices: [],
    topSellingProducts: [],
    paymentMethodSummary: {
      cash: 0,
      upi: 0,
      card: 0,
    },
    businessInsights: {
      topProduct: null,
      avgInvoiceValue: 0,
      totalGST: 0,
      highestSalesDate: null,
      highestSalesAmount: 0,
    },

    deadStock: [],
    customerMix: {
      repeatCustomerCount: 0,
      newCustomerCount: 0,
      repeatCustomerPercent: 0,
      newCustomerPercent: 0,
    },
    businessHealth: {
      totalProductCount: 0,
      lowStockCount2: 0,
      outOfStockCount: 0,
      lowStockPercent: 0,
      outOfStockPercent: 0,
    },

    inventoryValue: {
      purchaseValue: 0,
      sellingValue: 0,
      expectedProfit: 0,
      profitMargin: 0,
    },
    adminName:"",
  },
  reducers: {
    setDashboardLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    setDashboardError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearDashboardError: (state) => {
      state.error = null;
    },

    setLowStockProducts: (state, action) => {
      state.loading = false;
      state.lowStockProducts = action.payload.lowStockProducts;
      state.lowStockCount = action.payload.lowStockCount;
    },
    setDashboardSummary: (state, action) => {
      state.loading = false;
      state.summary = action.payload;
    },
    setSalesTrend: (state, action) => {
      state.loading = false;
      state.salesTrend = action.payload;
    },
    setRecentInvoices: (state, action) => {
      state.loading = false;
      state.recentInvoices = action.payload;
    },
    setTopSellingProducts: (state, action) => {
      state.loading = false;
      state.topSellingProducts = action.payload;
    },
    setPaymentMethodSummary: (state, action) => {
      state.loading = false;
      state.paymentMethodSummary = action.payload;
    },

    setBusinessInsights: (state, action) => {
      state.loading = false;
      state.businessInsights = action.payload;
    },

    setDeadStock: (state, action) => {
      state.loading = false;
      state.deadStock = action.payload;
    },
    setCustomerMix: (state, action) => {
      state.loading = false;
      state.customerMix = action.payload;
    },
    setBusinessHealth: (state, action) => {
      state.loading = false;
      state.businessHealth = action.payload;
    },
    setInventoryValue: (state, action) => {
      state.loading = false;
      state.inventoryValue = action.payload;
    },
    setAdminName:(state,action)=>{
        state.loading=false;
        state.adminName=action.payload;
    }
  },
});

export const {setDashboardLoading,setDashboardError,clearDashboardError,setLowStockProducts,setDashboardSummary,setSalesTrend,setRecentInvoices,setTopSellingProducts,setPaymentMethodSummary, setBusinessInsights,setDeadStock,setCustomerMix,setBusinessHealth,setInventoryValue,setAdminName}=dashboardSlice.actions;
export default dashboardSlice.reducer;