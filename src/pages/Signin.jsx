import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../supabase/supabaseClient";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../Auth/AuthContext";
import toast from "react-hot-toast";

export default function Signin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { redirectPath, setRedirectPath } = useAuth();

  const redirectTo = redirectPath || location.state?.from || "/event-booking";

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ------------------------
  // EMAIL / PASSWORD LOGIN
  // ------------------------
  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: input.email.trim(),
      password: input.password,
    });

    setLoading(false);

    if (error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Login successful 🎉");
    setTimeout(() => {
      navigate(redirectTo);
      setRedirectPath(null);
    }, 800);
  };

  // ------------------------
  // GOOGLE LOGIN
  // ------------------------
  const googleLogin = async () => {
    toast.loading("Redirecting to Google…");
    setRedirectPath(redirectTo);

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 sm:p-10 shadow-2xl border border-gray-100 rounded-xl max-w-md w-full relative"
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 transition duration-150"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mt-4">
          Sign In to Your Workspace
        </h2>
        <p className="text-center text-sm sm:text-base text-gray-500 mt-2 mb-8">
          Welcome back! Please enter your credentials.
        </p>

        {/* GOOGLE LOGIN BUTTON */}
        <button
          onClick={googleLogin}
          className="w-full mb-6 border border-gray-300 py-3 rounded-lg flex justify-center items-center gap-3 text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 transition duration-150 active:bg-gray-100"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google Logo"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">
            OR
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* EMAIL / PASSWORD FORM */}
        <form onSubmit={login} className="space-y-5">
          <input type="text" style={{ display: "none" }} autoComplete="off" />
          <input type="password" style={{ display: "none" }} autoComplete="off" />

          <Input
            label="Email Address"
            type="email"
            autoComplete="off"
            value={input.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
          />

          <PasswordField
            label="Password"
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
            autoComplete="new-password"
            value={input.password}
            onChange={(e) => setInput({ ...input, password: e.target.value })}
          />

          {/* SIGN IN BUTTON WITH SPINNER */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-sm sm:text-base font-semibold rounded-lg transition duration-300
              ${
                loading
                  ? "bg-pink-400 cursor-not-allowed"
                  : "bg-pink-600 text-white hover:bg-pink-700 shadow-md"
              }`}
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-xs sm:text-sm text-gray-600">
          Don't have an account?
          <Link
            to="/signup"
            className="text-pink-600 ml-1 font-semibold hover:text-pink-700"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

// INPUT COMPONENT
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500"
      />
    </div>
  );
}

// PASSWORD FIELD COMPONENT
function PasswordField({ label, show, toggle, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...props}
          className="w-full p-3 border border-gray-300 rounded-lg pr-10 shadow-sm focus:ring-2 focus:ring-pink-500"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
  );
}
