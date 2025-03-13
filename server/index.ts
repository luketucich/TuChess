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
    origin: "https://tuchess.onrender.com",
    methods: ["GET", "POST"],
  },
});

interface Player {
  id: string;
  username?: string;
  color?: string;
}

interface Board {
  lastMove: { from: string; to: string; color: string };
  turn: string;
  gameOver: boolean;
}

const rooms = new Map<string, Player[]>();
const boards = new Map<string, Board>();

// Handle connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Create a new player object
  const player: Player = { id: socket.id };

  updateRooms();

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
      players: players.map((p) => ({
        id: p.id,
        username: p.username,
        color: p.color,
      })),
    }));

    io.emit("rooms-update", roomsInfo);
  }

  // Handle user joining a room
  socket.on("join-room", (roomId: string, username: string, color: string) => {
    player.username = username;
    player.color = color;
    console.log(`${player.username} joined room: ${roomId}`);
    console.log("Player color:", player.color);

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

  socket.on("start-game", (roomId: string) => {
    const board: Board = {
      lastMove: { from: "", to: "", color: "" },
      turn: "white",
      gameOver: false,
    };

    // Create a new board for the room
    boards.set(roomId, board);

    console.log("Game started in room:", roomId);
  });

  socket.on("move-piece", (roomId: string, from: string, to: string) => {
    const board = boards.get(roomId);

    if (!board) {
      console.error("Board not found for room:", roomId);
      return;
    }

    if (board.gameOver) {
      console.error("Game is already over in room:", roomId);
      return;
    }

    if (board.turn !== player.color) {
      console.error("Not your turn in room:", roomId);
      return;
    }

    // Move piece
    console.log(`Move piece from ${from} to ${to} in room: ${roomId}`);
    board.lastMove = { from, to, color: player.color };
    board.turn = player.color === "white" ? "black" : "white";

    // At the end of your "move-piece" handler, after updating board.turn
    io.to(roomId).emit("board-update", board);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
