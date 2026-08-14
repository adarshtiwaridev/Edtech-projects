import axios from "axios";

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    if (!envUrl || envUrl.includes("onrender.com")) {
      return "http://localhost:5000/api";
    }
  }
  return envUrl || "https://kodemates-2.onrender.com/api";
};

const API_BASE_URL = getBaseUrl();

const extractTokenFromLocalStorage = () => {
  try {
    const token = localStorage.getItem("token");
    return token ? token.replace(/^"(.*)"$/, "$1") : null;
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/users/refresh`, {}, { withCredentials: true });
        const newToken = refreshResponse.data.token;

        const { store } = await import("../store/store");
        const { setToken } = await import("../slices/authSlice");

        store.dispatch(setToken(newToken));
        localStorage.setItem("token", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        try {
          const { store } = await import("../store/store");
          const { logout } = await import("../slices/authSlice");
          store.dispatch(logout());
        } catch (e) {}
        localStorage.removeItem("token");
        return Promise.reject(new Error("Session expired. Please log in again."));
      }
    }

    const serverMessage = error?.response?.data?.message;
    const fallbackMessage = error?.message || "Request failed";
    return Promise.reject(new Error(serverMessage || fallbackMessage));
  }
);

// Helper to sanitize paths and prevent double '/api/api' concatenation
const sanitizePath = (path) => {
  if (typeof path === "string" && path.startsWith("/api/")) {
    return path.replace(/^\/api/, "");
  }
  return path;
};

export const postWithFallback = async (paths, data, config = {}) => {
  let lastError;
  for (const p of paths) {
    const path = sanitizePath(p);
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
  for (const p of paths) {
    const path = sanitizePath(p);
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
  for (const p of paths) {
    const path = sanitizePath(p);
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
  for (const p of paths) {
    const path = sanitizePath(p);
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
