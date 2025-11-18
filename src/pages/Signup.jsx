import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// NOTE: Assuming supabaseClient is correctly configured and imported.
import { supabase } from "../supabase/supabaseClient"; 

// Inline SVG for icons (used instead of importing an icon library)
const EyeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EyeOffIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 7.5l-.5.5"/><path d="M21.5 17.5-6.5-6.5"/><path d="M12 21c-7 0-10-7-10-7s3-7 10-7 10 7 10 7"/><path d="m2 12 4-4"/><path d="m22 12-4-4"/><path d="M12 17a5 5 0 0 0 5-5m-5-5a5 5 0 0 0-5 5"/></svg>
);
const ArrowLeftIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

export default function Signup() {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  // Custom handler to display status/error messages
  const displayMessage = (text, isErr = false) => {
    setIsError(isErr);
    setMessage(text);
    // Automatically clear the message after 5 seconds
    setTimeout(() => setMessage(null), 5000); 
  };

  // Handles standard email/password signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous message

    const { error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.name,
        },
        // IMPORTANT: Update this to your actual production sign-in URL
        emailRedirectTo: "http://localhost:5173/signin" 
      }
    });

    if (error) {
      console.error("Signup Error:", error.message);
      // Replaced alert with custom UI message
      displayMessage(error.message, true);
      return;
    }

    // Replaced alert with custom UI message
    displayMessage("Account created! Please check your email to verify.");
    navigate("/signin");
  };

  // Handles Google OAuth sign-up
  const googleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/dashboard",
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl w-full max-w-[90vw] sm:max-w-md border border-pink-100 relative transform-gpu"
      >
        {/* BACK BUTTON - Optimized for Mobile */}
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-3 left-3 p-2 rounded-full text-gray-600 hover:text-pink-600 transition bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm lg:top-6 lg:left-6 lg:bg-transparent lg:border-none lg:shadow-none"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        </motion.button>
        
        {/* HEADER - Adjusted for Mobile */}
        <div className="text-center mb-6 mt-2 sm:mt-0 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Create <span className="text-pink-600">Account</span>
          </h2>
          <p className="text-sm text-gray-600 mt-2 hidden sm:block">
            Join Zecardia.Events today
          </p>
        </div>

        {/* MESSAGE BOX - Mobile Optimized */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-3 mb-4 rounded-lg text-xs sm:text-sm transition-colors ${
                isError
                  ? 'bg-red-50 border border-red-200 text-red-700'
                  : 'bg-green-50 border border-green-200 text-green-700'
              } flex justify-between items-start`}
            >
              <p className="flex-grow pr-2">{message}</p>
              <button 
                onClick={() => setMessage(null)} 
                className="flex-shrink-0 text-current opacity-70 hover:opacity-100 mt-0.5"
              >
                <XIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM - Mobile Optimized */}
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSignup}>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1 sm:mb-2">Full Name</label>
            <input
              type="text"
              value={input.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
              className="w-full p-3 text-sm sm:text-base border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none rounded-xl transition duration-150"
              placeholder="Enter your full name"
              required
              autoComplete="off"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1 sm:mb-2">Email</label>
            <input
              type="email"
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
              className="w-full p-3 text-sm sm:text-base border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none rounded-xl transition duration-150"
              placeholder="Enter your email"
              required
              autoComplete="off"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1 sm:mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={input.password}
                onChange={(e) => setInput({ ...input, password: e.target.value })}
                className="w-full p-3 text-sm sm:text-base border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none rounded-xl transition duration-150 pr-12"
                placeholder="Create a password"
                required
                autoComplete="new-password"
              />
              {/* PASSWORD TOGGLE BUTTON */}
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                whileTap={{ scale: 0.9 }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-pink-600 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </motion.button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold text-sm sm:text-base shadow-md hover:bg-pink-700 transition duration-150 focus:ring-2 focus:ring-pink-500/20 focus:outline-none active:bg-pink-800"
            type="submit"
          >
            Sign Up
          </motion.button>
        </form>

        {/* SEPARATOR - Mobile Adjusted */}
        <div className="relative my-4 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 text-xs sm:text-sm">Or continue with</span>
          </div>
        </div>

        {/* GOOGLE BUTTON - Mobile Optimized */}
        <button
          onClick={googleSignup}
          className="w-full flex justify-center items-center gap-3 border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 transition duration-150 shadow-sm focus:ring-2 focus:ring-gray-500/20 focus:outline-none active:bg-gray-100 text-sm sm:text-base"
          type="button"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-4 h-4 sm:w-5 sm:h-5"
            alt="Google logo"
          />
          Continue with Google
        </button>

        {/* SIGN IN LINK - Mobile Adjusted */}
        <p className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600">
          Already have an account?
          <Link 
            className="text-pink-600 font-medium hover:text-pink-700 transition ml-1" 
            to="/signin"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}




