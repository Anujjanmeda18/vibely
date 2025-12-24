import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import postSlice from "./postSlice";
import storySlice from "./storySlice";
import loopSlice from "./loopSlice";
import messageSlice from "./messageSlice.js";
import socketSlice from "./socketSlice.js";

const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    story: storySlice,
    loop: loopSlice,
    message: messageSlice,
    socket: socketSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["socket.socket"],
        ignoredActions: ["socket/setSocket"],
      },
    }),
});

export default store;
