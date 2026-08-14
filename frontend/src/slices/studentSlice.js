import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as studentApi from "../services/studentService";

export const fetchStudentOverview = createAsyncThunk(
  "student/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const res = await studentApi.getStudentOverview();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchLoginSessions = createAsyncThunk(
  "student/fetchSessions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await studentApi.getLoginSessions();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const terminateSessionThunk = createAsyncThunk(
  "student/terminateSession",
  async (sessionId, { dispatch, rejectWithValue }) => {
    try {
      await studentApi.terminateLoginSession(sessionId);
      dispatch(fetchLoginSessions());
      return sessionId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logActivityThunk = createAsyncThunk(
  "student/logActivity",
  async (activityData, { dispatch, rejectWithValue }) => {
    try {
      const res = await studentApi.logStudyActivity(activityData);
      dispatch(fetchStudentOverview());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const recoverStreakThunk = createAsyncThunk(
  "student/recoverStreak",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await studentApi.recoverStudentStreak();
      dispatch(fetchStudentOverview());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchStudentAnalytics = createAsyncThunk(
  "student/fetchAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const res = await studentApi.getStudentAnalytics();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchStudentResume = createAsyncThunk(
  "student/fetchResume",
  async (_, { rejectWithValue }) => {
    try {
      const res = await studentApi.getStudentResume();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateStudentResumeThunk = createAsyncThunk(
  "student/updateResume",
  async (resumeData, { dispatch, rejectWithValue }) => {
    try {
      const res = await studentApi.updateStudentResume(resumeData);
      dispatch(fetchStudentResume());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchNotificationsThunk = createAsyncThunk(
  "student/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await studentApi.getStudentNotifications();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markNotificationReadThunk = createAsyncThunk(
  "student/markNotificationRead",
  async (notifId, { dispatch, rejectWithValue }) => {
    try {
      await studentApi.markNotificationRead(notifId);
      dispatch(fetchNotificationsThunk());
      return notifId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchPreferencesThunk = createAsyncThunk(
  "student/fetchPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const res = await studentApi.getStudentPreferences();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updatePreferencesThunk = createAsyncThunk(
  "student/updatePreferences",
  async (prefData, { dispatch, rejectWithValue }) => {
    try {
      const res = await studentApi.updateStudentPreferences(prefData);
      dispatch(fetchPreferencesThunk());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  overview: null,
  sessions: null,
  analytics: null,
  resumeData: null,
  notifications: [],
  unreadNotificationsCount: 0,
  preferences: null,
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentOverview.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchStudentOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLoginSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
      })
      .addCase(fetchStudentAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      })
      .addCase(fetchStudentResume.fulfilled, (state, action) => {
        state.resumeData = action.payload;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications;
        state.unreadNotificationsCount = action.payload.unreadCount;
      })
      .addCase(fetchPreferencesThunk.fulfilled, (state, action) => {
        state.preferences = action.payload;
      });
  },
});

export default studentSlice.reducer;
