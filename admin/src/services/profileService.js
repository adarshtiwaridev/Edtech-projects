import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../constants/endpoints";

export const profileService = {
  getUserDetails: async () => {
    const response = await axiosInstance.get(ENDPOINTS.PROFILE.GET_USER_DETAILS);
    return response.data;
  },
  getAllUserDetails: async () => {
    const response = await axiosInstance.get(ENDPOINTS.PROFILE.GET_ALL_USER_DETAILS);
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await axiosInstance.put(ENDPOINTS.PROFILE.UPDATE_PROFILE, data);
    return response.data;
  },
  updateDisplayPicture: async (formData) => {
    const response = await axiosInstance.put(ENDPOINTS.PROFILE.UPDATE_DISPLAY_PICTURE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  getEnrolledCourses: async () => {
    const response = await axiosInstance.get(ENDPOINTS.PROFILE.GET_ENROLLED_COURSES);
    return response.data;
  },
  deleteAccount: async () => {
    const response = await axiosInstance.delete(ENDPOINTS.PROFILE.DELETE_ACCOUNT);
    return response.data;
  },
};
