import { createSlice } from "@reduxjs/toolkit";


const intialState={
    token:localStorage.getItem('token')?localStorage.getItem('token'):null,
    user:localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')):null,
};

const authSlice=createSlice({
    name:'auth',
    initialState:intialState,
    reducers:{
        setToken:(state,action)=>{
            state.token=action.payload;  
        },
    },
    })
    export const {setToken}=authSlice.actions;
    export default authSlice.reducer;