import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../supabase/supabaseClient";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../Auth/AuthContext";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setRedirectPath } = useAuth();

  const redirectTo = location.state?.from || "/event-booking";

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* ------------------------------------------------------
      EMAIL + PASSWORD SIGNUP
  ------------------------------------------------------ */
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (input.name.trim().length < 3) {
      setIsLoading(false);
      toast.error("Full name must be at least 3 characters.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: { full_name: input.name },
        emailRedirectTo: `${window.location.origin}/signin`,
      },
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Account created! Check your email to verify.");

    setRedirectPath(redirectTo);

    setTimeout(() => navigate("/signin"), 1500);
  };

  /* ------------------------------------------------------
      GOOGLE SIGNUP (AUTO STORES PROFILE)
  ------------------------------------------------------ */
  const googleSignup = async () => {
    setRedirectPath(redirectTo);
    setIsLoading(true);

    toast.loading("Redirecting to Google…");

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full relative border border-gray-100"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mt-4 mb-2">
          Get Started
        </h2>
        <p className="text-sm sm:text-base text-center text-gray-500 mb-6">
          Create your new account
        </p>

        {/* SIGNUP FORM */}
        <form onSubmit={handleSignup} className="space-y-5" autoComplete="off">

          {/* Fake autofill blockers */}
          <input
            type="text"
            name="fake-user"
            autoComplete="off"
            style={{ display: "none" }}
          />
          <input
            type="password"
            name="fake-pass"
            autoComplete="new-password"
            style={{ display: "none" }}
          />

          <InputBox
            label="Full Name"
            name="signupName"
            type="text"
            autoComplete="off"
            value={input.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
            required
          />

          <InputBox
            label="Email Address"
            name="signupEmail"
            type="email"
            autoComplete="new-password"
            value={input.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
            required
          />

          <PasswordBox
            label="Password"
            name="signupPassword"
            show={showPass}
            toggle={() => setShowPass(!showPass)}
            value={input.password}
            onChange={(e) => setInput({ ...input, password: e.target.value })}
            required
            autoComplete="new-password"
          />

          {/* CREATE ACCOUNT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 shadow-md disabled:bg-pink-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-200" />
          <span className="mx-4 text-sm text-gray-500 font-medium">OR</span>
          <hr className="flex-grow border-gray-200" />
        </div>

        {/* GOOGLE SIGNUP BUTTON */}
        <button
          onClick={googleSignup}
          disabled={isLoading}
          className="w-full border border-gray-300 py-3 rounded-lg flex justify-center items-center gap-3 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-60"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          Sign up with Google
        </button>

        {/* SIGNIN LINK */}
        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?
          <Link
            to="/signin"
            className="text-pink-600 font-semibold ml-1 hover:text-pink-700"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

/* INPUT BOX */
function InputBox({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
      />
    </div>
  );
}

/* PASSWORD FIELD */
function PasswordBox({ label, show, toggle, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...props}
          className="w-full p-3 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

