import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Login submitted:', formData);
      // Add your login API call here
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/Images/background2.jpg')" }}
    >
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-lg max-w-xl w-full h-auto px-6 py-8 mx-auto my-20">
        <div className=" flex flex-row mx-auto justify-around items-center">
            <img src="/Images/logo2.png" alt="" srcset="" className='w-34 h-28'/>
        <h2 className="text-4xl font-extrabold text-white mb-6 text-center">Welcome Back</h2>
</div> 
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-white text-sm font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="mt-1 block w-full px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

        <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    value={formData.password}
    onChange={handleChange}
    placeholder="Enter your password"
    className="mt-1 block w-full px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
  />

  <button
    type="button"
    onClick={() => setShowPassword(prev => !prev)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
  >
    {showPassword ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477-1 12-1s10 4.477 10 10a10.05 10.05 0 01-.875 4.825M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.085.244-.18.482-.283.717M15 12a3 3 0 00-6 0" />
      </svg>
    )}
  </button>
</div>


          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-white">
          Don’t have an account?{' '}
          <a href="/signup" className="underline hover:text-blue-300">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
