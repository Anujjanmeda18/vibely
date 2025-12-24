// src/pages/Story.jsx
import axios from "axios";
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setActiveStory, setStoryData } from "../redux/storySlice";
import StoryCard from "../components/StoryCard";

function Story() {
  const { userName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeStory } = useSelector((state) => state.story);

  const handleStory = async () => {
    dispatch(setActiveStory(null));
    try {
      const result = await axios.get(
        `${serverUrl}/api/story/getByUserName/${userName}`,
        { withCredentials: true }
      );
      const stories = result.data || [];
      dispatch(setStoryData(stories));
      dispatch(setActiveStory(stories[0] || null));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userName) {
      handleStory();
    }
  }, [userName]);

  const isLoading = userName && !activeStory;

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      {/* Loading */}
      {isLoading && (
        <p className="text-sm text-gray-400">Loading story...</p>
      )}

      {/* Empty */}
      {!isLoading && !activeStory && (
        <div className="text-center text-gray-400 text-sm">
          <p>No story available for this user.</p>
        </div>
      )}

      {/* Story card - Full screen */}
      {activeStory && <StoryCard storyData={activeStory} />}
    </div>
  );
}

export default Story;
