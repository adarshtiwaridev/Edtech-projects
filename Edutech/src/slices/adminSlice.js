import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchDashboardStatsApi,
  fetchRevenueChartsApi,
  fetchUsersApi,
  updateUserStatusApi,
  deleteUserApi,
  fetchAllCoursesAdminApi,
  updateCourseStatusAdminApi
} from "../services/adminService";

export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDashboardStatsApi();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchRevenueCharts = createAsyncThunk(
  "admin/fetchRevenueCharts",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchRevenueChartsApi();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (params, { rejectWithValue }) => {
    try {
      return await fetchUsersApi(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "admin/updateUserStatus",
  async ({ userId, status, rejectionReason }, { rejectWithValue }) => {
    try {
      return await updateUserStatusApi(userId, status, rejectionReason);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await deleteUserApi(userId);
      return userId; // return ID to remove from state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAllCoursesAdmin = createAsyncThunk(
  "admin/fetchAllCoursesAdmin",
  async (params, { rejectWithValue }) => {
    try {
      return await fetchAllCoursesAdminApi(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCourseStatusAdmin = createAsyncThunk(
  "admin/updateCourseStatusAdmin",
  async ({ courseId, status }, { rejectWithValue }) => {
    try {
      return await updateCourseStatusAdminApi(courseId, status);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  stats: null,
  charts: null,
  users: [],
  courses: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Revenue Charts
      .addCase(fetchRevenueCharts.fulfilled, (state, action) => {
        state.charts = action.payload;
      })
      // Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex(u => u._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      // Courses
      .addCase(fetchAllCoursesAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCoursesAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchAllCoursesAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Course Status
      .addCase(updateCourseStatusAdmin.fulfilled, (state, action) => {
        const updatedCourse = action.payload;
        const index = state.courses.findIndex(c => c._id === updatedCourse._id);
        if (index !== -1) {
          state.courses[index] = updatedCourse;
        }
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
