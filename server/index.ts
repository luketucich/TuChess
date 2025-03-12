import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// Create Express app
const app = express();
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React app URL (Vite default)
    methods: ["GET", "POST"],
  },
});

interface Player {
  id: string;
  username?: string;
}

const rooms = new Map<string, Player[]>();

// Handle connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Create a new player object
  const player: Player = { id: socket.id };

  // Send current rooms ONLY to the newly connected client
  const roomsInfo = Array.from(rooms.entries()).map(([roomId, players]) => ({
    roomId,
    players: players.map((p) => ({ id: p.id, username: p.username })),
  }));
  socket.emit("rooms-update", roomsInfo); // Only to this client

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Check all rooms for this player and remove them
    for (const [roomId, players] of rooms.entries()) {
      const index = players.findIndex((p) => p.id === socket.id);
      if (index !== -1) {
        players.splice(index, 1);

        // Remove room if empty
        if (players.length === 0) {
          rooms.delete(roomId);
        }

        // Update all clients about the room change
        updateRooms();
        break; // Assuming a player can only be in one room
      }
    }
  });

  // Update rooms for all clients - moved outside the connection handler
  function updateRooms() {
    const roomsInfo = Array.from(rooms.entries()).map(([roomId, players]) => ({
      roomId,
      players: players.map((p) => ({ id: p.id, username: p.username })),
    }));

    io.emit("rooms-update", roomsInfo); // To all clients
  }

  // Handle user joining a room
  socket.on("join-room", (roomId: string, username: string) => {
    player.username = username;
    console.log(`${player.username} joined room: ${roomId}`);

    // Check if room exists and add player to it
    if (rooms.has(roomId)) {
      rooms.get(roomId)?.push(player);
    } else {
      rooms.set(roomId, [player]);
    }

    // Join the socket to the room
    socket.join(roomId);

    // Send updated rooms to all clients after a change
    updateRooms();
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
