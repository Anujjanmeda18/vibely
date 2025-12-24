import React, { useEffect, useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdOutlineComment } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import FollowButton from "./FollowButton";
import axios from "axios";
import { serverUrl } from "../App";
import { setLoopData } from "../redux/loopSlice";
import { useNavigate } from "react-router-dom";

function formatTime(sec = 0) {
  const s = Math.floor(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function LoopCard({ loop }) {
  const videoRef = useRef(null);
  const commentRef = useRef(null);
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");
  const [timeState, setTimeState] = useState({ current: 0, duration: 0 });

  const { userData } = useSelector((state) => state.user);
  const { loopData } = useSelector((state) => state.loop);
  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
      setTimeState({
        current: video.currentTime,
        duration: video.duration,
      });
    }
  };

  const handleLikeOnDoubleClick = () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 550);
    if (!loop.likes?.includes(userData?._id)) {
      handleLike();
    }
  };

  const handleClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/loop/like/${loop._id}`, {
        withCredentials: true,
      });
      const updatedLoop = result.data;
      const updatedLoops = loopData.map((p) =>
        p._id === loop._id ? updatedLoop : p
      );
      dispatch(setLoopData(updatedLoops));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    if (!message.trim()) return;
    try {
      const result = await axios.post(
        `${serverUrl}/api/loop/comment/${loop._id}`,
        { message },
        { withCredentials: true }
      );
      const updatedLoop = result.data;
      const updatedLoops = loopData.map((p) =>
        p._id === loop._id ? updatedLoop : p
      );
      dispatch(setLoopData(updatedLoops));
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  // close comment sheet when clicking outside
  useEffect(() => {
    if (!showComment) return;

    const handleClickOutside = (event) => {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setShowComment(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showComment]);

  // auto play / pause on intersection
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!video) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, []);

  const isLiked = loop.likes?.includes(userData?._id);

  // socket updates
  useEffect(() => {
    if (!socket) return;

    const handleLikedLoop = (updatedData) => {
      const updatedLoops = loopData.map((p) =>
        p._id == updatedData.loopId ? { ...p, likes: updatedData.likes } : p
      );
      dispatch(setLoopData(updatedLoops));
    };

    const handleCommentedLoop = (updatedData) => {
      const updatedLoops = loopData.map((p) =>
        p._id == updatedData.loopId
          ? { ...p, comments: updatedData.comments }
          : p
      );
      dispatch(setLoopData(updatedLoops));
    };

    socket.on("likedLoop", handleLikedLoop);
    socket.on("commentedLoop", handleCommentedLoop);

    return () => {
      socket.off("likedLoop", handleLikedLoop);
      socket.off("commentedLoop", handleCommentedLoop);
    };
  }, [socket, loopData, dispatch]);

  return (
    <div className="w-full lg:w-[480px] h-[100vh] flex items-center justify-center bg-black relative overflow-hidden">
      {/* Gradient vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      {/* Double-tap heart */}
      {showHeart && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
          <GoHeartFill className="w-[90px] h-[90px] text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.7)]" />
        </div>
      )}

      {/* Comment bottom sheet */}
      <div
        ref={commentRef}
        className={`absolute z-50 bottom-0 w-full max-w-[480px] h-[460px] px-4 pt-4 pb-[76px] rounded-t-[28px] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.45)] transform transition-transform duration-400 ease-out left-1/2 -translate-x-1/2 ${
          showComment ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <h1 className="text-gray-900 text-[16px] text-center font-semibold">
          Comments
        </h1>

        <div className="w-full h-[320px] overflow-y-auto flex flex-col gap-3 mt-3 pr-1">
          {loop.comments.length === 0 && (
            <div className="text-center text-gray-500 text-[14px] font-medium mt-8">
              No comments yet
            </div>
          )}

          {loop.comments?.map((com, index) => (
            <div
              key={com._id || index}
              className="w-full flex flex-col gap-1 border-b border-gray-100 pb-3 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
                  <img
                    src={com.author?.profileImage || dp}
                    alt={com.author?.userName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-semibold text-gray-900 truncate max-w-[180px] text-sm">
                  {com.author?.userName || "Unknown"}
                </div>
              </div>
              <div className="text-gray-700 pl-[46px] text-[13px] leading-snug">
                {com.message}
              </div>
            </div>
          ))}
        </div>

        {/* Comment input in sheet */}
        <div className="w-full absolute bottom-0 left-0 h-[68px] flex items-center gap-3 px-4 pb-3 bg-white border-t border-gray-200">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
            <img
              src={userData?.profileImage || dp}
              alt="you"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              className="px-3 pr-9 w-full text-gray-900 placeholder:text-gray-400 outline-none h-9 bg-gray-50 border border-gray-200 rounded-full text-[13px]"
              placeholder="Write a comment..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            {message && (
              <button
                className="absolute right-2 top-1.5 cursor-pointer text-blue-500 hover:text-blue-600"
                onClick={handleComment}
              >
                <IoSendSharp className="w-[18px] h-[18px]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMute}
        loop
        src={loop?.media}
        className="w-full max-h-full object-cover cursor-pointer"
        onClick={handleClick}
        onTimeUpdate={handleTimeUpdate}
        onDoubleClick={handleLikeOnDoubleClick}
      />

      {/* Time pill */}
      {timeState.duration > 0 && (
        <div className="absolute top-4 left-4 z-30 px-2 py-1 rounded-full bg-black/55 text-[11px] text-white font-medium backdrop-blur-sm">
          {formatTime(timeState.current)} / {formatTime(timeState.duration)}
        </div>
      )}

      {/* Mute toggle */}
      <button
        type="button"
        className="absolute top-4 right-4 z-30 bg-black/40 rounded-full p-2 backdrop-blur-sm cursor-pointer"
        onClick={() => setIsMute((prev) => !prev)}
      >
        {isMute ? (
          <FiVolumeX className="w-5 h-5 text-white" />
        ) : (
          <FiVolume2 className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 w-full h-[3px] bg-black/60">
        <div
          className="h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Bottom overlay (author, caption, actions) */}
      <div className="w-full absolute bottom-3 px-3 flex flex-col gap-2 text-white">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-white/60 cursor-pointer"
            onClick={() => navigate(`/profile/${loop.author.userName}`)}
          >
            <img
              src={loop.author?.profileImage || dp}
              alt={loop.author?.userName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm truncate max-w-[130px]">
              {loop.author?.userName}
            </span>
            {userData?._id !== loop.author?._id && (
              <FollowButton
                targetUserId={loop.author?._id}
                tailwind="w-[110px] h-8 text-[11px] font-semibold flex items-center justify-center cursor-pointer"
              />
            )}
          </div>
        </div>

        {loop.caption && (
          <div className="text-[13px] max-w-[80%] leading-snug text-gray-100">
            {loop.caption}
          </div>
        )}

        {/* Side actions */}
        <div className="absolute right-2 bottom-[140px] flex flex-col gap-4 text-white items-center">
          <div className="flex flex-col items-center cursor-pointer">
            <button type="button" onClick={handleLike} className="cursor-pointer">
              {isLiked ? (
                <GoHeartFill className="w-7 h-7 text-red-500" />
              ) : (
                <GoHeart className="w-7 h-7" />
              )}
            </button>
            <span className="text-[11px] mt-1">{loop.likes.length}</span>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setShowComment(true)}
          >
            <MdOutlineComment className="w-7 h-7" />
            <span className="text-[11px] mt-1">{loop.comments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoopCard;
