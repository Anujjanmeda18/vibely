// src/hooks/useCurrentUser.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setFollowing, setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";
import { setCurrentUserStory } from "../redux/storySlice";

function useCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });

        dispatch(setUserData(result.data));
        dispatch(setFollowing(result.data.following || []));
        // add story-related data for current user
        dispatch(setCurrentUserStory(result.data.story || null));
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [dispatch]); // run once on mount; no storyData dependency
}

export default useCurrentUser;
