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
        setUser:(state,action)=>{
            state.user=action.payload;  
        },
        logout:(state)=>{
            state.token=null;
            state.user=null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
    })
    export const {setToken, setUser, logout}=authSlice.actions;
    export default authSlice.reducer;