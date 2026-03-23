import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },

setAuthUser: (state, action) => {
  state.user = action.payload;
  state.isLoggedIn = true;
},

    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setToken, setAuthUser, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;