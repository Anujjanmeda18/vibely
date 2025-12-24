import React, { useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { HiSparkles } from "react-icons/hi2";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignIn() {
  const [focused, setFocused] = useState({
    userName: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const isFormValid = userName.trim().length > 0 && password.trim().length > 0;

  const handleSignIn = async () => {
    if (!isFormValid || loading) return;

    setLoading(true);
    setErr("");
    setSuccess("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { userName, password },
        { withCredentials: true }
      );

      setSuccess("Signed in successfully!");
      dispatch(setUserData(result.data));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setErr(error.response?.data?.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-32 left-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20" />
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
                Welcome back
              </h1>
              <p className="text-sm text-gray-600">
                Sign in to continue to your account
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-5 mt-4">
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
                placeholder="Enter your username"
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
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  onFocus={() =>
                    setFocused((prev) => ({ ...prev, password: true }))
                  }
                  onBlur={() =>
                    setFocused((prev) => ({ ...prev, password: false }))
                  }
                  autoComplete="current-password"
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
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
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
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              className={`w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center transition-all shadow-md ${
                isFormValid && !loading
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleSignIn}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : (
                "Sign in"
              )}
            </button>

            {/* Sign Up Link */}
            <p className="text-sm text-gray-600 text-center mt-2">
              Don't have an account?{" "}
              <button
                type="button"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Right panel - Hero (simplified) */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden items-center justify-center p-12">
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-md text-center">
            <HiSparkles className="w-20 h-20 text-blue-600" />
            <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
              VIBELY
            </span>

            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />

            <h2 className="text-3xl font-bold text-gray-900">
              Your Social Universe
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-sm">
              Log in to catch up with your friends, explore new content, and stay in sync across all your devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
