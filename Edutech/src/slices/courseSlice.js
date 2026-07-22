import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCategoryApi,
  createCourseApi,
  createLectureApi,
  createOrderApi,
  createSectionApi,
  deleteCourseApi,
  fetchAllCoursesApi,
  fetchCategoriesApi,
  fetchCourseDetailsApi,
  fetchEnrolledCoursesApi,
  filterTeacherCourses,
  updateCourseApi,
} from "../services/courseService";

const initialState = {
  allCourses: [],
  teacherCourses: [],
  enrolledCourses: [],
  categories: [],
  singleCourse: null,
  loading: false,
  error: null,
  lastFetchedAt: null,
};

export const fetchAllCourses = createAsyncThunk(
  "course/fetchAllCourses",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllCoursesApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTeacherCourses = createAsyncThunk(
  "course/fetchTeacherCourses",
  async (_, { getState, rejectWithValue }) => {
    try {
      const courses = await fetchAllCoursesApi();
      const state = getState() || {};
      const userId = state?.profile?.user?._id || state?.profile?.user?.id || state?.auth?.user?._id || state?.auth?.user?.id;
      return filterTeacherCourses(courses, userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "course/fetchCourseById",
  async (courseId, { rejectWithValue }) => {
    try {
      return await fetchCourseDetailsApi(courseId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "course/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCategoriesApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCourse = createAsyncThunk(
  "course/createCourse",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("courseName", payload.title);
      formData.append("courseDescription", payload.description);
      formData.append("price", payload.price);
      formData.append("category", payload.category);
      formData.append("level", payload.level);
      if (payload.thumbnailFile) {
        formData.append("thumbnailFile", payload.thumbnailFile);
      }

      const createdCourse = await createCourseApi(formData);
      const courseId = createdCourse?.data?._id;

      if (!courseId) {
        throw new Error("Failed to get course ID from response");
      }

      if (Array.isArray(payload.sections) && payload.sections.length > 0) {
        for (const section of payload.sections) {
          if (!section?.title?.trim()) continue;
          const sectionResponse = await createSectionApi(courseId, section.title);
          const populatedSections = sectionResponse?.updatedCourse?.courseContent || [];
          const latestSection = populatedSections[populatedSections.length - 1];

          if (latestSection?._id && Array.isArray(section.lectures)) {
            for (const lecture of section.lectures) {
              if (!lecture.title?.trim()) continue;
              if (!(lecture.videoFile instanceof File)) {
                throw new Error(`Please choose a local video file for lecture "${lecture.title}"`);
              }
              await createLectureApi({
                sectionId: latestSection._id,
                title: lecture.title,
                videoUrl: lecture.videoFile,
                notes: lecture.notes,
              });
            }
          }
        }
      }

      return await fetchCourseDetailsApi(courseId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "course/createCategory",
  async (payload, { rejectWithValue }) => {
    try {
      return await createCategoryApi(payload);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async ({ courseId, payload }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (payload.title) formData.append("courseName", payload.title);
      if (payload.description) formData.append("courseDescription", payload.description);
      if (payload.price !== undefined) formData.append("price", payload.price);
      if (payload.category) formData.append("category", payload.category);
      if (payload.level) formData.append("level", payload.level);
      if (payload.thumbnailFile) {
        formData.append("thumbnailFile", payload.thumbnailFile);
      }
      return await updateCourseApi(courseId, formData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      await deleteCourseApi(courseId);
      return courseId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEnrolledCourses = createAsyncThunk(
  "course/fetchEnrolledCourses",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchEnrolledCoursesApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const purchaseCourse = createAsyncThunk(
  "course/purchaseCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const order = await createOrderApi(courseId);
      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    clearCourseError(state) {
      state.error = null;
    },
    clearSingleCourse(state) {
      state.singleCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.allCourses = action.payload;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTeacherCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherCourses = action.payload;
      })
      .addCase(fetchTeacherCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.categories.unshift(action.payload);
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherCourses.unshift(action.payload);
        state.allCourses.unshift(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        const nextCourse = action.payload;
        state.teacherCourses = state.teacherCourses.map((course) =>
          course.id === nextCourse.id ? { ...course, ...nextCourse } : course
        );
        state.allCourses = state.allCourses.map((course) =>
          course.id === nextCourse.id ? { ...course, ...nextCourse } : course
        );
        if (state.singleCourse?.id === nextCourse.id) {
          state.singleCourse = { ...state.singleCourse, ...nextCourse };
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.payload;
        state.teacherCourses = state.teacherCourses.filter((course) => course.id !== removedId);
        state.allCourses = state.allCourses.filter((course) => course.id !== removedId);
        if (state.singleCourse?.id === removedId) {
          state.singleCourse = null;
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = action.payload;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCourseError, clearSingleCourse } = courseSlice.actions;
export default courseSlice.reducer;

