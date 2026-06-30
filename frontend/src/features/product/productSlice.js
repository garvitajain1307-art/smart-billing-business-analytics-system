import { createSlice } from "@reduxjs/toolkit";


const productSlice=createSlice({
    name:'product',
    initialState:{
        products:[],
        categories:[],
        selectedProduct:null,
        loading:false,
        error:null,
        success:false,
        categoryError:null
    },
    reducers:{
        setProductLoading:(state)=>{
            state.loading=true;
            state.error=null;
            state.success=false;

        },
        setProducts:(state,action)=>{
            state.products=action.payload;
            state.loading=false;
            state.error=null;
            state.success=false;

        },
        setCategories:(state,action)=>{
            state.categories=action.payload;
            state.loading=false;
            state.error=null;
            state.success=false;

        },
        setSelectedProduct:(state,action)=>{
            state.selectedProduct=action.payload;
            
        },

        addProduct:(state,action)=>{
            state.products.push(action.payload);
            state.loading = false;
            state.error = null;
            state.success = true;
        },
        addCategory:(state,action)=>{
            state.categories.push(action.payload);
            state.loading = false;
            state.error = null;
            state.success = true;

        },
        updateProduct: (state, action) => {
            const updatedProduct = action.payload;

            state.products = state.products.map((product) =>
                product._id === updatedProduct._id ? updatedProduct : product
            );

            state.selectedProduct = updatedProduct;
            state.loading = false;
            state.error = null;
            state.success = true;
        },
        
        deleteProduct: (state, action) => {
            state.products = state.products.filter(
                (product) => product._id !== action.payload
            );
            if (state.selectedProduct &&state.selectedProduct._id === action.payload) {
                state.selectedProduct = null;
            }

            state.loading = false;
            state.error = null;
            state.success = true;
        },

        setProductError:(state,action)=>{
            state.error=action.payload;
            state.loading = false;
            state.success=false;
        },
        setCategoryError:(state,action)=>{
            state.categoryError=action.payload;
            state.loading = false;
            state.success=false;
        },
        clearProductError:(state)=>{
            state.error=null;
        },
        clearCategoryError:(state)=>{
            state.categoryError=null;
        },
        
        clearProductSuccess: (state) => {
            state.success = false;
        },

        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        },
        stopProductLoading: (state) => {
            state.loading = false;
        }
        
    }
})

export const {setProductLoading,setProducts,setCategories,setSelectedProduct,addProduct,addCategory,updateProduct,deleteProduct,setProductError,clearProductError,clearProductSuccess,clearSelectedProduct,stopProductLoading,setCategoryError,clearCategoryError}=productSlice.actions;
export default productSlice.reducer;