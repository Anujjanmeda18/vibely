import React, { useState, useEffect } from "react";
import dp from "../assets/dp.webp";
import VideoPlayer from "./VideoPlayer";
import { GoHeart, GoHeartFill, GoBookmarkFill } from "react-icons/go";
import { MdOutlineComment, MdOutlineBookmarkBorder } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setPostData } from "../redux/postSlice";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import FollowButton from "./FollowButton";

function Post({ post }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const { socket } = useSelector((state) => state.socket);

  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");
  const [likeAnimating, setLikeAnimating] = useState(false);

  const handleLike = async () => {
    try {
      // small local animation trigger
      setLikeAnimating(true);
      setTimeout(() => setLikeAnimating(false), 250);

      const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`, {
        withCredentials: true,
      });
      const updatedPost = result.data;
      const updatedPosts = (postData || []).map((p) =>
        p._id === post._id ? updatedPost : p
      );
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    if (!message.trim()) return;
    try {
      const result = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { message },
        { withCredentials: true }
      );
      const updatedPost = result.data;
      const updatedPosts = (postData || []).map((p) =>
        p._id === post._id ? updatedPost : p
      );
      dispatch(setPostData(updatedPosts));
      setMessage("");
    } catch (error) {
      console.log(error?.response || error);
    }
  };

  const handleSaved = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/post/saved/${post._id}`,
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
    } catch (error) {
      console.log(error?.response || error);
    }
  };

  // safe arrays
  const likes = Array.isArray(post.likes) ? post.likes : [];
  const saved = Array.isArray(userData?.saved) ? userData.saved : [];

  const isLiked = likes.includes(userData?._id);
  const isSaved = saved.includes(post._id);
  const isOwnPost = userData?._id === post.author?._id;

  // SOCKET LISTENERS FOR LIKE & COMMENT
  useEffect(() => {
    if (!socket) return;

    const handleLikedPost = (updatedData) => {
      dispatch(
        setPostData(
          (postData || []).map((p) =>
            p._id === updatedData.postId
              ? { ...p, likes: updatedData.likes }
              : p
          )
        )
      );
    };

    const handleCommentedPost = (updatedData) => {
      dispatch(
        setPostData(
          (postData || []).map((p) =>
            p._id === updatedData.postId
              ? { ...p, comments: updatedData.comments }
              : p
          )
        )
      );
    };

    socket.on("likedPost", handleLikedPost);
    socket.on("commentedPost", handleCommentedPost);

    return () => {
      socket.off("likedPost", handleLikedPost);
      socket.off("commentedPost", handleCommentedPost);
    };
  }, [socket, dispatch, postData]);

  const createdAtLabel = post.createdAt
    ? new Date(post.createdAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <article
      className="
        w-full bg-white border border-gray-200 rounded-3xl
        shadow-[0_8px_30px_rgba(15,23,42,0.05)]
        text-gray-900 overflow-hidden
        transition-transform transition-shadow duration-200
        hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]
        hover:-translate-y-[2px]
      "
    >
      {/* Header */}
      <header className="w-full px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-3 max-w-[70%] cursor-pointer"
          onClick={() => navigate(`/profile/${post.author?.userName}`)}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-200 shadow-sm overflow-hidden bg-gray-100">
            <img
              src={post.author?.profileImage || dp}
              alt={post.author?.userName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-[15px] font-semibold truncate text-gray-900">
              {post.author?.userName}
            </span>
            {createdAtLabel && (
              <span className="text-[11px] text-gray-500">{createdAtLabel}</span>
            )}
          </div>
        </button>

        {/* Follow button for other users */}
        {!isOwnPost && post.author?._id && (
          <FollowButton
            targetUserId={post.author?._id}
            tailwind="
              w-[110px]
              h-9
              rounded-full
              text-[12px]
              font-semibold
              flex
              items-center
              justify-center
            "
          />
        )}
      </header>

      {/* Media */}
      <div className="w-full px-3 sm:px-4 pb-3">
        {post.mediaType === "image" && (
          <button
            type="button"
            className="w-full rounded-2xl overflow-hidden bg-gray-100 group cursor-pointer"
            onClick={() => navigate(`/post/${post._id}`)}
          >
            <img
              src={post.media}
              alt="post media"
              className="w-full max-h-[460px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </button>
        )}

        {post.mediaType === "video" && (
          <div className="w-full rounded-2xl overflow-hidden bg-black">
            <VideoPlayer media={post.media} />
          </div>
        )}
      </div>

      {/* Actions + engagement */}
      <div className="w-full px-4 sm:px-5 pt-1 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleLike}
            className="flex items-center gap-1 text-sm text-gray-700 cursor-pointer"
          >
            <span
              className={`
                inline-flex items-center justify-center
                transition-transform duration-150
                ${likeAnimating ? "scale-110" : "scale-100"}
              `}
            >
              {isLiked ? (
                <GoHeartFill className="w-6 h-6 text-red-500" />
              ) : (
                <GoHeart className="w-6 h-6" />
              )}
            </span>
            <span className="text-xs text-gray-700">{likes.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowComment((prev) => !prev)}
            className="flex items-center gap-1 text-sm text-gray-700 cursor-pointer"
          >
            <MdOutlineComment className="w-6 h-6" />
            <span className="text-xs text-gray-700">
              {post.comments?.length || 0}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {createdAtLabel && (
            <span className="hidden sm:inline text-[11px] text-gray-400">
              {createdAtLabel}
            </span>
          )}
          <button
            type="button"
            onClick={handleSaved}
            className="text-gray-700 hover:text-gray-900 cursor-pointer"
          >
            {isSaved ? (
              <GoBookmarkFill className="w-6 h-6" />
            ) : (
              <MdOutlineBookmarkBorder className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="w-full px-4 sm:px-5 pb-3 text-sm flex gap-2">
          <button
            type="button"
            onClick={() => navigate(`/profile/${post.author?.userName}`)}
            className="font-semibold text-gray-900 cursor-pointer hover:underline"
          >
            {post.author?.userName}
          </button>
          <p className="text-gray-800 break-words">
            {post.caption.length > 180
              ? `${post.caption.slice(0, 180)}...`
              : post.caption}
          </p>
        </div>
      )}

      {/* Comments */}
      {showComment && (
        <div className="w-full border-t border-gray-200 pt-3 pb-4 bg-gray-50/60">
          {/* Input */}
          <div className="w-full flex items-center gap-3 px-4 sm:px-5 mb-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={userData?.profileImage || dp}
                alt="you"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full h-10 rounded-2xl bg-white border border-gray-200 text-xs sm:text-sm text-gray-900 px-3 pr-9 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-colors"
                placeholder="Write a comment..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="button"
                onClick={handleComment}
                className="absolute right-2 top-1.5 text-blue-500 hover:text-blue-600 cursor-pointer"
              >
                <IoSendSharp className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="w-full max-h-[260px] overflow-y-auto px-4 sm:px-5 space-y-3">
            {post.comments?.map((com, index) => (
              <div
                key={index}
                className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-none"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={com.author?.profileImage || dp}
                    alt={com.author?.userName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs sm:text-sm text-gray-900">
                  <span className="font-semibold mr-1">
                    {com.author?.userName}
                  </span>
                  <span className="text-gray-800">{com.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export default Post;
