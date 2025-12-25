import http from "http";
import express from "express";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://vibely-two.vercel.app", // ✅ Change this!
    methods: ["GET", "POST"],
    credentials: true, // ✅ Add this for cookies
  },
});
const userSocketMap = {};
export const getSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId != undefined) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
