// src/hooks/useCurrentUser.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSuggestedUsers, setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";

function getSuggestedUser() {
  const dispatch = useDispatch();
  const {userData} = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/suggested`,
          { withCredentials: true }
        );
        dispatch(setSuggestedUsers(result.data));
      } catch (error) {
        console.log(error);
        // optional: dispatch(setUserData(null));
      }
    };

    fetchUser();
  }, [userData]);
}

export default getSuggestedUser;
