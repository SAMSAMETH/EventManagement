import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../supabase/supabaseClient";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function Signin() {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email.trim(),
      password: input.password,
    });

    if (error) {
      alert("Invalid email or password");
      return;
    }

    navigate("/dashboard");
  };

  const googleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/dashboard",
      },
    });
  };

  const resetPassword = async () => {
    if (!input.email) return alert("Enter email to reset password");

    const { error } = await supabase.auth.resetPasswordForEmail(input.email);

    if (error) alert(error.message);
    else alert("Password reset link sent to your email.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl max-w-md w-full border border-pink-100 relative transform-gpu"
      >
        {/* BACK BUTTON - Mobile & Desktop */}
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-3 left-3 p-2 rounded-full text-gray-600 hover:text-pink-600 transition bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm lg:top-6 lg:left-6 lg:bg-transparent lg:border-none lg:shadow-none"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        </motion.button>

        {/* HEADER - Mobile Adjusted */}
        <div className="text-center mb-6 sm:mb-8 mt-2 sm:mt-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome <span className="text-pink-600">Back</span>
          </h2>
          <p className="text-sm text-gray-600 mt-2 hidden sm:block">
            Sign in to your Zecardia.Events account
          </p>
        </div>

        {/* LOGIN FORM - Mobile Optimized */}
        <form className="space-y-4 sm:space-y-5" onSubmit={login} autoComplete="off">
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1 sm:mb-2">Email</label>
            <input
              type="email"
              value={input.email}
              autoComplete="new-email"
              onChange={(e) =>
                setInput({ ...input, email: e.target.value })
              }
              className="w-full p-3 text-sm sm:text-base border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none rounded-xl transition duration-150"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1 sm:mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={input.password}
                autoComplete="new-password"
                onChange={(e) =>
                  setInput({ ...input, password: e.target.value })
                }
                className="w-full p-3 text-sm sm:text-base border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none rounded-xl transition duration-150 pr-12"
                placeholder="Enter your password"
                required
              />

              {/* Password Toggle Button */}
              <button
                type="button"
                className="absolute right-3 bottom-3 text-gray-500 hover:text-pink-600 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          {/* SIGN IN BTN */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold text-sm sm:text-base shadow-md hover:bg-pink-700 transition duration-150 focus:ring-2 focus:ring-pink-500/20 focus:outline-none active:bg-pink-800"
          >
            Sign In
          </motion.button>
        </form>

        {/* RESET PASSWORD */}
        <button
          onClick={resetPassword}
          className="text-xs sm:text-sm text-blue-600 mt-3 sm:mt-4 hover:underline w-full text-center block"
        >
          Forgot Password?
        </button>

        {/* SEPARATOR */}
        <div className="relative my-4 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 text-xs sm:text-sm">Or continue with</span>
          </div>
        </div>

        {/* GOOGLE LOGIN - Mobile Optimized */}
        <button
          onClick={googleLogin}
          className="w-full flex justify-center items-center gap-3 border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 transition duration-150 shadow-sm focus:ring-2 focus:ring-gray-500/20 focus:outline-none active:bg-gray-100 text-sm sm:text-base"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-4 h-4 sm:w-5 sm:h-5"
            alt="Google logo"
          />
          Continue with Google
        </button>

        {/* SIGN UP LINK - Mobile Adjusted */}
        <p className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600">
          Don't have an account?
          <Link to="/signup" className="text-pink-600 font-semibold hover:text-pink-700 transition ml-1">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

