import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setAuthUser } from "./authSlice";
import apiClient from "../services/apiClient";

// thunk to fetch the currently logged in user's profile from backend
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await apiClient.get("/profiles/getUserDetails");
      const profileUser = res.data?.data;
      if (profileUser) {
        dispatch(setAuthUser(profileUser)); // sync auth slice too
      }
      return profileUser;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load profile");
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setProfileUser } = profileSlice.actions;
export default profileSlice.reducer;