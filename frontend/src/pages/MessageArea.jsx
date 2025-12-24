import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { LuImage } from "react-icons/lu";
import { IoMdSend } from "react-icons/io";
import dp from "../assets/dp.webp";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import axios from "axios";
import { serverUrl } from "../App";
import { setMessages } from "../redux/messageSlice";

function MessageArea() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedUser, messages } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);

  const safeMessages = Array.isArray(messages) ? messages : [];

  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [sending, setSending] = useState(false);

  const imageInput = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeMessages.length, selectedUser?._id]);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB");
      return;
    }
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!input || !input.trim()) && !backendImage) return;
    if (!selectedUser?._id || sending) return;

    try {
      setSending(true);
      const formData = new FormData();
      if (input.trim()) formData.append("message", input.trim());
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMessages([...safeMessages, res.data]));
      setInput("");
      setBackendImage(null);
      setFrontendImage(null);

      socket?.emit("sendMessage", {
        to: selectedUser._id,
        message: res.data,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const getAllMessages = async () => {
    if (!selectedUser?._id) return;
    try {
      const res = await axios.get(
        `${serverUrl}/api/message/getAll/${selectedUser._id}`,
        { withCredentials: true }
      );
      dispatch(setMessages(res.data || []));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMessages();
  }, [selectedUser?._id]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (mess) => {
      if (
        !selectedUser?._id ||
        (mess.sender !== selectedUser._id && mess.receiver !== selectedUser._id)
      ) {
        return;
      }
      dispatch((prevDispatch) =>
        setMessages((prev) => [...(Array.isArray(prev) ? prev : []), mess])
      );
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser?._id, dispatch]);

  if (!selectedUser) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center text-slate-400">
        Select a chat from the Messages screen.
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* Top bar */}
      <header className="w-full flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <button
          type="button"
          onClick={() => navigate("/messages")}
          className="flex items-center justify-center rounded-full p-1.5 hover:bg-slate-100 transition-colors"
        >
          <MdOutlineKeyboardBackspace className="text-slate-700 w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={() => navigate(`/profile/${selectedUser.userName}`)}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden bg-slate-100">
            <img
              src={selectedUser.profileImage || dp}
              alt={selectedUser.userName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-slate-900 text-sm sm:text-base font-semibold">
              {selectedUser.userName}
            </span>
            <span className="text-[11px] text-slate-500">
              {selectedUser.name || "View profile"}
            </span>
          </div>
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 w-full px-3 sm:px-6 pt-3 pb-24 overflow-y-auto space-y-3 bg-transparent scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        {safeMessages.map((mess) =>
          mess.sender === userData._id ? (
            <SenderMessage key={mess._id} message={mess} />
          ) : (
            <ReceiverMessage key={mess._id} message={mess} />
          )
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer className="w-full flex items-center justify-center px-3 sm:px-6 pb-4 bg-gradient-to-t from-white via-white/90 to-transparent">
        <form
          onSubmit={handleSendMessage}
          className="w-full max-w-2xl flex items-center gap-2 sm:gap-3 rounded-full bg-white border border-slate-200 px-4 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
        >
          {frontendImage && (
            <div className="absolute bottom-24 right-6 sm:right-8 w-24 h-24 rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 shadow-lg">
              <img
                src={frontendImage}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            hidden
            ref={imageInput}
            onChange={handleImage}
          />

          <input
            type="text"
            placeholder="Message"
            className="flex-1 bg-transparent text-sm sm:text-[15px] text-slate-900 placeholder:text-slate-400 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            type="button"
            onClick={() => imageInput.current?.click()}
            className="flex items-center justify-center rounded-full p-1.5 hover:bg-slate-100 transition-colors"
          >
            <LuImage className="w-5 h-5 text-slate-500" />
          </button>

          <button
            type="submit"
            disabled={(!input.trim() && !frontendImage) || sending}
            className={`flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-md transition-all ${
              (!input.trim() && !frontendImage) || sending
                ? "opacity-40 cursor-not-allowed"
                : "hover:scale-105 hover:shadow-lg"
            }`}
          >
            <IoMdSend className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}

export default MessageArea;
