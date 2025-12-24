import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import VideoPlayer from "../components/VideoPlayer";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { GoHeart, GoHeartFill, GoBookmarkFill } from "react-icons/go";
import { MdOutlineComment, MdOutlineBookmarkBorder } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import axios from "axios";
import { serverUrl } from "../App";
import { setPostData } from "../redux/postSlice";
import { setUserData } from "../redux/userSlice";
import { setLoopData } from "../redux/loopSlice";

function PostInDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { postData } = useSelector((state) => state.post);
  const { loopData } = useSelector((state) => state.loop);
  const { userData } = useSelector((state) => state.user);

  const [message, setMessage] = useState("");

  const post = useMemo(
    () => postData?.find((p) => p._id === postId),
    [postData, postId]
  );
  const loop = useMemo(
    () => loopData?.find((l) => l._id === postId),
    [loopData, postId]
  );

  const item = post || loop;

  if (!item) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <p className="text-slate-600 text-sm">Post not found.</p>
      </div>
    );
  }

  const isLoop = Boolean(loop && !post);

  const likes = Array.isArray(item.likes) ? item.likes : [];
  const comments = Array.isArray(item.comments) ? item.comments : [];
  const saved = Array.isArray(userData?.saved) ? userData.saved : [];

  const isLiked = likes.includes(userData?._id);
  const isSaved = !isLoop && saved.includes(item._id);

  const handleLike = async () => {
    try {
      if (isLoop) {
        const res = await axios.get(
          `${serverUrl}/api/loop/like/${item._id}`,
          { withCredentials: true }
        );
        const updatedLoop = res.data;
        const updatedLoops = (loopData || []).map((l) =>
          l._id === item._id ? updatedLoop : l
        );
        dispatch(setLoopData(updatedLoops));
      } else {
        const res = await axios.get(
          `${serverUrl}/api/post/like/${item._id}`,
          { withCredentials: true }
        );
        const updatedPost = res.data;
        const updatedPosts = (postData || []).map((p) =>
          p._id === item._id ? updatedPost : p
        );
        dispatch(setPostData(updatedPosts));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaved = async () => {
    if (isLoop) return;
    try {
      const res = await axios.get(
        `${serverUrl}/api/post/saved/${item._id}`,
        { withCredentials: true }
      );
      dispatch(setUserData(res.data));
    } catch (e) {
      console.log(e);
    }
  };

  const handleComment = async () => {
    if (!message.trim()) return;
    try {
      if (isLoop) {
        const res = await axios.post(
          `${serverUrl}/api/loop/comment/${item._id}`,
          { message },
          { withCredentials: true }
        );
        const updatedLoop = res.data;
        const updatedLoops = (loopData || []).map((l) =>
          l._id === item._id ? updatedLoop : l
        );
        dispatch(setLoopData(updatedLoops));
      } else {
        const res = await axios.post(
          `${serverUrl}/api/post/comment/${item._id}`,
          { message },
          { withCredentials: true }
        );
        const updatedPost = res.data;
        const updatedPosts = (postData || []).map((p) =>
          p._id === item._id ? updatedPost : p
        );
        dispatch(setPostData(updatedPosts));
      }
      setMessage("");
    } catch (e) {
      console.log(e?.response || e);
    }
  };

  const handleClose = () => navigate(-1);

  const createdAtLabel = item.createdAt
    ? new Date(item.createdAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Shell: full-screen on mobile, centered card on desktop */}
      <div
        className="relative z-10 w-full h-full lg:h-auto lg:w-auto flex items-center justify-center px-0 sm:px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full lg:h-auto lg:max-h-[95vh] lg:max-w-5xl bg-white rounded-none lg:rounded-3xl border border-slate-200 shadow-[0_24px_80px_rgba(15,23,42,0.35)] overflow-hidden flex flex-col lg:flex-row">
          {/* Media side */}
          <div className="relative w-full lg:flex-1 bg-slate-950 flex items-center justify-center">
            {/* top bar overlay for mobile */}
            <div className="absolute top-0 left-0 w-full flex items-center justify-between px-3 py-3 bg-gradient-to-b from-black/70 via-black/30 to-transparent lg:hidden">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-1.5 bg-black/50 border border-white/10"
              >
                <MdOutlineKeyboardBackspace className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/40 bg-slate-900">
                  <img
                    src={item.author?.profileImage || dp}
                    alt={item.author?.userName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-white">
                    {item.author?.userName}
                  </span>
                  {createdAtLabel && (
                    <span className="text-[10px] text-slate-200/80">
                      {createdAtLabel}
                    </span>
                  )}
                </div>
              </div>
              <span />
            </div>

            {item.mediaType === "image" ? (
              <img
                src={item.media}
                alt="media"
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <div className="max-w-[520px] w-full px-2 sm:px-4">
                  <VideoPlayer media={item.media} />
                </div>
              </div>
            )}
          </div>

          {/* Right / Bottom panel */}
          <div className="w-full lg:w-[360px] max-w-full lg:max-w-[45%] bg-white flex flex-col">
            {/* Header desktop */}
            <div className="hidden lg:flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={item.author?.profileImage || dp}
                    alt={item.author?.userName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">
                    {item.author?.userName}
                  </span>
                  {createdAtLabel && (
                    <span className="text-[11px] text-slate-500">
                      {createdAtLabel}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-1.5 hover:bg-slate-100 transition-colors"
              >
                <MdOutlineKeyboardBackspace className="w-5 h-5 text-slate-700" />
              </button>
            </div>

            {/* Caption */}
            {item.caption && (
              <div className="px-4 py-3 text-sm border-b border-slate-200">
                <span className="font-semibold mr-1 text-slate-900">
                  {item.author?.userName}
                </span>
                <span className="text-slate-700">{item.caption}</span>
              </div>
            )}

            {/* Comments list */}
            <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto border-b border-slate-200 bg-slate-50/40">
              {comments.length ? (
                comments.map((com, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={com.author?.profileImage || dp}
                        alt={com.author?.userName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-900">
                      <span className="font-semibold mr-1">
                        {com.author?.userName}
                      </span>
                      <span className="text-slate-700">{com.message}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No comments yet.</p>
              )}
            </div>

            {/* Actions */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <button
                  type="button"
                  onClick={handleLike}
                  className="flex items-center gap-1"
                >
                  {isLiked ? (
                    <GoHeartFill className="w-5 h-5 text-red-500" />
                  ) : (
                    <GoHeart className="w-5 h-5 text-slate-700" />
                  )}
                  <span className="text-xs text-slate-700">
                    {likes.length}
                  </span>
                </button>

                <div className="flex items-center gap-1">
                  <MdOutlineComment className="w-5 h-5 text-slate-700" />
                  <span className="text-xs text-slate-700">
                    {comments.length}
                  </span>
                </div>
              </div>

              {!isLoop && (
                <button type="button" onClick={handleSaved}>
                  {isSaved ? (
                    <GoBookmarkFill className="w-5 h-5 text-slate-800" />
                  ) : (
                    <MdOutlineBookmarkBorder className="w-5 h-5 text-slate-700" />
                  )}
                </button>
              )}
            </div>

            {/* Comment input – looks like mobile app bar */}
            <div className="px-3 sm:px-4 pb-3 pt-2 bg-white">
              <div className="flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5 shadow-sm">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={userData?.profileImage || dp}
                    alt="you"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    className="w-full h-8 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none pr-7"
                    placeholder="Add a comment..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleComment}
                    className="absolute right-0 top-1 text-sky-500 hover:text-sky-600"
                  >
                    <IoSendSharp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostInDetail;
