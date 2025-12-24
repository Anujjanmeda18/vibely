import React from "react";
import dp from "../assets/dp.webp";

function OnlineUser({ user, size = 56, subtitle }) {
  if (!user) return null;

  return (
    <div className="flex flex-col items-center gap-1 mr-3 cursor-pointer group">
      <div
        className="
          relative rounded-full overflow-hidden
          bg-gradient-to-tr from-green-100 via-white to-blue-50
          p-[2px]
          shadow-[0_4px_12px_rgba(15,23,42,0.16)]
          transition-transform duration-200
          group-hover:-translate-y-[1px] group-hover:shadow-[0_8px_18px_rgba(15,23,42,0.22)]
        "
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
          <img
            src={user?.profileImage || dp}
            alt={user?.userName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* green online dot */}
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
      </div>

      <span className="max-w-[72px] text-[11px] text-gray-800 truncate text-center">
        {user?.userName}
      </span>

      {subtitle && (
        <span className="text-[10px] text-gray-400 truncate max-w-[72px] text-center">
          {subtitle}
        </span>
      )}
    </div>
  );
}

export default OnlineUser;
