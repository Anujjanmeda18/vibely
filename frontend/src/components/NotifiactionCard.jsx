import React from "react";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";

function NotificationCard({ noti }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (noti.post && noti.post._id) {
      navigate(`/post/${noti.post._id}`);
    } else if (noti.type === "follow") {
      navigate(`/profile/${noti.sender.userName}`);
    }
  };

  const getNotificationText = () => {
    switch (noti.type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "follow":
        return "started following you";
      default:
        return noti.message || "";
    }
  };

  const getTypeLabel = () => {
    switch (noti.type) {
      case "like":
        return "Like";
      case "comment":
        return "Comment";
      case "follow":
        return "Follow";
      default:
        return "Activity";
    }
  };

  return (
    <div
      className={`
        w-full flex justify-between items-center p-3 sm:p-4 min-h-[70px]
        rounded-2xl cursor-pointer transition-all
        border
        ${
          noti.isRead
            ? "bg-white border-gray-200 hover:bg-gray-50"
            : "bg-blue-50 border-blue-100 hover:bg-blue-100/70"
        }
        shadow-sm hover:shadow-md
      `}
      onClick={handleClick}
    >
      <div className="flex gap-3 items-center flex-1">
        <div className="w-11 h-11 rounded-full border border-gray-200 overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={noti.sender?.profileImage || dp}
            alt={noti.sender?.userName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[14px] sm:text-[15px] text-gray-900 font-semibold truncate">
              {noti.sender?.userName}
            </span>
            <span className="text-[10px] px-2 py-[2px] rounded-full bg-blue-100 text-blue-700 font-medium">
              {getTypeLabel()}
            </span>
          </div>

          <span className="text-[13px] text-gray-600 truncate">
            {getNotificationText()}
          </span>

          <span className="text-[11px] text-gray-400 mt-0.5">
            {getTimeAgo(noti.createdAt)}
          </span>
        </div>
      </div>

      {/* Post thumbnail */}
      {noti.post && (
        <div className="w-11 h-11 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0 ml-3 transition-transform duration-150 hover:scale-[1.03]">
          {noti.post?.mediaType === "image" ? (
            <img
              src={noti.post?.media}
              alt="post"
              className="h-full w-full object-cover"
            />
          ) : (
            <video
              src={noti.post?.media}
              muted
              className="h-full w-full object-cover"
            />
          )}
        </div>
      )}

      {/* Unread indicator */}
      {!noti.isRead && (
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ml-2 shadow-[0_0_6px_rgba(37,99,235,0.7)]" />
      )}
    </div>
  );
}

// Helper function for time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";

  return "just now";
}

export default NotificationCard;
