import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    suggestedUsers: [],
    profileData: null,
    following: [],
    searchData: null,
    notificationData: [],
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
    setNotificationData: (state, action) => {
      state.notificationData = action.payload;
    },
    toggleFollow: (state, action) => {
      const targetUserId = action.payload;

      const idx = state.following.findIndex((u) => u._id === targetUserId);

      if (idx !== -1) {
        // unfollow: remove user object
        state.following.splice(idx, 1);
      } else {
        // follow: push placeholder object with id (optional: fill more fields if you have them)
        state.following.push({ _id: targetUserId });
      }
    },
  },
});

export const {
  setUserData,
  setSuggestedUsers,
  setProfileData,
  setFollowing,
  toggleFollow,
  setSearchData,
  setNotificationData,
} = userSlice.actions;
export default userSlice.reducer;
