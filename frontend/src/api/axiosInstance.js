import axios from "axios";
import { API_URL } from "../constants/endpoints";
import toast from "react-hot-toast";
import { setToken, logout } from "../slices/authSlice";

let store;
export const injectStore = (_store) => {
  store = _store;
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies/CORS
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle specific error codes
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshResponse = await axios.post(`${API_URL}/users/refresh`, {}, { withCredentials: true });
          const newToken = refreshResponse.data.token;
          
          if (store) {
            store.dispatch(setToken(newToken));
          }
          localStorage.setItem("token", newToken);
          
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (store) {
            store.dispatch(logout());
          }
          // Let the UI handle redirect or state change
        }
      }

      const errorMessage = data?.message || "An unexpected error occurred.";
      console.error(`API Error [${status}]:`, errorMessage);
      
      // Let the calling component handle the toast for better control, 
      // but we can log it here.
    } else if (error.request) {
      console.error("Network Error: No response received.");
      toast.error("Network Error: Please check your internet connection.");
    } else {
      console.error("Error setup:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
