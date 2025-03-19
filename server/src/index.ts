import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Board } from "./game/Board";
import { Player } from "./game/Player";

// SERVER SETUP

// Create Express app
const app = express();
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server
const io = new Server(server, {
  cors: {
    // origin: "https://tuchess.onrender.com",
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// DATA STRUCTURES

interface User {
  id: string;
  username?: string;
  color?: string;
}

interface Game {
  board: Board;
  serializedBoard: string;
  turn: string;
  gameOver: boolean;
  white: Player;
  black: Player;
  timeControl: {
    time: number;
    increment: number;
  };
}

const rooms = new Map<string, User[]>();
const games = new Map<string, Game>();

// SOCKET CONNECTION HANDLING

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Create a new user object
  const user: User = { id: socket.id };

  updateRooms();

  // Helper Functions

  // Update rooms for all clients
  function updateRooms() {
    const roomsInfo = Array.from(rooms.entries()).map(([roomId, users]) => ({
      roomId,
      users: users.map((u) => ({
        id: u.id,
        username: u.username,
        color: u.color,
      })),
    }));

    io.emit("rooms-update", roomsInfo);
  }

  // Validate move and update game state
  function validateMove(roomId: string, from: string, to: string): boolean {
    const board = games.get(roomId)?.board;

    const player =
      user.color === "white"
        ? games.get(roomId)?.white
        : games.get(roomId)?.black;

    const opponent =
      user.color === "white"
        ? games.get(roomId)?.black
        : games.get(roomId)?.white;

    try {
      board?.movePiece(from, to, player!);

      // Update player's piece display if a capture was made
      const move = board?.getHistory()[board.getHistory().length - 1];

      if (move!.getMove().isCapture) {
        const playerPieces = player
          ?.getPieces()
          .map((piece) => piece.getName());

        io.emit("update-pieces", playerPieces, player!.getColor());
      }

      player?.setIsTurn(false);
      opponent?.setIsTurn(true);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An error occurred during move validation");
      }
      return false;
    }
  }

  // Event Handlers

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Check all rooms for this user and remove them
    for (const [roomId, users] of rooms.entries()) {
      const index = users.findIndex((p) => p.id === socket.id);
      if (index !== -1) {
        users.splice(index, 1);

        // Remove room if empty
        if (users.length === 0) {
          rooms.delete(roomId);
        }

        // Update all clients about the room change
        updateRooms();
        break; // Assuming a player can only be in one room
      }
    }
  });

  // Handle user joining a room
  socket.on("join-room", (roomId: string, username: string) => {
    user.username = username;

    // Assign color based on room state
    let color = "white"; // Default for first player

    if (rooms.has(roomId)) {
      const existingUsers = rooms.get(roomId);
      if (existingUsers && existingUsers.length > 0) {
        // If there's already a player, assign opposite color
        const existingColor = existingUsers[0].color;
        color = existingColor === "white" ? "black" : "white";
      }
    }

    user.color = color;
    console.log(`${user.username} joined room: ${roomId}`);
    console.log("User color:", user.color);

    // Check if room exists and add player to it
    if (rooms.has(roomId)) {
      rooms.get(roomId)?.push(user);
    } else {
      rooms.set(roomId, [user]);
    }

    // Join the socket to the room
    socket.join(roomId);

    // Send updated rooms to all clients after a change
    updateRooms();
  });

  // Handle game start
  socket.on(
    "start-game",
    (
      roomId: string,
      timeControl: {
        time: number;
        increment: number;
      }
    ) => {
      const newBoard = new Board();
      const game: Game = {
        board: newBoard,
        serializedBoard: newBoard.serializeBoard(),
        turn: "white",
        gameOver: false,
        white: new Player("white", true),
        black: new Player("black", false),
        timeControl: timeControl,
      };

      games.set(roomId, game);
      console.log("Game started in room:", roomId);

      io.to(roomId).emit("send-username", user.username, user.id);
    }
  );

  // Handle piece movement
  socket.on("move-piece", (roomId: string, from: string, to: string) => {
    const game = games.get(roomId);

    if (!game) {
      console.error("Board not found for room:", roomId);
      return;
    }

    if (game.gameOver) {
      console.error("Game is already over in room:", roomId);
      return;
    }

    if (game.turn !== user.color) {
      console.error("Not your turn in room:", roomId);
      return;
    }

    if (validateMove(roomId, from, to) === false) {
      console.error("Invalid move in room:", roomId);
      return;
    } else {
      console.log(`Move piece from ${from} to ${to} in room: ${roomId}`);
      game.turn = user.color === "white" ? "black" : "white";

      // Send updated board to all clients in the room
      io.to(roomId).emit("board-update", {
        lastMove: { from, to },
        turn: game.turn,
      });
    }

    // Check for game end conditions
    if (game.board.isCheckmateOrStalemate("black") !== "none") {
      game.gameOver = true;
      io.to(roomId).emit("game-over", {
        message:
          game.board.isCheckmateOrStalemate("black") === "checkmate"
            ? "White wins by checkmate"
            : "Game drawn by stalemate",
      });
    } else if (game.board.isCheckmateOrStalemate("white") !== "none") {
      game.gameOver = true;
      io.to(roomId).emit("game-over", {
        message:
          game.board.isCheckmateOrStalemate("white") === "checkmate"
            ? "Black wins by checkmate"
            : "Game drawn by stalemate",
      });
    }
  });

  // Handle timeout
  socket.on("timeout", (roomId: string, playerColor: string) => {
    const game = games.get(roomId);

    if (!game) {
      console.error("Game not found for room:", roomId);
      return;
    }

    if (game.gameOver) {
      console.error("Game is already over in room:", roomId);
      return;
    }

    // Mark the game as over
    game.gameOver = true;

    // The player whose time ran out loses
    const winner = playerColor === "white" ? "black" : "white";
    console.log(
      `${playerColor}'s time ran out. ${winner} wins in room: ${roomId}`
    );

    // Notify all clients in the room about the game result
    io.to(roomId).emit("game-over", {
      message: `${
        winner.charAt(0).toUpperCase() + winner.slice(1)
      } wins by timeout`,
    });
  });
});

// SERVER STARTUP

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
