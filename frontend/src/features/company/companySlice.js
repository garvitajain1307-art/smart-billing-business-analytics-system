import { createSlice } from "@reduxjs/toolkit";


const companySlice=createSlice({
    name:'company',
    initialState:{
        company:null,
        error:null,
        loading:false,
    },
    reducers:{
        setCompanyLoading:(state)=>{
            state.loading=true;
            state.error=null;

        },
        setCompany:(state,action)=>{
            state.company=action.payload;
            state.loading=false;
            state.error=null;
        },
        setCompanyError:(state,action)=>{
            state.error=action.payload;
            state.loading = false;
        },
        clearCompanyError:(state)=>{
            state.error=null;
        },
        clearCompany:(state)=>{
            state.companyr=null;
            state.loading=false;
            state.error=null;
        }
    }
})

export const {setCompanyLoading,setCompany,setCompanyError,clearCompanyError,clearCompany}=companySlice.actions;
export default companySlice.reducer;