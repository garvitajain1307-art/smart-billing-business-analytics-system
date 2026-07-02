import { createSlice } from "@reduxjs/toolkit";


const billingSlice=createSlice({
    name:'billing',
    initialState:{
        cart:[],
        customer:null,
        paymentMethod:"Cash",
        discount:0,
        loading:false,
        error:null,
        
        
    },
    reducers:{
        setBillingLoading:(state)=>{
            state.loading=true,
            state.error=null
        },
        addToCart:(state,action)=>{
            const existingProduct=state.cart.find((product)=>product._id===action.payload._id)
            if(existingProduct){
                if(existingProduct.CartQuantity<existingProduct.quantity){
                    existingProduct.CartQuantity+=1;
                }
            }
            else{
                state.cart.push({...action.payload,CartQuantity:1});
            }
            state.loading = false;
            state.error = null;

        },
        removeFromCart:(state,action)=>{
            state.cart = state.cart.filter(
                (product) => product._id !== action.payload
            );
            

            state.loading = false;
            state.error = null;
        },
        increaseQuantity:(state,action)=>{
            const product=state.cart.find((item)=>item._id===action.payload);
            if(product&& product.cartQuantity < product.quantity){
                product.cartQuantity += 1;
            }
            state.loading = false;
            state.error = null;

        },
        decreaseQuantity:(state,action)=>{
             const product = state.cart.find(
                (item) => item._id === action.payload
            );

            if (!product) return;

            if (product.cartQuantity > 1) {
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
            state.customer=null;
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
        }
        
        
    }
})

export const { setBillingLoading,addToCart,removeFromCart, increaseQuantity,decreaseQuantity,clearCart,setCustomer,clearCustomer,setPaymentMethod,setDiscount,setBillingError,clearBillingError,}=billingSlice.actions;
export default billingSlice.reducer;