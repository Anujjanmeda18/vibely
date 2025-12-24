import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import NotificationCard from "../components/NotifiactionCard.jsx";
import axios from "axios";
import { serverUrl } from "../App";
import { setNotificationData } from "../redux/userSlice";

function Notification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notificationData } = useSelector((state) => state.user);

  const fetchNotifications = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getAllNotifications`,
        { withCredentials: true }
      );
      dispatch(setNotificationData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  const markAsRead = async () => {
    if (!notificationData || notificationData.length === 0) return;

    const unreadIds = notificationData
      .filter((n) => n.isRead === false)
      .map((n) => n._id);

    if (unreadIds.length === 0) return;

    try {
      await axios.post(
        `${serverUrl}/api/user/markAsRead`,
        { notificationId: unreadIds },
        { withCredentials: true }
      );
      await fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    markAsRead();
  }, [notificationData]);

  const hasNotifications = Array.isArray(notificationData) && notificationData.length > 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="w-full h-[70px] flex items-center gap-3 px-4 sm:px-6 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center justify-center rounded-full p-1.5 hover:bg-slate-100 transition-colors"
        >
          <MdOutlineKeyboardBackspace className="text-slate-700 w-[24px] h-[24px]" />
        </button>
        <h1 className="text-slate-900 text-[20px] sm:text-[22px] font-semibold tracking-wide">
          Notifications
        </h1>
      </header>

      {/* Content */}
      <main className="flex-1 w-full">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 flex flex-col gap-3">
          {hasNotifications ? (
            notificationData.map((noti) => (
              <div
                key={noti._id}
                className="bg-white/95 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow px-3.5 py-3"
              >
                <NotificationCard noti={noti} />
              </div>
            ))
          ) : (
            <div className="w-full mt-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                <span className="text-2xl">🔔</span>
              </div>
              <p className="text-slate-900 text-[18px] font-semibold">
                No notifications yet
              </p>
              <p className="text-slate-500 text-[13px] mt-1 max-w-sm mx-auto">
                When someone likes, comments, or follows you, the updates will appear here.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Notification;
