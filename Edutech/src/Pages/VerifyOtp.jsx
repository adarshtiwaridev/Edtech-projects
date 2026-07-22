import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from "react-hot-toast";
import { useSignup, useSendOtp } from '../hooks/useAuth';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { mutate: signup, isPending: isSignupLoading } = useSignup();
  const { mutate: sendOtp, isPending: isSendOtpLoading } = useSendOtp();
  const isLoading = isSignupLoading || isSendOtpLoading;
  
  // Get from localStorage
  const signupData = JSON.parse(localStorage.getItem("signupData") || "null");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = (data) => {
    if (!signupData) {
      toast.error("Session expired. Please signup again.");
      navigate('/signup');
      return;
    }
    const payload = { ...signupData, otp: data.otp };
    signup(payload);
  };

  const handleResendOtp = () => {
    if (!signupData?.email) {
      toast.error("No email found. Please signup again.");
      return;
    }
    sendOtp(signupData.email);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center py-10"
      style={{ backgroundImage: "url('/Images/background2.jpg')" }}
    >
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-lg max-w-md w-full px-6 py-10 mx-auto">
        <h2 className="text-4xl font-extrabold text-white mb-4 text-center">
          Verify OTP
        </h2>

        <p className="text-center text-white mb-6 text-sm opacity-90">
          Enter the 6-digit OTP sent to your email {signupData?.email && `(${signupData.email})`}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1">
              OTP Code
            </label>
            <input
              type="text"
              {...register('otp')}
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="mt-1 block w-full px-4 py-3 text-center tracking-widest text-2xl font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
            />
            {errors.otp && <p className="text-red-400 text-xs mt-2 text-center">{errors.otp.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 mt-6 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : null}
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-white text-sm">
          Didn’t receive OTP?{" "}
          <button
            onClick={handleResendOtp}
            className="underline cursor-pointer hover:text-blue-300 bg-transparent border-none focus:outline-none"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;

