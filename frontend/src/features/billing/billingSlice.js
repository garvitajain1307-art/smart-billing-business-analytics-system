import { createSlice } from "@reduxjs/toolkit";



const billingSlice=createSlice({
    name:'billing',
    initialState:{
        cart:[],
        customer: {
            customerId: null,
            name: "",
            phone: "",
        },
        paymentMethod:"Cash",
        discount:0,
        loading:false,
        error:null,
        customerFetchError:null,
        generatedInvoice:null
        
        
    },
    reducers:{
        setBillingLoading:(state)=>{
            state.loading=true,
            state.error=null
        },
        addToCart:(state,action)=>{
            state.error = null;
            const existingProduct=state.cart.find((product)=>product._id===action.payload._id)
            if(existingProduct){
                if(existingProduct.cartQuantity<existingProduct.quantity){
                    existingProduct.cartQuantity+=1;
                    state.error=null;
                }else{
                    state.loading = false;
                    state.error = "Maximum available stock reached";
                }
            }
            else{
                state.cart.push({...action.payload,cartQuantity:1});
                state.error=null;
            }
            state.loading = false;
            

        },
        removeFromCart:(state,action)=>{
            state.cart = state.cart.filter(
                (product) => product._id !== action.payload
            );
            

            state.loading = false;
            state.error = null;
        },
        increaseQuantity:(state,action)=>{
            state.error=null;
            const product=state.cart.find((item)=>item._id===action.payload);
            if(product&& product.cartQuantity < product.quantity){
                product.cartQuantity += 1;
                 state.error=null;
            }
            else{
                state.loading = false;
                state.error = "Maximum available stock reached";
            }
            
            state.loading = false;
           
        },
        decreaseQuantity:(state,action)=>{
             const product = state.cart.find(
                (item) => item._id === action.payload
            );

            if (!product) return;
            if(product.cartQuantity==1){
                 state.cart = state.cart.filter(
                        (product) => product._id !== action.payload
                );
                state.loading = false;
                state.error = null;
            }
            else if (product.cartQuantity > 1) {
                product.cartQuantity -= 1;
            } else {
                state.cart = state.cart.filter(
                    (item) => item._id !== action.payload
                );
            }

            state.loading = false;
            state.error = null;
            
        },
        clearCart:(state)=>{
            state.cart=[];
            state.loading = false;
            state.error = null;
           
        },
        setCustomer:(state,action)=>{
            state.customer=action.payload;
            state.loading = false;
            state.error = null;
        },
        clearCustomer:(state)=>{
           state.customer = {
                customerId: null,
                name: "",
                phone: "",
             };
            state.loading = false;
            state.error = null;
           
        },
        setPaymentMethod:(state,action)=>{
            state.paymentMethod=action.payload;
            state.loading = false;
            state.error = null;
        },
        setDiscount:(state,action)=>{
            state.discount=action.payload;
            state.loading = false;
            state.error = null;
        },
        setBillingError:(state,action)=>{
           state.loading = false;
            state.error = action.payload;
        },
        clearBillingError:(state)=>{
            state.error=null;
        },
        // setCustomerFetchError:(state,action)=>{
        //    state.loading = false;
        //     state.error = "";
        // },
        // clearCustomerFetchError:(state)=>{
        //     state.error=null;
        // }
        setGeneratedInvoice: (state, action) => {
            state.generatedInvoice = action.payload;
        }
        
        
        
    }
})

export const { setBillingLoading,addToCart,removeFromCart, increaseQuantity,decreaseQuantity,clearCart,setCustomer,clearCustomer,setPaymentMethod,setDiscount,setBillingError,clearBillingError,setGeneratedInvoice}=billingSlice.actions;
export default billingSlice.reducer;