import React, { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import OtherUser from "./OtherUser";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";

function LeftHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, suggestedUsers, notificationData } = useSelector(
    (state) => state.user
  );
  const [loadingLogout, setLoadingLogout] = useState(false);

  const handleLogOut = async () => {
    if (loadingLogout) return;
    try {
      setLoadingLogout(true);
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingLogout(false);
    }
  };

  if (!userData) return null;

  const hasUnread =
    notificationData &&
    notificationData.length > 0 &&
    notificationData.some((n) => n.isRead === false);

  return (
    <aside className="hidden lg:flex w-full h-screen bg-white/90 border-r border-gray-200 backdrop-blur-xl flex flex-col shadow-sm">
      {/* Top: header + notification icon */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
            Welcome
          </span>
          <span className="text-sm text-gray-900 font-medium">
            Curate your <span className="text-blue-600">vibe</span>.
          </span>
        </div>

        {/* Notification icon */}
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md"
        >
          <FaRegBell className="w-4 h-4 text-gray-600" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
          )}
        </button>
      </div>

      {/* Current user card */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-100 bg-gray-100 shadow-md">
              <img
                src={userData.profileImage || dp}
                alt={userData.userName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                {userData.userName}
              </span>
              <span className="text-xs text-gray-600 truncate max-w-[150px]">
                {userData.name}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogOut}
            disabled={loadingLogout}
            className="text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-xl shadow-sm hover:shadow-md hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loadingLogout ? "Logging out..." : "Log out"}
          </button>
        </div>
      </div>

      {/* Suggested users */}
      <div className="flex-1 px-6 py-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-900">
            Suggested for you
          </span>
          <span className="text-xs text-gray-500 font-medium">Personalized</span>
        </div>

        {suggestedUsers && suggestedUsers.length > 0 ? (
          <div className="flex flex-col gap-3">
            {suggestedUsers.slice(0, 4).map((user) => (
              <OtherUser key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-4">
            Start following people to see curated suggestions here.
          </p>
        )}
      </div>

      {/* Bottom small copy */}
      <div className="px-6 py-4 border-t border-gray-100 text-xs text-gray-500 bg-gray-50">
        <p className="leading-relaxed">
          Log back in to sync across devices, pick up ongoing sessions, and stay
          in tune with what matters to you.
        </p>
      </div>
    </aside>
  );
}

export default LeftHome;
