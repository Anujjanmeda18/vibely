import React, { useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { HiSparkles, HiCheckCircle } from "react-icons/hi2";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignUp() {
  const [focused, setFocused] = useState({
    name: false,
    userName: false,
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const isFormValid =
    name.trim().length > 1 &&
    userName.trim().length > 2 &&
    /\S+@\S+\.\S+/.test(email) &&
    password.length >= 6;

  const handleSignUp = async () => {
    if (!isFormValid || loading) return;

    setLoading(true);
    setErr("");
    setSuccess("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, userName, email, password },
        { withCredentials: true }
      );

      setSuccess("Account created successfully!");
      dispatch(setUserData(result.data));
      setLoading(false);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong.");
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-32 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col lg:flex-row border border-gray-100">
        {/* Left panel - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col justify-center gap-6 relative z-10">
          {/* Logo & Brand */}
          <div className="flex flex-col gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <HiSparkles className="w-8 h-8 text-blue-600" />
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                  VIBELY
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold text-gray-900">
                Create your account
              </h1>
              <p className="text-sm text-gray-600">
                Join the community and start connecting
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4 mt-4">
            {/* Name Input */}
            <div className="relative">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className={`w-full h-12 px-4 bg-gray-50 border rounded-xl outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                  focused.name
                    ? "border-blue-500 bg-white ring-4 ring-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="Enter your full name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                onFocus={() =>
                  setFocused((prev) => ({ ...prev, name: true }))
                }
                onBlur={() =>
                  setFocused((prev) => ({ ...prev, name: false }))
                }
                autoComplete="name"
              />
            </div>

            {/* Username Input */}
            <div className="relative">
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="userName"
                className={`w-full h-12 px-4 bg-gray-50 border rounded-xl outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                  focused.userName
                    ? "border-blue-500 bg-white ring-4 ring-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="Choose a unique username"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
                onFocus={() =>
                  setFocused((prev) => ({ ...prev, userName: true }))
                }
                onBlur={() =>
                  setFocused((prev) => ({ ...prev, userName: false }))
                }
                autoComplete="username"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={`w-full h-12 px-4 bg-gray-50 border rounded-xl outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                  focused.email
                    ? "border-blue-500 bg-white ring-4 ring-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                onFocus={() =>
                  setFocused((prev) => ({ ...prev, email: true }))
                }
                onBlur={() =>
                  setFocused((prev) => ({ ...prev, email: false }))
                }
                autoComplete="email"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full h-12 px-4 pr-12 bg-gray-50 border rounded-xl outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                    focused.password
                      ? "border-blue-500 bg-white ring-4 ring-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Create a strong password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  onFocus={() =>
                    setFocused((prev) => ({ ...prev, password: true }))
                  }
                  onBlur={() =>
                    setFocused((prev) => ({ ...prev, password: false }))
                  }
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <IoIosEyeOff className="w-5 h-5" />
                  ) : (
                    <IoIosEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {password.length > 0 && (
                <p
                  className={`text-xs mt-2 ${
                    password.length >= 6 ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {password.length >= 6 ? "✓" : "○"} At least 6 characters
                </p>
              )}
            </div>

            {/* Error / Success Messages */}
            {err && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-800">{err}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-start gap-2">
                <HiCheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              className={`w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center transition-all shadow-md ${
                isFormValid && !loading
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleSignUp}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : (
                "Create account"
              )}
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Privacy Policy
              </button>
            </p>

            {/* Sign In Link */}
            <p className="text-sm text-gray-600 text-center mt-2">
              Already have an account?{" "}
              <button
                type="button"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                onClick={() => navigate("/signin")}
              >
                Sign in
              </button>
            </p>

            {/* Made by credit */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Made with ❤️ by{" "}
                <a
                  href="https://instagram.com/anuj_janmeda18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  @anuj_janmeda18
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right panel - Hero (Simplified) */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden items-center justify-center p-12">
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-md text-center">
            {/* Large Logo */}
            <HiSparkles className="w-20 h-20 text-purple-600" />
            <span className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
              VIBELY
            </span>

            {/* Divider */}
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />

            {/* Simple Text */}
            <h2 className="text-3xl font-bold text-gray-900">
              Start Your Journey
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-sm">
              Share moments, connect with friends, and discover amazing content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
