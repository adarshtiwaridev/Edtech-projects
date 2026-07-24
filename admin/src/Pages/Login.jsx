import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

import { setToken, setAuthUser } from '../slices/authSlice';
import { setProfileUser } from '../slices/profileSlice';
import { useLogin } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending: isLoading } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/Images/background2.jpg')" }}
    >
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-lg max-w-xl w-full h-auto px-6 py-8 mx-auto my-20">
        <div className="flex flex-row mx-auto justify-around items-center">
          <img src="/Images/logo2.png" alt="Logo" className="w-34 h-28" />
          <h2 className="text-4xl font-extrabold text-white mb-6 text-center">Welcome Back</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-white text-sm font-medium">Email Address</label>
            <input
              type="email"
              {...register('email')}
              placeholder="example@mail.com"
              className="mt-1 block w-full px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <label className="block text-white text-sm font-medium">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Enter your password"
                className="block w-full px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}

            <div className="flex justify-end mt-2">
              <Link
                to="/Forgot-password"
                className="text-sm text-blue-300 hover:text-blue-400 transition-all"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : null}
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-white">
          Don’t have an account?{' '}
          <Link to="/signup" className="underline hover:text-blue-300">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

