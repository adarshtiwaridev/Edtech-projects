import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useSendOtp } from '../hooks/useAuth';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  mobile: z.string().regex(/^[0-9]{10}$/, 'Must be a valid 10-digit mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  accountType: z.enum(['Student', 'Teacher', 'Admin']), // Or whatever roles are allowed
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: sendOtp, isPending: isLoading } = useSendOtp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      accountType: 'Student',
    },
  });

  const onSubmit = (data) => {
    localStorage.setItem("signupData", JSON.stringify(data));
    sendOtp(data.email);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center py-10"
      style={{ backgroundImage: "url('/Images/background2.jpg')" }}
    >
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-lg max-w-xl w-full h-auto px-6 py-8 mx-auto mt-10">
        <h2 className="text-4xl font-extrabold text-white mb-6 text-center">Create Your Account</h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium">First Name</label>
              <input
                type="text"
                {...register('firstName')}
                placeholder="John"
                className="mt-1 block w-full px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
              />
              {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block text-white text-sm font-medium">Last Name</label>
              <input
                type="text"
                {...register('lastName')}
                placeholder="Doe"
                className="mt-1 block w-full px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
              />
              {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium">Email</label>
            <input
              type="email"
              {...register('email')}
              placeholder="example@mail.com"
              className="mt-1 block w-full px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-white text-sm font-medium">Mobile Number</label>
            <input
              type="tel"
              {...register('mobile')}
              placeholder="9876543210"
              className="mt-1 block w-full px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
            />
            {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile.message}</p>}
          </div>

          <div>
            <label className="block text-white text-sm font-medium">Account Type</label>
            <select
              {...register('accountType')}
              className="mt-1 block w-full px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
            {errors.accountType && <p className="text-red-400 text-xs mt-1">{errors.accountType.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-white text-sm font-medium">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Enter password"
                  className="block w-full px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="relative">
              <label className="block text-white text-sm font-medium">Confirm Password</label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="Confirm password"
                  className="block w-full px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 mt-4 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : null}
            {isLoading ? 'Sending OTP...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-white">
          Already have an account?{' '}
          <Link to="/login" className="underline hover:text-blue-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

