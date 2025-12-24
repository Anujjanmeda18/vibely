import React, { useRef, useState, useEffect } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import axios from "axios";
import { serverUrl } from "../App";
import { setProfileData, setUserData } from "../redux/userSlice";
import { ClipLoader } from "react-spinners";

const fieldsConfig = [
  { key: "name", label: "Name", placeholder: "Enter your name", required: true },
  { key: "userName", label: "Username", placeholder: "Choose a username", required: true },
  { key: "bio", label: "Bio", placeholder: "Tell people about yourself", multiline: true, maxLength: 150 },
  { key: "profession", label: "Profession", placeholder: "What do you do?" },
  { key: "gender", label: "Gender", placeholder: "Gender" },
];

function EditProfile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const imageInput = useRef(null);

  const [frontendImage, setFrontendImage] = useState(userData.profileImage || dp);
  const [backendImage, setBackendImage] = useState(null);
  const [formState, setFormState] = useState({
    name: userData.name || "",
    userName: userData.userName || "",
    bio: userData.bio || "",
    profession: userData.profession || "",
    gender: userData.gender || "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }
    
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setFormState((prev) => ({ ...prev, [key]: value }));
    
    if (touched[key]) {
      validateField(key, value);
    }
  };

  const validateField = (key, value = formState[key]) => {
    const newErrors = { ...errors };
    
    if (fieldsConfig.find(f => f.key === key)?.required && !value.trim()) {
      newErrors[key] = `${fieldsConfig.find(f => f.key === key).label} is required.`;
    } else if (key === "userName" && value.length < 3 && value.trim()) {
      newErrors[key] = "Username must be at least 3 characters.";
    } else if (key === "bio" && value.length > 150) {
      newErrors[key] = "Bio cannot exceed 150 characters.";
    } else {
      delete newErrors[key];
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    fieldsConfig.forEach(field => {
      if (field.required && !formState[field.key].trim()) {
        newErrors[field.key] = `${field.label} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    validateField(key);
  };

  const handleEditProfile = async () => {
    if (loading || !validateForm()) return;

    setLoading(true);
    setSubmitSuccess(false);
    
    try {
      const formdata = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        formdata.append(key, value.trim());
      });
      
      if (backendImage) {
        formdata.append("profileImage", backendImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/user/editProfile`,
        formdata,
        { withCredentials: true }
      );

      dispatch(setProfileData(result.data));
      dispatch(setUserData(result.data));
      
      setSubmitSuccess(true);
      setTimeout(() => {
        setLoading(false);
        navigate(`/profile/${result.data.userName}`);
      }, 1200);
      
    } catch (error) {
      console.error("Profile update failed:", error.response?.data || error);
      setLoading(false);
      setErrors({ submit: "Failed to update profile. Please try again." });
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center text-slate-900">
      {/* Header */}
      <header className="w-full h-[70px] flex items-center gap-3 px-4 sm:px-8 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-full p-1.5 hover:bg-slate-100 transition-all duration-200"
        >
          <MdOutlineKeyboardBackspace className="w-6 h-6 text-slate-700" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">Edit profile</h1>
          <span className="text-[11px] text-slate-500">Update your personal info</span>
        </div>
      </header>

      {/* Form card */}
      <main className="w-full flex justify-center px-3 sm:px-6 py-8">
        <div className={`
          w-full max-w-xl bg-white/90 
          border border-slate-200/50 
          rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)]
          backdrop-blur-2xl px-6 sm:px-8 py-8 flex flex-col items-center gap-6
          transition-all duration-300 hover:shadow-[0_25px_70px_rgba(0,0,0,0.15)]
        `}>
          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              className="relative group cursor-pointer"
              onClick={() => imageInput.current?.click()}
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-sky-200/50 bg-gradient-to-br from-slate-100 shadow-[0_0_25px_rgba(56,189,248,0.3)] transition-all duration-300 group-hover:scale-105">
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInput}
                  hidden
                  onChange={handleImage}
                />
                <img
                  src={frontendImage}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-xs px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">Change</span>
                </div>
              </div>
            </button>
            {backendImage && (
              <span className="text-xs text-emerald-600 font-medium">✓ Image selected</span>
            )}
          </div>

          {/* Inputs */}
          <div className="w-full flex flex-col gap-5">
            {fieldsConfig.map((field) => (
              <div key={field.key} className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.key === "bio" && (
                    <span className="text-xs text-slate-500">
                      {formState.bio.length}/{field.maxLength || "∞"}
                    </span>
                  )}
                </div>

                {field.multiline ? (
                  <textarea
                    rows={3}
                    className={`
                      w-full rounded-2xl bg-slate-50/80 
                      border-2 text-sm px-4 py-3 font-medium
                      text-slate-900 outline-none transition-all duration-200 resize-none
                      placeholder-slate-400
                      ${
                        errors[field.key]
                          ? "border-red-400/70 bg-red-50/50 shadow-sm ring-1 ring-red-400/30"
                          : touched[field.key]
                          ? "border-emerald-400/50 shadow-sm ring-1 ring-emerald-400/20"
                          : "border-slate-200/70 focus:border-sky-500/80 focus:ring-2 focus:ring-sky-500/30"
                      }
                    `}
                    placeholder={field.placeholder}
                    value={formState[field.key]}
                    onChange={handleChange(field.key)}
                    onBlur={() => handleBlur(field.key)}
                    maxLength={field.maxLength}
                  />
                ) : (
                  <input
                    type="text"
                    className={`
                      w-full h-12 rounded-2xl bg-slate-50/80 
                      border-2 text-sm px-4 font-medium
                      text-slate-900 outline-none transition-all duration-200
                      placeholder-slate-400
                      ${
                        errors[field.key]
                          ? "border-red-400/70 bg-red-50/50 shadow-sm ring-1 ring-red-400/30"
                          : touched[field.key]
                          ? "border-emerald-400/50 shadow-sm ring-1 ring-emerald-400/20"
                          : "border-slate-200/70 focus:border-sky-500/80 focus:ring-2 focus:ring-sky-500/30"
                      }
                    `}
                    placeholder={field.placeholder}
                    value={formState[field.key]}
                    onChange={handleChange(field.key)}
                    onBlur={() => handleBlur(field.key)}
                  />
                )}

                {errors[field.key] && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                    <span className="w-4 h-4">⚠️</span>
                    {errors[field.key]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="w-full p-3 bg-red-50/80 border border-red-200/50 rounded-2xl text-sm text-red-700">
              {errors.submit}
            </div>
          )}

          {/* Save button */}
          <button
            type="button"
            onClick={handleEditProfile}
            disabled={loading || hasErrors}
            className={`
              w-full max-w-sm h-14 rounded-3xl font-semibold text-lg flex items-center justify-center
              shadow-xl transition-all duration-300 relative overflow-hidden
              ${
                loading || hasErrors
                  ? "bg-slate-200/60 text-slate-400 cursor-not-allowed shadow-none"
                  : submitSuccess
                  ? "bg-emerald-500 text-white shadow-[0_0_35px_rgba(16,185,129,0.6)]"
                  : "bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 shadow-[0_0_35px_rgba(56,189,248,0.6)] hover:from-sky-400 hover:to-cyan-300 hover:shadow-[0_0_45px_rgba(56,189,248,0.8)] hover:scale-[1.02]"
              }
            `}
          >
            {loading ? (
              <ClipLoader size={28} color="#ffffff" />
            ) : submitSuccess ? (
              <>
                <span className="w-6 h-6">✅</span>
                Saved!
              </>
            ) : (
              "Save profile"
            )}
          </button>

          <p className="text-xs text-slate-500 text-center max-w-sm">
            Changes sync instantly across all devices
          </p>
        </div>
      </main>
    </div>
  );
}

export default EditProfile;
