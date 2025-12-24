import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/messageSlice";
import dp from "../assets/dp.webp";

function RightHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData, following } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  const { prevChatUsers } = useSelector((state) => state.message);

  const followingUsers = Array.isArray(following) ? following : [];
  const onlineFollowing = followingUsers.filter((u) =>
    onlineUsers?.includes(u._id)
  );

  return (
    <aside className="hidden lg:flex w-full max-w-[320px] h-screen bg-white/90 border-l border-gray-200 backdrop-blur-xl flex flex-col px-5 py-6 gap-6 shadow-sm">
      {/* Current user */}
      <div
        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors"
        onClick={() => navigate(`/profile/${userData?.userName}`)}
      >
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 shadow-sm">
          <img
            src={userData?.profileImage || dp}
            alt={userData?.userName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-gray-900 font-semibold text-sm">
            {userData?.userName}
          </span>
          <span className="text-gray-600 text-xs">
            {userData?.name || "View profile"}
          </span>
        </div>
      </div>

      {/* Online following */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-900 text-sm font-semibold">
            Online now
          </h2>
          {onlineFollowing.length > 0 && (
            <button
              type="button"
              onClick={() => navigate("/messages")}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Open messages
            </button>
          )}
        </div>

        {onlineFollowing.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No one you follow is online right now.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {onlineFollowing.slice(0, 6).map((user) => (
              <button
                key={user._id}
                type="button"
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  navigate("/messageArea");
                }}
                className="flex-shrink-0 hover:scale-105 transition-transform"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="relative w-12 h-12 rounded-full border-2 border-green-200 bg-gray-100 shadow-md overflow-hidden">
                    <img
                      src={user.profileImage || dp}
                      alt={user.userName}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                  </div>
                  <span className="max-w-[80px] text-xs text-gray-700 font-medium truncate text-center">
                    {user.userName}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recent chats */}
      {prevChatUsers?.length > 0 && (
        <div>
          <h2 className="text-gray-900 text-sm font-semibold mb-3">
            Recent chats
          </h2>
          <div className="flex flex-col gap-2">
            {prevChatUsers.slice(0, 4).map((user) => (
              <button
                key={user._id}
                type="button"
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  navigate("/messageArea");
                }}
                className="flex items-center gap-3 text-left hover:bg-gray-50 rounded-xl px-3 py-2.5 transition-all shadow-sm"
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
                  <img
                    src={user.profileImage || dp}
                    alt={user.userName}
                    className="w-full h-full object-cover"
                  />
                  {onlineUsers?.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-900 font-medium">
                    {user.userName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-auto flex flex-col gap-2 text-sm text-gray-600 pb-2">
        <button
          type="button"
          className="text-left hover:text-gray-900 font-medium hover:bg-gray-50 p-2 rounded-lg transition-colors"
          onClick={() => navigate("/loops")}
        >
          Explore Loops
        </button>
        <button
          type="button"
          className="text-left hover:text-gray-900 font-medium hover:bg-gray-50 p-2 rounded-lg transition-colors"
          onClick={() => navigate("/messages")}
        >
          Open Messages
        </button>
      </div>
    </aside>
  );
}

export default RightHome;
