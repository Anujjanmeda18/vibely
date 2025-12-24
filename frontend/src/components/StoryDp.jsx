import React, { useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";

function StoryDp({ ProfileImage, userName, story }) {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { storyData, storyList } = useSelector((state) => state.story);
  const [viewed, setViewed] = useState(false);

  const avatarSrc =
    ProfileImage ||
    (userName === "Your Story" ? userData?.profileImage : null) ||
    dp;

  const isStoryExpired = (story) => {
    if (!story || !story.createdAt) return true;
    const storyAge = Date.now() - new Date(story.createdAt).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return storyAge >= twentyFourHours;
  };

  const isExpired = isStoryExpired(story);

  useEffect(() => {
    if (
      story &&
      !isExpired &&
      story.viewers?.some(
        (viewer) =>
          viewer?._id?.toString() === userData?._id?.toString() ||
          viewer?.toString() === userData?._id?.toString()
      )
    ) {
      setViewed(true);
    } else {
      setViewed(false);
    }
  }, [story, userData, storyData, storyList, isExpired]);

  const handleViewers = async () => {
    if (!story?._id) return;
    try {
      await axios.get(`${serverUrl}/api/story/view/${story._id}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    if (userName === "Your Story") {
      if (!story || isExpired) {
        navigate("/upload");
        return;
      }

      handleViewers();
      navigate(`/story/${userData?.userName}`);
      return;
    }

    if (story && !isExpired) {
      handleViewers();
      navigate(`/story/${userName}`);
    }
  };

  // Don't render if it's someone else's expired story
  if (userName !== "Your Story" && (!story || isExpired)) {
    return null;
  }

  const hasActiveStory = !!story && !isExpired;

  // Ring style
  const ringClasses = hasActiveStory
    ? viewed
      ? "bg-white border border-gray-200"
      : "bg-gradient-to-tr from-sky-500 via-purple-500 to-pink-500"
    : "bg-gray-100 border border-gray-300";

  const innerBorder =
    hasActiveStory && !viewed ? "border-2 border-white" : "border border-white";

  return (
    <div className="flex flex-col w-[76px] items-center gap-1">
      <button
        type="button"
        onClick={handleClick}
        className="w-[70px] h-[70px] rounded-full flex items-center justify-center relative cursor-pointer group"
      >
        {/* Outer ring with glow for unseen */}
        <div
          className={`
            w-[70px] h-[70px] rounded-full flex items-center justify-center
            ${ringClasses}
            ${hasActiveStory && !viewed ? "shadow-[0_0_18px_rgba(59,130,246,0.6)]" : "shadow-sm"}
            transition-all duration-200
          `}
        >
          {/* Inner avatar */}
          <div
            className={`
              w-[60px] h-[60px] rounded-full overflow-hidden bg-white 
              ${innerBorder}
              shadow-sm
            `}
          >
            <img
              src={avatarSrc}
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Add icon for your story */}
        {(!story || isExpired) && userName === "Your Story" && (
          <FiPlusCircle className="text-blue-600 absolute bottom-0 right-0 bg-white rounded-full w-[22px] h-[22px] shadow-md" />
        )}
      </button>

      {/* Label + tiny state hint */}
      <div className="flex flex-col items-center w-full">
        <span className="text-[11px] text-center truncate w-full text-gray-900">
          {userName === "Your Story" ? "Your story" : userName}
        </span>
        {hasActiveStory && !viewed && (
          <span className="text-[10px] text-sky-500 font-medium leading-tight">
            new
          </span>
        )}
      </div>
    </div>
  );
}

export default StoryDp;
