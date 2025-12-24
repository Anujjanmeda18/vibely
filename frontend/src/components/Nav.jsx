import React from "react";
import { GoHomeFill } from "react-icons/go";
import { FiSearch, FiPlusSquare } from "react-icons/fi";
import { RxVideo } from "react-icons/rx";
import dp from "../assets/dp.webp";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useSelector((state) => state.user);

  const currentPath = location.pathname;
  const profilePath = `/profile/${userData?.userName || ""}`;

  const isActive = (path) =>
    currentPath === path || (path !== "/" && currentPath.startsWith(path));

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div
        className="
          fixed
          bottom-4
          left-1/2
          -translate-x-1/2
          z-[100]
          h-[64px]
          w-[92%]
          max-w-md
          bg-white/90
          flex
          justify-around
          items-center
          rounded-full
          border border-gray-200
          shadow-[0_10px_30px_rgba(15,23,42,0.12)]
          backdrop-blur-md
          lg:hidden
          before:content-['']
          before:absolute
          before:-z-10
          before:inset-x-6
          before:bottom-0
          before:h-4
          before:bg-gradient-to-r
          before:from-blue-500/10
          before:via-purple-500/10
          before:to-blue-500/10
          before:blur-xl
        "
      >
        {/* Home */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className={`
            flex flex-col items-center justify-center gap-0.5 flex-1 cursor-pointer
            transition-transform duration-150
            ${isActive("/") ? "scale-[1.03]" : "scale-100"}
          `}
        >
          <GoHomeFill
            className={`w-[22px] h-[22px] ${
              isActive("/") ? "text-blue-600" : "text-gray-600"
            }`}
          />
          <span
            className={`text-[11px] ${
              isActive("/") ? "text-blue-600 font-medium" : "text-gray-500"
            }`}
          >
            Home
          </span>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={() => navigate("/search")}
          className={`
            flex flex-col items-center justify-center gap-0.5 flex-1 cursor-pointer
            transition-transform duration-150
            ${isActive("/search") ? "scale-[1.03]" : "scale-100"}
          `}
        >
          <FiSearch
            className={`w-[22px] h-[22px] ${
              isActive("/search") ? "text-blue-600" : "text-gray-600"
            }`}
          />
          <span
            className={`text-[11px] ${
              isActive("/search")
                ? "text-blue-600 font-medium"
                : "text-gray-500"
            }`}
          >
            Search
          </span>
        </button>

        {/* Upload */}
        <button
          type="button"
          onClick={() => navigate("/upload")}
          className="flex items-center justify-center flex-1 cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all">
            <FiPlusSquare className="w-[22px] h-[22px] text-white" />
          </div>
        </button>

        {/* Loops */}
        <button
          type="button"
          onClick={() => navigate("/loops")}
          className={`
            flex flex-col items-center justify-center gap-0.5 flex-1 cursor-pointer
            transition-transform duration-150
            ${isActive("/loops") ? "scale-[1.03]" : "scale-100"}
          `}
        >
          <RxVideo
            className={`w-[22px] h-[22px] ${
              isActive("/loops") ? "text-blue-600" : "text-gray-600"
            }`}
          />
          <span
            className={`text-[11px] ${
              isActive("/loops")
                ? "text-blue-600 font-medium"
                : "text-gray-500"
            }`}
          >
            Loops
          </span>
        </button>

        {/* Profile */}
        <button
          type="button"
          className={`
            flex flex-col items-center justify-center gap-0.5 flex-1 cursor-pointer
            transition-transform duration-150
            ${isActive(profilePath) ? "scale-[1.03]" : "scale-100"}
          `}
          onClick={() => navigate(profilePath)}
        >
          <div
            className={`
              w-8 h-8 rounded-full overflow-hidden border
              ${
                isActive(profilePath)
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-gray-300"
              }
            `}
          >
            <img
              src={userData?.profileImage || dp}
              alt={userData?.userName}
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className={`text-[11px] ${
              isActive(profilePath)
                ? "text-blue-600 font-medium"
                : "text-gray-500"
            }`}
          >
            Profile
          </span>
        </button>
      </div>

      {/* Desktop Horizontal Navigation */}
      <div className="hidden lg:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] h-[70px] w-auto bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 shadow-[0_10px_40px_rgba(15,23,42,0.15)] px-8">
        <div className="flex items-center gap-8">
          {/* Home */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className={`
              flex flex-col items-center justify-center gap-1 cursor-pointer
              transition-all duration-200 hover:scale-105
              ${isActive("/") ? "scale-105" : "scale-100"}
            `}
          >
            <GoHomeFill
              className={`w-6 h-6 ${
                isActive("/") ? "text-blue-600" : "text-gray-600"
              }`}
            />
            <span
              className={`text-xs ${
                isActive("/") ? "text-blue-600 font-medium" : "text-gray-500"
              }`}
            >
              Home
            </span>
          </button>

          {/* Search */}
          <button
            type="button"
            onClick={() => navigate("/search")}
            className={`
              flex flex-col items-center justify-center gap-1 cursor-pointer
              transition-all duration-200 hover:scale-105
              ${isActive("/search") ? "scale-105" : "scale-100"}
            `}
          >
            <FiSearch
              className={`w-6 h-6 ${
                isActive("/search") ? "text-blue-600" : "text-gray-600"
              }`}
            />
            <span
              className={`text-xs ${
                isActive("/search")
                  ? "text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              Search
            </span>
          </button>

          {/* Upload */}
          <button
            type="button"
            onClick={() => navigate("/upload")}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 hover:scale-105"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all">
              <FiPlusSquare className="w-6 h-6 text-white" />
            </div>
          </button>

          {/* Loops */}
          <button
            type="button"
            onClick={() => navigate("/loops")}
            className={`
              flex flex-col items-center justify-center gap-1 cursor-pointer
              transition-all duration-200 hover:scale-105
              ${isActive("/loops") ? "scale-105" : "scale-100"}
            `}
          >
            <RxVideo
              className={`w-6 h-6 ${
                isActive("/loops") ? "text-blue-600" : "text-gray-600"
              }`}
            />
            <span
              className={`text-xs ${
                isActive("/loops")
                  ? "text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              Loops
            </span>
          </button>

          {/* Profile */}
          <button
            type="button"
            className={`
              flex flex-col items-center justify-center gap-1 cursor-pointer
              transition-all duration-200 hover:scale-105
              ${isActive(profilePath) ? "scale-105" : "scale-100"}
            `}
            onClick={() => navigate(profilePath)}
          >
            <div
              className={`
                w-9 h-9 rounded-full overflow-hidden border-2
                ${
                  isActive(profilePath)
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-gray-300"
                }
              `}
            >
              <img
                src={userData?.profileImage || dp}
                alt={userData?.userName}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`text-xs ${
                isActive(profilePath)
                  ? "text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              Profile
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Nav;
