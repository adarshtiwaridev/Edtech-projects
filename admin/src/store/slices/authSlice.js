import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  loading: false,
  signupData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    logout(state) {
      state.token = null;
      state.signupData = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
});

export const { setToken, setLoading, setSignupData, logout } = authSlice.actions;
export default authSlice.reducer;
