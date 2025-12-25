import React, { useEffect } from "react";
import logo from "../assets/logo.png";
import { FaRegBell } from "react-icons/fa";
import { BiMessageAltDetail } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import StoryDp from "./StoryDp";
import Nav from "./Nav";
import Post from "./Post";
import axios from "axios";
import { serverUrl } from "../App";
import { setPostData } from "../redux/postSlice";
import { setStoryData, setCurrentUserStory } from "../redux/storySlice";
import { setNotificationData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

// Fisher–Yates shuffle
function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function Feed() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, notificationData } = useSelector((state) => state.user);
  const { storyData, currentUserStory } = useSelector((state) => state.story);
  const { postData } = useSelector((state) => state.post);
  const socket = useSelector((state) => state.socket?.socket);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/post/getAll`, {
          withCredentials: true,
        });
        const shuffled = shuffleArray(res.data);
        dispatch(setPostData(shuffled));
      } catch (err) {
        console.log("fetch posts error", err);
      }
    };

    fetchPosts();
  }, [dispatch]);

  // Fetch stories
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/story/getAll`, {
          withCredentials: true,
        });

        dispatch(
          setStoryData({
            allStories: res.data.allStories || [],
          })
        );
        if (res.data.currentUserStory) {
          dispatch(setCurrentUserStory(res.data.currentUserStory));
        }
      } catch (err) {
        console.log("fetch stories error", err);
      }
    };

    fetchStories();
  }, [dispatch]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/user/getAllNotifications`,
          { withCredentials: true }
        );
        dispatch(setNotificationData(res.data));
      } catch (err) {
        console.log("fetch notifications error", err);
      }
    };

    fetchNotifications();
  }, [dispatch]);

  // Real-time socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleLikedPost = (data) => {
      const { postId, likes } = data;
      if (!Array.isArray(likes)) return;

      dispatch(
        setPostData(
          (postData || []).map((p) => (p._id === postId ? { ...p, likes } : p))
        )
      );
    };

    const handleCommentedPost = (data) => {
      const { postId, comments } = data;
      if (!Array.isArray(comments)) return;

      dispatch(
        setPostData(
          (postData || []).map((p) =>
            p._id === postId ? { ...p, comments } : p
          )
        )
      );
    };

    const handleNewNotification = (notification) => {
      dispatch(
        setNotificationData([notification, ...(notificationData || [])])
      );
    };

    socket.on("likedPost", handleLikedPost);
    socket.on("commentedPost", handleCommentedPost);
    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("likedPost", handleLikedPost);
      socket.off("commentedPost", handleCommentedPost);
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket, postData, notificationData, dispatch]);

  const hasUnread =
    Array.isArray(notificationData) &&
    notificationData.length > 0 &&
    notificationData.some((n) => n.isRead === false);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative text-slate-900">
      {/* Mobile top bar - ONLY SHOWS ON MOBILE */}
      {/* Mobile top bar - ONLY SHOWS ON MOBILE */}
      <div className="w-full h-[70px] flex items-center justify-between px-5 lg:hidden bg-white border-b border-slate-200 sticky top-0 z-40">
        {/* Left: Welcome text */}
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-blue-600 uppercase tracking-wide">
            Welcome
          </span>
          <span className="text-xs text-gray-900 font-medium">
            Curate your <span className="text-blue-600">vibe</span>.
          </span>
        </div>

        {/* Right: Notification + Message icons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/notifications")}
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-slate-900 text-white"
          >
            <FaRegBell className="w-5 h-5" />
            {hasUnread && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
            )}
          </button>
          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-900 text-white"
            onClick={() => navigate("/messages")}
          >
            <BiMessageAltDetail className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stories bar */}
      <div className="w-full bg-white border-b border-slate-200">
        <div className="flex w-full justify-start overflow-x-auto gap-4 items-center px-5 pb-4 pt-3">
          {userData && (
            <StoryDp
              userName="Your Story"
              ProfileImage={userData?.profileImage}
              story={currentUserStory || null}
            />
          )}

          {Array.isArray(storyData?.allStories) &&
            storyData.allStories
              .filter((story) => story.author?._id !== userData?._id)
              .map((story) => (
                <StoryDp
                  key={story._id}
                  userName={story.author?.userName}
                  ProfileImage={story.author?.profileImage}
                  story={story}
                />
              ))}
        </div>
      </div>

      {/* Feed content */}
      <div className="w-full min-h-[calc(100vh-140px)] flex flex-col items-center gap-5 px-2 sm:px-4 pt-6 bg-white relative pb-[100px] lg:pb-8">
        <Nav />

        <div className="w-full max-w-[720px] flex flex-col items-center gap-5 mt-2">
          {postData?.length === 0 && (
            <div className="w-full max-w-md mt-8 rounded-3xl bg-slate-900 text-slate-200 px-5 py-6 text-center shadow-[0_0_40px_rgba(15,23,42,0.5)]">
              <p className="text-sm font-semibold">No posts yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Follow people and create your first post to see the feed come
                alive.
              </p>
            </div>
          )}

          {postData?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;
