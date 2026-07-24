import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`http://localhost:5000/api/users/resetPasswordToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Reset link sent to your email!");
      } else {
        setMessage("❌ " + (data.message || "Failed to send reset link."));
      }
    } catch (error) {
      setMessage("❌ An error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/Images/background2.jpg')" }}
    >
      {/* Glassmorphism Card */}
      <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-3xl shadow-2xl max-w-md w-full px-8 py-10 mx-auto transition-all">
        
        <h2 className="text-3xl font-extrabold text-white mb-2 text-center">
          Reset Password
        </h2>
        <p className="text-blue-100 text-sm text-center mb-8">
          Enter your email and we'll send you a link to get back into your account.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-white text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
              Registered Email
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white bg-opacity-20 border border-transparent rounded-xl text-white placeholder-blue-200 focus:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
              isLoading 
                ? "bg-gray-500 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/50"
            }`}
          >
            {isLoading ? "Sending Link..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-3 rounded-lg text-center text-sm font-medium animate-pulse ${
            message.includes("✅") ? "bg-green-500/20 text-green-200" : "bg-red-500/20 text-red-200"
          }`}>
            {message}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white border-opacity-10 text-center">
          <p className="text-white text-sm">
            Remember your password?{" "}
            <a href="/login" className="font-bold text-blue-300 hover:text-white underline-offset-4 hover:underline transition-all">
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;