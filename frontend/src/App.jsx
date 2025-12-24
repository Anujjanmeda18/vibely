// App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import { useDispatch, useSelector } from "react-redux";
import useCurrentUser from "./hooks/useCurrentUser";
import getSuggestedUser from "./hooks/getSuggestedUser";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Upload from "./pages/Upload";
import getAllPost from "./hooks/getAllPost";
import PostInDetail from "./pages/PostInDetail";
import Loops from "./pages/Loops";
import getAllLoops from "./hooks/getAllLoops";
import Story from "./pages/Story";
import getAllStories from "./hooks/getAllstories";
import Messages from "./pages/Messages";
import MessageArea from "./pages/MessageArea";
import { setOnlineUsers, setSocket } from "./redux/socketSlice";
import { io } from "socket.io-client";
import { useEffect } from "react";
import getPrevChatUsers from "./hooks/getPrevChatUsers";
import getFollowingList from "./hooks/getFollowingList";
import Search from "./pages/Search";
import getAllNotifications from "./hooks/getAllNotifications.jsx";
import { setNotificationData } from "./redux/userSlice.js";
import Notification from "./pages/Notification.jsx";

export const serverUrl = "srv-d562ar1r0fns73d6g180";

function App() {
  useCurrentUser(); // ← proper hook
  getSuggestedUser(); // ← proper hook
  getAllPost(); // ← proper hook
  getAllLoops(); // ← proper hook
  getAllStories(); // ← proper hook
  getPrevChatUsers();
  getFollowingList();
  getAllNotifications();

  const { userData , notificationData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      const socketIo = io(`${serverUrl}`, {
        query: {
          userId: userData._id,
        },
      });
      dispatch(setSocket(socketIo));

      socketIo.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
        console.log(users);
      });

      return () => socketIo.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData]);

   socket?.on("newNotification", (noti) => {
    dispatch(setNotificationData([...notificationData, noti]));
  });

  // Optional: simple loading guard if you want (you can add a `loadingUser` state in Redux),
  // otherwise keep it as-is.

  return (
    <Routes>
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/profile/:userName"
        element={userData ? <Profile /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/editprofile"
        element={userData ? <EditProfile /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/upload"
        element={userData ? <Upload /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/post/:postId"
        element={userData ? <PostInDetail /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/notifications"
        element={userData ? <Notification /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/loops"
        element={userData ? <Loops /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/story/:userName"
        element={userData ? <Story /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/messages"
        element={userData ? <Messages /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/messageArea"
        element={userData ? <MessageArea /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/search"
        element={userData ? <Search /> : <Navigate to={"/signin"} />}
      />
    </Routes>
  );
}

export default App;
