// src/components/OtherUser.jsx
import React from "react";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";

function OtherUser({ user, reason = "Suggested for you" }) {
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div
      className="
        w-full flex items-center justify-between gap-3 py-2 px-2
        rounded-xl cursor-pointer
        hover:bg-gray-50
        transition-colors
      "
      onClick={() => navigate(`/profile/${user.userName}`)}
    >
      <div className="flex items-center gap-3">
        <div
          className="
            w-10 h-10 rounded-full overflow-hidden
            border border-gray-200 bg-gray-100
            shadow-sm
            transition-transform duration-150
            group-hover:scale-105
          "
        >
          <img
            src={user.profileImage || dp}
            alt={user.userName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
            {user.userName}
          </span>
          {user.name && (
            <span className="text-xs text-gray-600 truncate max-w-[150px]">
              {user.name}
            </span>
          )}
          <span className="text-[10px] text-blue-500 mt-0.5">
            {reason}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OtherUser;
