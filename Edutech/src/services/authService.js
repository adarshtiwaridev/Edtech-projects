import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../constants/endpoints";

export const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },
  signup: async (userData) => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.SIGNUP, userData);
    return response.data;
  },
  sendOtp: async (email) => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.SEND_OTP, { email });
    return response.data;
  },
  verifyOtp: async (data) => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.VERIFY_OTP, data);
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },
  contactUs: async (data) => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.CONTACT_US, data);
    return response.data;
  },
  changePassword: async (data) => {
    const response = await axiosInstance.put(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    return response.data;
  },
  resetPasswordToken: async (email) => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.RESET_PASSWORD_TOKEN, { email });
    return response.data;
  },
  resetPassword: async (token, passwords) => {
    const response = await axiosInstance.post(`${ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`, passwords);
    return response.data;
  },
};
