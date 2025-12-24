// src/components/FollowButton.jsx
import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { toggleFollow } from "../redux/userSlice";

function FollowButton({ targetUserId, tailwind = "", onFollowChange }) {
  const dispatch = useDispatch();
  const { following } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  // following is an array of user objects: [{ _id, ... }]
  const isFollowing = Array.isArray(following)
    ? following.some((u) => u._id === targetUserId)
    : false;

  const handleFollow = async () => {
    if (loading || !targetUserId) return;
    setLoading(true);

    try {
      await axios.get(`${serverUrl}/api/user/follow/${targetUserId}`, {
        withCredentials: true,
      });

      dispatch(toggleFollow(targetUserId));
      onFollowChange && onFollowChange();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const stateClasses = isFollowing
    ? // Following: subtle outline, white background
      "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
    : // Not following: blue primary button
      "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700";

  return (
    <button
      type="button"
      onClick={handleFollow}
      disabled={loading}
      className={`
        ${stateClasses}
        ${tailwind}
        disabled:opacity-60
        disabled:cursor-not-allowed
        transition-colors
        rounded-full
      `}
    >
      {loading ? "…" : isFollowing ? "Following" : "Follow"}
    </button>
  );
}

export default FollowButton;
