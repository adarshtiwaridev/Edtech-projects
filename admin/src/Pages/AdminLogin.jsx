import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useLogin } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const AdminLogin = () => {
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600/20 p-3 rounded-full mb-3 text-blue-400">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-2xl font-bold text-white text-center">JP EdTech Admin Portal</h1>
          <p className="text-sm text-slate-400 mt-1">Authorized Administrative Access Only</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Admin Email</label>
            <input
              type="email"
              {...register('email')}
              placeholder="admin@jpedtech.com"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <label className="block text-slate-300 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 flex justify-center items-center shadow-lg shadow-blue-900/40"
          >
            {isLoading ? 'Signing in...' : 'Sign in to Admin Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
