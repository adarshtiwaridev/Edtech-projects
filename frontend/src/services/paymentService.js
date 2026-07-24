import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../constants/endpoints";

export const paymentService = {
  getRazorpayKey: async () => {
    const response = await axiosInstance.get(ENDPOINTS.PAYMENT.GET_RAZORPAY_KEY);
    return response.data;
  },
  capturePayment: async (courses) => {
    const response = await axiosInstance.post(ENDPOINTS.PAYMENT.CAPTURE_PAYMENT, { courses });
    return response.data;
  },
  verifyPayment: async (data) => {
    const response = await axiosInstance.post(ENDPOINTS.PAYMENT.VERIFY_PAYMENT, data);
    return response.data;
  },
};
