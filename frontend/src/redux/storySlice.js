import { createSlice } from "@reduxjs/toolkit";
const storySlice = createSlice({
  name: "post",
  initialState: {
    storyData: { allStories: [] }, // ← Object with array
    storyList: [], // ← Empty array
    currentUserStory: null, // ← OK as null
    activeStory: null,
  },
  reducers: {
    setStoryData: (state, action) => {
      state.storyData = action.payload;
    },
    setStoryList: (state, action) => {
      state.storyList = action.payload;
    },
    setCurrentUserStory: (state, action) => {
      state.currentUserStory = action.payload;
    },
    setActiveStory: (state, action) => {
      // <- new
      state.activeStory = action.payload;
    },
  },
});

export const {
  setStoryData,
  setStoryList,
  setCurrentUserStory,
  setActiveStory,
} = storySlice.actions;
export default storySlice.reducer;
