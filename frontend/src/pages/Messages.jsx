import React from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/messageSlice";
import dp from "../assets/dp.webp";
import OnlineUser from "../components/onlineUser.jsx";

function Messages() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { prevChatUsers } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);

  const handleOpenChat = (user) => {
    dispatch(setSelectedUser(user));
    navigate("/messageArea");
  };

  const following = Array.isArray(userData?.following) ? userData.following : [];
  const onlineFollowing = following.filter((u) => onlineUsers?.includes(u._id));

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Top bar */}
      <header className="w-full h-[70px] flex items-center gap-3 px-4 sm:px-6 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center justify-center rounded-full p-1.5 hover:bg-slate-100 transition-colors"
        >
          <MdOutlineKeyboardBackspace className="text-slate-700 w-[24px] h-[24px]" />
        </button>
        <h1 className="text-slate-900 text-[20px] sm:text-[22px] font-semibold tracking-wide">
          Messages
        </h1>
      </header>

      {/* Online users row */}
      {onlineFollowing.length > 0 && (
        <section className="w-full border-b border-slate-200 bg-white/90">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-700 font-medium">
                Online now
              </span>
              <span className="text-[11px] text-slate-500">
                {onlineFollowing.length} online
              </span>
            </div>

            <div className="w-full flex items-center gap-3 overflow-x-auto pb-1">
              {onlineFollowing.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => handleOpenChat(user)}
                  className="flex-shrink-0"
                >
                  <OnlineUser user={user} />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chats list */}
      <main className="w-full flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 pt-4 pb-6 flex flex-col gap-3">
          {(!prevChatUsers || prevChatUsers.length === 0) && (
            <div className="mt-10 mx-auto max-w-sm text-center">
              <p className="text-slate-900 text-[15px] font-semibold">
                No conversations yet
              </p>
              <p className="text-slate-500 text-[13px] mt-1">
                Start a chat from someone&apos;s profile or your feed.
              </p>
            </div>
          )}

          {prevChatUsers?.map((user) => {
            const isOnline = onlineUsers?.includes(user._id);

            return (
              <button
                key={user._id}
                type="button"
                onClick={() => handleOpenChat(user)}
                className="w-full flex items-center gap-3 text-left bg-white/90 hover:bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 transition-colors shadow-sm hover:shadow-md"
              >
                <div className="relative w-[48px] h-[48px] rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={user.profileImage || dp}
                    alt={user.userName}
                    className="w-full h-full object-cover"
                  />
                  {isOnline && (
                    <span className="absolute bottom-[0px] right-[0px] w-[13px] h-[13px] rounded-full bg-emerald-400 border-[3px] border-white shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  )}
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-slate-900 text-[15px] font-semibold truncate">
                    {user.userName}
                  </span>
                  <span className="text-slate-500 text-[13px] truncate">
                    {user.name || "Tap to open chat"}
                  </span>
                  <span className="text-slate-400 text-[11px] mt-[2px]">
                    Last message · just now
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Messages;
