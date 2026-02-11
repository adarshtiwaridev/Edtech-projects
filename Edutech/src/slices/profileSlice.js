import { createSlice } from "@reduxjs/toolkit";


const intialState={
    user:null,
    loading:false,
    error:null,
};

const profileSlice=createSlice({
    name:'profile',
    initialState:intialState,
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload;
        },
    },
    })
    export const {setUser}=profileSlice.actions;
    export default profileSlice.reducer;