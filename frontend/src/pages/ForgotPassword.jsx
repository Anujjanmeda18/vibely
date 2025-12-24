import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const PASSWORD_STRENGTH = {
  0: { label: "Weak", color: "bg-red-500" },
  1: { label: "Weak", color: "bg-orange-500" },
  2: { label: "Fair", color: "bg-yellow-500" },
  3: { label: "Good", color: "bg-emerald-500" },
  4: { label: "Strong", color: "bg-emerald-600" },
};

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const updateFormField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleStep1 = async () => {
    if (!formData.email.trim()) {
      setErrors({ email: "Email is required." });
      return;
    }
    if (!validateEmail(formData.email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess("");

    try {
      await axios.post(
        `${serverUrl}/api/auth/sendOtp`,
        { email: formData.email },
        { withCredentials: true }
      );
      setStep(2);
      setSuccess("OTP sent to your email. Check your inbox (and spam folder).");
    } catch (error) {
      setErrors({
        email:
          error.response?.data?.message || "Failed to send OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async () => {
    if (!formData.otp.trim()) {
      setErrors({ otp: "OTP is required." });
      return;
    }
    if (formData.otp.length < 4) {
      setErrors({ otp: "OTP must be 4 digits." });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess("");

    try {
      await axios.post(
        `${serverUrl}/api/auth/verifyOtp`,
        { email: formData.email, otp: formData.otp },
        { withCredentials: true }
      );
      setStep(3);
      setSuccess("OTP verified successfully!");
    } catch (error) {
      setErrors({
        otp: error.response?.data?.message || "Invalid OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters.";
    } else if (passwordStrength < 3) {
      newErrors.newPassword = "Password is too weak. Use a stronger password.";
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Please confirm your password.";
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess("");

    try {
      await axios.post(
        `${serverUrl}/api/auth/resetPassword`,
        {
          email: formData.email,
          password: formData.newPassword,
        },
        { withCredentials: true }
      );

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message || "Failed to reset password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid =
    formData.email.trim().length > 0 && validateEmail(formData.email);
  const isStep2Valid = formData.otp.trim().length >= 4; // 4-digit OTP
  const isStep3Valid =
    formData.newPassword.trim().length >= 8 &&
    formData.confirmNewPassword.trim().length >= 8 &&
    formData.newPassword === formData.confirmNewPassword;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-3xl shadow-2xl px-8 py-10 flex flex-col gap-8 relative">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 top-6 p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <MdOutlineKeyboardBackspace className="w-5 h-5 text-slate-600" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center mt-4">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <span className="text-2xl">🔒</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider font-medium text-sky-500">
              Account Recovery
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Create New Password"}
            </h1>
            <p className="text-sm text-slate-500">Step {step} of 3</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>1</span>
            <span>2</span>
            <span>3</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 shadow-lg rounded-full transition-all duration-500 ease-out"
              style={{
                width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
              }}
            />
          </div>
        </div>

        {/* Step 1: email */}
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Enter your email address and we&apos;ll send you a one-time
              passcode to reset your password.
            </p>

            <div className="space-y-2">
              <div className="w-full space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-colors"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => updateFormField("email", e.target.value)}
                  autoComplete="email"
                />
              </div>

              {errors.email && (
                <p className="flex items-center gap-2 text-sm text-red-600 bg-red-100 px-3 py-2 rounded-xl">
                  <span>⚠️</span> {errors.email}
                </p>
              )}
            </div>

            <button
              className={`w-full h-14 rounded-3xl font-semibold text-lg flex items-center justify-center transition-all duration-300 shadow-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white hover:from-sky-400 hover:to-cyan-300 hover:shadow-2xl hover:scale-[1.02] ${
                (!isStep1Valid || loading) &&
                "opacity-60 cursor-not-allowed hover:shadow-lg hover:scale-100 bg-slate-200 from-slate-300 to-slate-300"
              }`}
              disabled={!isStep1Valid || loading}
              onClick={handleStep1}
            >
              {loading ? <ClipLoader size={28} color="#ffffff" /> : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2: OTP (4 digits) */}
        {step === 2 && (
          <div className="space-y-6">
            <p className="text-sm text-slate-600">
              We&apos;ve sent a 4-digit code to{" "}
              <span className="font-semibold text-slate-900">
                {formData.email}
              </span>
              .
            </p>

            <div className="space-y-2">
              <div
                className={`relative h-14 rounded-2xl border-2 transition-all duration-200 ${
                  errors.otp
                    ? "border-red-400 bg-red-50/50 shadow-red-200"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <label className="absolute left-4 -top-3 px-2 text-xs font-medium text-sky-600 bg-white">
                  Enter 4-digit OTP
                </label>
                <input
                  type="text"
                  maxLength={4}
                  className="w-full h-full bg-transparent px-4 pt-4 pb-2 text-center text-2xl font-mono text-slate-900 outline-none rounded-2xl tracking-[0.4em]"
                  value={formData.otp}
                  onChange={(e) =>
                    updateFormField("otp", e.target.value.replace(/\D/g, ""))
                  }
                  autoComplete="one-time-code"
                />
              </div>
              {errors.otp && (
                <p className="flex items-center gap-2 text-sm text-red-600 bg-red-100 px-3 py-2 rounded-xl">
                  <span>⚠️</span> {errors.otp}
                </p>
              )}
            </div>

            <button
              className={`w-full h-14 rounded-3xl font-semibold text-lg flex items-center justify-center transition-all duration-300 shadow-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white hover:from-sky-400 hover:to-cyan-300 hover:shadow-2xl hover:scale-[1.02] ${
                (!isStep2Valid || loading) &&
                "opacity-60 cursor-not-allowed hover:shadow-lg hover:scale-100 bg-slate-200 from-slate-300 to-slate-300"
              }`}
              disabled={!isStep2Valid || loading}
              onClick={handleStep2}
            >
              {loading ? <ClipLoader size={28} color="#ffffff" /> : "Verify OTP"}
            </button>
          </div>
        )}

        {/* Step 3: new password */}
        {step === 3 && (
          <div className="space-y-6">
            <p className="text-sm text-slate-600">
              Choose a strong password for your account.
            </p>

            <div className="space-y-4">
              {/* New password */}
              <div>
                <div
                  className={`relative h-14 rounded-2xl border-2 transition-all duration-200 ${
                    errors.newPassword
                      ? "border-red-400 bg-red-50/50 shadow-red-200"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <label className="absolute left-4 -top-3 px-2 text-xs font-medium text-sky-600 bg-white">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full h-full bg-transparent px-4 pt-4 pb-2 text-slate-900 text-base outline-none rounded-2xl"
                    value={formData.newPassword}
                    onChange={(e) => {
                      updateFormField("newPassword", e.target.value);
                      setPasswordStrength(
                        getPasswordStrength(e.target.value)
                      );
                    }}
                    autoComplete="new-password"
                  />
                </div>

                {formData.newPassword && (
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-20 h-1.5 rounded-full overflow-hidden shadow-sm ${
                          PASSWORD_STRENGTH[passwordStrength]?.color
                        }`}
                      >
                        <div
                          className="h-full rounded-full bg-current transition-all duration-300"
                          style={{
                            width: `${(passwordStrength + 1) * 20}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600">
                        {PASSWORD_STRENGTH[passwordStrength]?.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                      <span
                        className={
                          formData.newPassword.length >= 8
                            ? "text-emerald-500 font-medium"
                            : ""
                        }
                      >
                        8+ chars
                      </span>
                      <span
                        className={
                          /[a-z]/.test(formData.newPassword)
                            ? "text-emerald-500 font-medium"
                            : ""
                        }
                      >
                        lowercase
                      </span>
                      <span
                        className={
                          /[A-Z]/.test(formData.newPassword)
                            ? "text-emerald-500 font-medium"
                            : ""
                        }
                      >
                        UPPER
                      </span>
                      <span
                        className={
                          /[0-9]/.test(formData.newPassword)
                            ? "text-emerald-500 font-medium"
                            : ""
                        }
                      >
                        digit
                      </span>
                      <span
                        className={
                          /[^A-Za-z0-9]/.test(formData.newPassword)
                            ? "text-emerald-500 font-medium"
                            : ""
                        }
                      >
                        symbol
                      </span>
                    </div>
                  </div>
                )}

                {errors.newPassword && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-100 px-3 py-2 rounded-xl">
                    <span>⚠️</span> {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <div
                  className={`relative h-14 rounded-2xl border-2 transition-all duration-200 ${
                    errors.confirmNewPassword
                      ? "border-red-400 bg-red-50/50 shadow-red-200"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <label className="absolute left-4 -top-3 px-2 text-xs font-medium text-sky-600 bg-white">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full h-full bg-transparent px-4 pt-4 pb-2 text-slate-900 text-base outline-none rounded-2xl"
                    value={formData.confirmNewPassword}
                    onChange={(e) =>
                      updateFormField("confirmNewPassword", e.target.value)
                    }
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmNewPassword && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-100 px-3 py-2 rounded-xl">
                    <span>⚠️</span> {errors.confirmNewPassword}
                  </p>
                )}
              </div>
            </div>

            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex items-center gap-2">
                <span>⚠️</span> {errors.submit}
              </div>
            )}
            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-700 flex items-center gap-2">
                <span>✅</span> {success}
              </div>
            )}

            <button
              className={`w-full h-14 rounded-3xl font-semibold text-lg flex items-center justify-center transition-all duration-300 shadow-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white hover:from-sky-400 hover:to-cyan-300 hover:shadow-2xl hover:scale-[1.02] ${
                (!isStep3Valid || loading) &&
                "opacity-60 cursor-not-allowed hover:shadow-lg hover:scale-100 bg-slate-200 from-slate-300 to-slate-300"
              }`}
              disabled={!isStep3Valid || loading}
              onClick={handleStep3}
            >
              {loading ? (
                <ClipLoader size={28} color="#ffffff" />
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        )}

        {success && step < 3 && (
          <p className="text-xs text-center text-slate-500 pt-2">
            Did not receive the code? Check spam or{" "}
            <button
              onClick={() => {
                setStep(1);
                setSuccess("");
              }}
              className="text-sky-500 hover:text-sky-600 font-medium underline"
            >
              resend
            </button>
            .
          </p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
