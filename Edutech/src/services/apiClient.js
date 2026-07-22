import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const extractTokenFromLocalStorage = () => {
  try {
    const token = localStorage.getItem("token");
    // If it was stored with JSON.stringify, parse it, otherwise just return
    return token ? token.replace(/^"(.*)"$/, '$1') : null;
  } catch {
    return null;
  }
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = extractTokenFromLocalStorage();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import { store } from "../store/store";
import { setToken, logout } from "../store/slices/authSlice";

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/api/users/refresh`, {}, { withCredentials: true });
        const newToken = refreshResponse.data.token;
        
        // Update Redux state and local storage
        store.dispatch(setToken(newToken));
        localStorage.setItem("token", newToken);
        
        // Update header for original request and retry
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, logout user
        store.dispatch(logout());
        return Promise.reject(new Error("Session expired. Please log in again."));
      }
    }
    
    const serverMessage = error?.response?.data?.message;
    const fallbackMessage = error?.message || "Request failed";
    return Promise.reject(new Error(serverMessage || fallbackMessage));
  }
);

export const postWithFallback = async (paths, data, config = {}) => {
  let lastError;
  for (const path of paths) {
    try {
      const response = await apiClient.post(path, data, config);
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

export const getWithFallback = async (paths, config = {}) => {
  let lastError;
  for (const path of paths) {
    try {
      const response = await apiClient.get(path, config);
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

export const putWithFallback = async (paths, data, config = {}) => {
  let lastError;
  for (const path of paths) {
    try {
      const response = await apiClient.put(path, data, config);
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

export const deleteWithFallback = async (paths, config = {}) => {
  let lastError;
  for (const path of paths) {
    try {
      const response = await apiClient.delete(path, config);
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

export default apiClient;
