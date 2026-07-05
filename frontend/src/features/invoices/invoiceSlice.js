import { createSlice } from "@reduxjs/toolkit";


const invoiceSlice=createSlice({
    name:'invoice',
    initialState:{
        invoices:[],
        selectedInvoice:null,
        loading:false,
        error:null,
        success:false,
        
        
    },

    reducers:{
        setInvoiceLoading:(state)=>{
            state.loading=true;
            state.error=null;
            state.success=false;

        },
        setInvoices:(state,action)=>{
            state.invoices=action.payload;
            state.loading=false;
            state.error=null;
            state.success=false;

        },
        setSelectedInvoice:(state,action)=>{
            state.selectedInvoice=action.payload;
            
        },

        addInvoice:(state,action)=>{
            state.invoices.unshift(action.payload);
            state.loading = false;
            state.error = null;
            state.success = true;
        },
        
        
        removeInvoiceFromState: (state, action) => {
            state.invoices = state.invoices.filter(
                (invoice) => invoice._id !== action.payload
            );
            if (state.selectedInvoice &&state.selectedInvoice._id === action.payload) {
                state.selectedInvoice = null;
            }

            state.loading = false;
            state.error = null;
            state.success = true;
        },

        setInvoiceError:(state,action)=>{
            state.error=action.payload;
            state.loading = false;
            state.success=false;
        },
        
        clearInvoiceError:(state)=>{
            state.error=null;
        },
        
        clearInvoiceSuccess: (state) => {
            state.success = false;
        },

        clearSelectedInvoice: (state) => {
            state.selectedInvoice = null;
        },
        stopInvoiceLoading: (state) => {
            state.loading = false;
        }
        
    }
    
    
    
})

export const {setInvoiceLoading,setInvoices,setSelectedInvoice,addInvoice,deleteInvoice,setInvoiceError,clearInvoiceError,clearInvoiceSuccess,clearSelectedInvoice,stopInvoiceLoading}=invoiceSlice.actions;
export default invoiceSlice.reducer;