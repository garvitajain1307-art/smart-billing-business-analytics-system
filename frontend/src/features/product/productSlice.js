import { createSlice } from "@reduxjs/toolkit";
import { setDeadStock } from "../dashboard/dashboardSlice";


const productSlice=createSlice({
    name:'product',
    initialState:{
        products:[],
        categories:[],
        selectedProduct:null,
        loading:false,
        error:null,
        success:false,
        categoryError:null,
        restockError:null,
        topSellingProducts:[],
        slowMovingProducts:[],
        deadStockProducts:[],
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
        setRestockError:(state,action)=>{
            state.restockError=action.payload;
            state.loading = false;
            state.success=false;
        },
        clearProductError:(state)=>{
            state.error=null;
        },
        clearCategoryError:(state)=>{
            state.categoryError=null;
        },
        clearRestockError:(state)=>{
            state.restockError=null;
        },
        clearProductSuccess: (state) => {
            state.success = false;
        },

        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        },
        stopProductLoading: (state) => {
            state.loading = false;
        },
        setTopSellingProducts:(state,action)=>{
            state.loading=false;
            state.topSellingProducts=action.payload
        },
        setSlowMovingProducts:(state,action)=>{
            state.loading=false;
            state.slowMovingProducts=action.payload
        },
        setDeadStockProducts:(state,action)=>{
            state.loading=false;
            state.deadStockProducts=action.payload

        }
        
    }
})

export const {setProductLoading,setProducts,setCategories,setSelectedProduct,addProduct,addCategory,updateProduct,deleteProduct,setProductError,clearProductError,clearProductSuccess,clearSelectedProduct,stopProductLoading,setCategoryError,clearCategoryError,setRestockError,clearRestockError,setTopSellingProducts,setSlowMovingProducts,setDeadStockProducts}=productSlice.actions;
export default productSlice.reducer;