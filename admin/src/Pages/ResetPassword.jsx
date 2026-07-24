import React, { useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom"; // Assuming you use react-router

const ResetPassword = () => {
  const { token } = useParams(); // Grabs the token from the URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Replace with your actual update password endpoint
      const response = await fetch(`http://localhost:5000/api/users/resetPassword/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password ,confirmPassword ,token}), // Send the token along with the new password  
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Password updated successfully! Redirecting to login...");
        setMessage("✅ Password updated successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 3000); // Send to login after 3s
      } else {
        setMessage("❌ " + (data.message || "Link expired or invalid."));
      }
    } catch (error) {
      setMessage("❌ Error connecting to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/Images/background2.jpg')" }}
    >
      <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-3xl shadow-2xl max-w-md w-full px-8 py-10 mx-auto transition-all">
        
        <h2 className="text-3xl font-extrabold text-white mb-2 text-center">
          Update Password
        </h2>
        <p className="text-blue-100 text-sm text-center mb-8">
          Strong passwords include numbers, symbols, and letters.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* New Password */}
          <div>
            <label className="block text-white text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
              New Password
            </label>
          <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    disabled={isLoading}
    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-transparent rounded-xl text-white placeholder-blue-200 focus:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-3 text-white"
  >
    {showPassword ? "🙈" : "👁️"}
  </button>
</div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-white text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
              Confirm New Password
            </label>
          <div className="relative">
  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="••••••••"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
    disabled={isLoading}
    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-transparent rounded-xl text-white placeholder-blue-200 focus:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
  />

  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-3 text-white"
  >
    {showConfirmPassword ? "🙈" : "👁️"}
  </button>
</div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
              isLoading 
                ? "bg-gray-500 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-500 hover:shadow-green-500/50"
            }`}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-3 rounded-lg text-center text-sm font-medium animate-pulse ${
            message.includes("✅") ? "bg-green-500/20 text-green-200" : "bg-red-500/20 text-red-200"
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;