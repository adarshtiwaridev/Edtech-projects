import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// thunk to fetch the currently logged in user's profile from backend
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/api/usersprofile/getUserDetails", {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.message || 'Failed to load profile');
      }
      const data = await res.json();
      return data.data; // backend wraps profile in data
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
        setUser: (state, action) => {
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

export const { setUser } = profileSlice.actions;
export default profileSlice.reducer;