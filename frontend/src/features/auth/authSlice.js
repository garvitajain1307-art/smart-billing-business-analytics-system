import { createSlice } from "@reduxjs/toolkit";


const authSlice=createSlice({
    name:'auth',
    initialState:{
        admin:null,
        isAuthenticated:false,
        error:null,
        loading:false,
    },
    reducers:{
        setLoading:(state)=>{
            state.loading=true
            state.error=null

        },
        setAdmin:(state,action)=>{
            state.admin=action.payload
            state.isAuthenticated=true,
            state.loading=false,
            state.error=null
        },
        setError:(state,action)=>{
            state.error=action.payload,
            state.loading = false;
        },
        logoutAdmin:(state)=>{
            state.admin=null
            state.isAuthenticated=false,
            state.loading=false,
            state.error=null
            
        },
        clearError:(state)=>{
            state.error=null
        }
    }
})

export const {setLoading,setAdmin,setError,logoutAdmin,clearError}=authSlice.actions;
export default authSlice.reducer;