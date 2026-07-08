import { createSlice } from "@reduxjs/toolkit";


const customerSlice=createSlice({
    name:'customer',
    initialState:{
        customers:[],
        selectedCustomer:null,
        loading:false,
        error:null,
        success:false,
        
    },
    reducers:{
        setCustomerLoading:(state)=>{
            state.loading=true;
            state.error=null;
            state.success=false;

        },
        setCustomers:(state,action)=>{
            state.customers=action.payload;
            state.loading=false;
            state.error=null;
            state.success=false;

        },
        
        setSelectedCustomer:(state,action)=>{
            state.selectedCustomer=action.payload;
            
        },

        addCustomer:(state,action)=>{
            state.customers.push(action.payload);
            state.loading = false;
            state.error = null;
            state.success = true;
        },
        
        updateCustomer: (state, action) => {
            const updatedCustomer = action.payload;

            state.customers = state.customers.map((customer) =>
                customer._id === updatedCustomer._id ? updatedCustomer : customer
            );

            state.selectedCustomer = updatedCustomer;
            state.loading = false;
            state.error = null;
            state.success = true;
        },
        
        deleteCustomer: (state, action) => {
            state.customers = state.customers.filter(
                (customer) => customer._id !== action.payload
            );
            if (state.selectedCustomer &&state.selectedCustomer._id === action.payload) {
                state.selectedCustomer = null;
            }

            state.loading = false;
            state.error = null;
            state.success = true;
        },

        setCustomerError:(state,action)=>{
            state.error=action.payload;
            state.loading = false;
            state.success=false;
        },
        
        
        clearCustomerError:(state)=>{
            state.error=null;
        },
        
        clearCustomerSuccess: (state) => {
            state.success = false;
        },

        clearSelectedCustomer: (state) => {
            state.selectedProduct = null;
        },
        stopCustomerLoading: (state) => {
            state.loading = false;
        }
        
    }
})

export const {setCustomerLoading,setCustomers,setSelectedCustomer,addCustomer,updateCustomer,deleteCustomer,setCustomerError,clearCustomerError,clearCustomerSuccess,clearSelectedCustomer,stopCustomerLoading}=customerSlice.actions;
export default customerSlice.reducer;