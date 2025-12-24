import React, { useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import VideoPlayer from "./VideoPlayer";
import { FaEye } from "react-icons/fa6";

function getTimeAgo(date) {
  if (!date) return "";
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

function StoryCard({ storyData }) {
  const { userData } = useSelector((state) => state.user);
  const [showViewers, setShowViewers] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // progress bar + auto close
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/");
          return 100;
        }
        return prev + 1;
      });
    }, 150); // ~15 seconds

    return () => clearInterval(interval);
  }, [navigate]);

  const isOwnStory = storyData?.author?.userName === userData?.userName;

  return (
    <div className="w-full max-w-[500px] h-[100vh] bg-black flex flex-col justify-center relative overflow-hidden">
      {/* Soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      {/* Top bar */}
      <div className="flex items-center gap-3 absolute top-4 left-0 w-full px-3 z-20">
        <button
          type="button"
          className="flex items-center justify-center rounded-full bg-black/60 p-1 cursor-pointer backdrop-blur-sm"
          onClick={() => navigate("/")}
        >
          <MdOutlineKeyboardBackspace className="text-white w-6 h-6" />
        </button>
        <div className="w-9 h-9 md:w-10 md:h-10 border border-white/60 rounded-full overflow-hidden bg-gray-100">
          <img
            src={storyData?.author?.profileImage || dp}
            alt={storyData?.author?.userName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold truncate text-white text-sm max-w-[160px]">
            {storyData?.author?.userName}
          </span>
          <span className="text-xs text-gray-300">
            {getTimeAgo(storyData?.createdAt)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-1.5 left-0 w-full px-3 z-20">
        <div className="w-full h-[3px] bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      {!showViewers && (
        <>
          <div className="w-full h-[90vh] flex items-center justify-center relative z-10">
            {storyData?.mediaType === "image" && (
              <div className="w-[88%] flex items-center justify-center">
                <img
                  src={storyData?.media}
                  alt=""
                  className="w-full max-h-[88vh] rounded-2xl object-cover"
                />
              </div>
            )}

            {storyData?.mediaType === "video" && (
              <div className="w-[88%] flex flex-col items-center justify-center rounded-2xl overflow-hidden">
                <VideoPlayer media={storyData?.media} />
              </div>
            )}
          </div>

          {/* Bottom viewers chip - LEFT ALIGNED */}
          {isOwnStory && (
            <div className="absolute bottom-4 left-4 z-20">
              <button
                type="button"
                className="flex items-center gap-2 text-white text-sm cursor-pointer bg-black/60 px-3 py-2 rounded-full backdrop-blur-md hover:bg-black/70 transition-all"
                onClick={() => setShowViewers(true)}
              >
                <FaEye className="w-4 h-4" />
                <span className="font-medium">{storyData?.viewers?.length || 0}</span>
                
                {storyData?.viewers?.length > 0 && (
                  <div className="flex items-center -space-x-2 ml-1">
                    { Array.isArray(storyData?.viewers) &&storyData?.viewers?.slice(0, 3).map((viewer, index) => (
                      <div
                        key={viewer._id || index}
                        className="w-6 h-6 border-2 border-black rounded-full overflow-hidden bg-gray-100"
                      >
                        <img
                          src={viewer?.profileImage || dp}
                          alt={viewer?.userName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Viewers sheet */}
      {showViewers && (
        <>
          <div
            className="w-full h-[32%] flex items-center justify-center mt-[80px] cursor-pointer py-4 overflow-hidden z-10"
            onClick={() => setShowViewers(false)}
          >
            {storyData?.mediaType === "image" && (
              <div className="h-full flex items-center justify-center">
                <img
                  src={storyData?.media}
                  alt=""
                  className="h-full rounded-2xl object-cover"
                />
              </div>
            )}

            {storyData?.mediaType === "video" && (
              <div className="h-full flex flex-col items-center justify-center rounded-2xl overflow-hidden">
                <VideoPlayer media={storyData?.media} />
              </div>
            )}
          </div>

          <div className="w-full h-[68%] absolute bottom-0 left-0 bg-black/90 border-t border-white/10 p-5 z-20 backdrop-blur-xl rounded-t-3xl">
            <div className="text-white flex items-center gap-2 text-base mb-4 font-semibold">
              <FaEye className="w-5 h-5" />
              <span>{storyData?.viewers?.length || 0}</span>
              <span className="text-gray-300 font-normal">Viewers</span>
            </div>

            <div className="w-full max-h-[calc(100%-48px)] flex flex-col gap-3 overflow-auto pb-2">
              {Array.isArray(storyData?.viewers) && storyData?.viewers?.length > 0 ? (
                storyData?.viewers?.map((viewer, index) => (
                  <div
                    key={viewer._id || index}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="w-11 h-11 border-2 border-white/40 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={viewer?.profileImage || dp}
                        alt={viewer?.userName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-semibold truncate text-white text-sm">
                        {viewer?.userName}
                      </span>
                      <span className="text-xs text-gray-400 truncate">
                        {viewer?.fullName || viewer?.userName}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No viewers yet
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StoryCard;
