import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { PORT } from "./config/env";
import { setupSocketHandlers } from "./services/socketService";

// Setup Express with CORS
const app = express();
app.use(cors());
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    // origin: "*",
    origin: [
      "https://tuchess.onrender.com",
      "https://tuchess.com",
      "https://www.tuchess.com",
    ],
    methods: ["GET", "POST"],
  },
});

// Setup socket handlers
setupSocketHandlers(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
