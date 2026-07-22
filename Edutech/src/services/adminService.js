import axiosInstance from "../api/axiosInstance";

export const ENDPOINTS = {
  ADMIN: {
    DASHBOARD_STATS: "/admin/dashboard-stats",
    REVENUE_CHARTS: "/admin/revenue-charts",
    USERS: "/admin/users",
    UPDATE_USER_STATUS: "/admin/user/status",
    DELETE_USER: (id) => `/admin/user/${id}`,
    COURSES: "/admin/courses",
    UPDATE_COURSE_STATUS: "/admin/course/status",
  },
};

export const fetchDashboardStatsApi = async () => {
  const response = await axiosInstance.get(ENDPOINTS.ADMIN.DASHBOARD_STATS);
  return response.data?.data || response.data;
};

export const fetchRevenueChartsApi = async () => {
  const response = await axiosInstance.get(ENDPOINTS.ADMIN.REVENUE_CHARTS);
  return response.data?.data || response.data;
};

export const fetchUsersApi = async (params) => {
  const response = await axiosInstance.get(ENDPOINTS.ADMIN.USERS, { params });
  return response.data?.data || response.data;
};

export const updateUserStatusApi = async (userId, status, rejectionReason = "") => {
  const response = await axiosInstance.put(ENDPOINTS.ADMIN.UPDATE_USER_STATUS, { userId, status, rejectionReason });
  return response.data?.data || response.data;
};

export const deleteUserApi = async (userId) => {
  const response = await axiosInstance.delete(ENDPOINTS.ADMIN.DELETE_USER(userId));
  return response.data?.data || response.data;
};

export const fetchAllCoursesAdminApi = async (params) => {
  const response = await axiosInstance.get(ENDPOINTS.ADMIN.COURSES, { params });
  return response.data?.data || response.data;
};

export const updateCourseStatusAdminApi = async (courseId, status) => {
  const response = await axiosInstance.put(ENDPOINTS.ADMIN.UPDATE_COURSE_STATUS, { courseId, status });
  return response.data?.data || response.data;
};
