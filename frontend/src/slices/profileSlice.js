import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setAuthUser } from "./authSlice";

// thunk to fetch the currently logged in user's profile from backend
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:5000/api/profiles/getUserDetails`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.message || 'Failed to load profile');
      }
      const data = await res.json();
      const profileUser = data.data;
      dispatch(setAuthUser(profileUser)); // sync auth slice too
      return profileUser; // backend wraps profile in data
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

const intialState = {
    user: null,
    loading: false,
    error: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState: intialState,
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
    }
});

export const { setProfileUser } = profileSlice.actions;
export default profileSlice.reducer;