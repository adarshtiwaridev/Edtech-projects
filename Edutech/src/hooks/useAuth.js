import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setToken, setAuthUser, logout } from "../slices/authSlice";
import { setProfileUser } from "../slices/profileSlice";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      dispatch(setToken(data.token));
      dispatch(setAuthUser(data.user));
      dispatch(setProfileUser(data.user));
      localStorage.setItem("token", data.token);
      toast.success(data.message || "Login successful!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
    },
  });
};

export const useSendOtp = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (email) => authService.sendOtp(email),
    onSuccess: (data, variables) => {
      toast.success(data.message || "OTP sent successfully!");
      // The signup data is usually saved in localStorage before calling sendOtp
      navigate("/VerifyOtp");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to send OTP.");
    },
  });
};

export const useSignup = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (userData) => authService.signup(userData),
    onSuccess: (data) => {
      toast.success(data.message || "Signup successful! Please login.");
      localStorage.removeItem("signupData");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Signup failed. Please try again.");
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data) => authService.verifyOtp(data),
  }); // Success handling usually chained in the component to trigger signup next
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      dispatch(logout());
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/");
    },
    onError: (error) => {
      toast.error("Logout failed.");
    },
  });
};
