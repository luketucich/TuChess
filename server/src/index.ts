import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Board } from "./game/Board";
import { Player } from "./game/Player";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

// Setup Express with CORS
const app = express();
app.use(cors());
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    // origin: "*",
    origin: "https://tuchess.onrender.com",
    methods: ["GET", "POST"],
  },
});

interface User {
  id: string;
  authId?: string;
  username?: string;
  color?: string;
  isConnected: boolean;
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
  whiteTime: number;
  whiteClockId?: NodeJS.Timeout;
  blackTime: number;
  blackClockId?: NodeJS.Timeout;
}

// Storage for active rooms and games
const rooms = new Map<string, User[]>();
const games = new Map<string, Game>();
const disconnectionTimers = new Map<string, NodeJS.Timeout>();

// Clock management functions
function startClock(roomId: string, playerColor: "white" | "black") {
  const game = games.get(roomId);
  if (!game) {
    console.error(`No game found for room ${roomId}`);
    return;
  }

  const intervalId = setInterval(() => {
    if (playerColor === "white") {
      game.whiteTime -= 1;
      io.to(roomId).emit("sync-time", game.whiteTime, "white");
      console.log("White time ticking:", game.whiteTime);
    } else {
      game.blackTime -= 1;
      io.to(roomId).emit("sync-time", game.blackTime, "black");
      console.log("Black time ticking:", game.blackTime);
    }
  }, 1000);

  if (playerColor === "white") {
    game.whiteClockId = intervalId;
    console.log(`Started white clock for room ${roomId}, ID: ${intervalId}`);
  } else {
    game.blackClockId = intervalId;
    console.log(`Started black clock for room ${roomId}, ID: ${intervalId}`);
  }
}

function stopClock(roomId: string, playerColor: "white" | "black") {
  const game = games.get(roomId);
  if (!game) {
    console.error(`No game found for room ${roomId}`);
    return;
  }

  if (playerColor === "white" && game.whiteClockId) {
    const intervalId = game.whiteClockId;
    game.whiteClockId = undefined;
    clearInterval(intervalId);
    console.log(`Stopped white clock for room ${roomId}, ID: ${intervalId}`);
  } else if (playerColor === "black" && game.blackClockId) {
    const intervalId = game.blackClockId;
    game.blackClockId = undefined;
    clearInterval(intervalId);
    console.log(`Stopped black clock for room ${roomId}, ID: ${intervalId}`);
  } else {
    console.warn(`No ${playerColor} clock interval to stop for room ${roomId}`);
  }
}

// Socket connection handler
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const user: User = { id: socket.id, isConnected: true };

  function validateMove(
    roomId: string,
    from: string,
    to: string,
    promotionType?: "queen" | "rook" | "bishop" | "knight"
  ): boolean {
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
      if (promotionType !== undefined) {
        board?.movePiece(from, to, player!, promotionType);
      } else {
        board?.movePiece(from, to, player!);
      }

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

  async function saveGameToSupabase(roomId: string, game: Game) {
    const whitePlayer = rooms.get(roomId)?.find((u) => u.color === "white");
    const blackPlayer = rooms.get(roomId)?.find((u) => u.color === "black");

    const gameData = {
      room_id: roomId,
      white_player_socket_id: whitePlayer?.id,
      white_player_supabase_id: whitePlayer?.authId,
      black_player_socket_id: blackPlayer?.id,
      black_player_supabase_id: blackPlayer?.authId,
      game_state: game.serializedBoard,
      turn: game.turn,
      is_completed: game.gameOver,
      time_control: game.timeControl,
    };

    const { data, error } = await supabase
      .from("chess_games")
      .upsert([gameData], { onConflict: "room_id" });

    if (error) {
      console.error("Upsert error:", error.message);
      throw error;
    }

    return data;
  }

  // Authentication event
  socket.on("authenticate", (authId) => {
    user.authId = authId;
    console.log(`User ${socket.id} authenticated with ID: ${authId}`);
  });

  // Disconnection event
  socket.on("disconnect", () => {
    user.isConnected = false;
    console.log("User disconnected:", socket.id);

    for (const [roomId, users] of rooms.entries()) {
      const userIndex = users.findIndex((u) => u.id === socket.id);

      if (userIndex !== -1) {
        if (users.length === 2) {
          console.log(
            `Setting 30 second reconnection timer for ${socket.id} in room ${roomId}`
          );
          io.to(roomId).emit("set-status-offline", user.color);

          const timerKey = `${roomId}:${socket.id}`;
          const timer = setTimeout(() => {
            const currentUsers = rooms.get(roomId);
            const userStillThere = currentUsers?.find(
              (u) => u.id === socket.id && !u.isConnected
            );

            if (userStillThere && currentUsers) {
              const updatedUsers = currentUsers.filter(
                (u) => u.id !== socket.id
              );
              rooms.set(roomId, updatedUsers);

              io.to(roomId).emit("game-over", {
                message: `You win. ${
                  userStillThere.username || "Opponent"
                } has disconnected`,
              });

              const game = games.get(roomId);
              if (game) {
                if (game.whiteClockId) clearInterval(game.whiteClockId);
                if (game.blackClockId) clearInterval(game.blackClockId);
                game.gameOver = true;
                saveGameToSupabase(roomId, game);
              }

              io.emit(
                "rooms-update",
                Array.from(rooms.entries()).map(([rid, usrs]) => ({
                  roomId: rid,
                  users: usrs.map((u) => ({
                    id: u.id,
                    authId: u.authId,
                    username: u.username,
                    color: u.color,
                    isConnected: u.isConnected,
                  })),
                }))
              );
            }
            disconnectionTimers.delete(timerKey);
          }, 30000);

          disconnectionTimers.set(timerKey, timer);
        } else {
          users.splice(userIndex, 1);

          if (users.length === 0) {
            console.log(`Room ${roomId} is now empty, deleting room`);

            const game = games.get(roomId);
            if (game) {
              if (game.whiteClockId) clearInterval(game.whiteClockId);
              if (game.blackClockId) clearInterval(game.blackClockId);
            }

            rooms.delete(roomId);
            games.delete(roomId);

            io.emit(
              "rooms-update",
              Array.from(rooms.entries()).map(([rid, usrs]) => ({
                roomId: rid,
                users: usrs.map((u) => ({
                  id: u.id,
                  authId: u.authId,
                  username: u.username,
                  color: u.color,
                  isConnected: u.isConnected,
                })),
              }))
            );
          }
        }
      }
    }
  });

  // Username sharing events
  socket.on("share-username", (roomId: string, username: string) => {
    if (user.username !== username) {
      user.username = username;
    }
    socket.to(roomId).emit("send-username", username, socket.id);
  });

  socket.on("get-opponent-username", (roomId: string) => {
    const roomUsers = rooms.get(roomId);
    if (!roomUsers) return;

    roomUsers.forEach((roomUser) => {
      if (roomUser.id !== socket.id) {
        socket.emit("send-username", roomUser.username, roomUser.id);
      }
    });
  });

  // Reconnection event
  socket.on("reconnect", (roomId: string, lastSocketId?: string) => {
    console.log("User reconnecting:", socket.id);

    const roomUsers = rooms.get(roomId);
    if (!roomUsers) {
      socket.emit("reconnect-failed", "Room not found");
      return;
    }

    // Check for a matching disconnected user by authId or lastSocketId
    const disconnectedUser = roomUsers.find((u) => {
      if (!u.isConnected) {
        // For authenticated users, match by authId
        if (u.authId && user.authId && u.authId === user.authId) {
          return true;
        }
        // For anonymous users, match by lastSocketId
        if (
          !u.authId &&
          !user.authId &&
          lastSocketId &&
          u.id === lastSocketId
        ) {
          return true;
        }
      }
      return false;
    });

    if (!disconnectedUser) {
      // Check if we have any open slots before rejecting
      if (roomUsers.length < 2) {
        socket.emit("reconnect-failed", "No open slot in this room");
      } else {
        socket.emit("reconnect-failed", "Game open in another instance");
      }

      if (process.env.DEBUG_LEVEL === "verbose") {
        console.log(
          `No matching disconnected user found for ${socket.id} in room ${roomId}`
        );
      }
      return;
    }

    const timerKey = `${roomId}:${disconnectedUser.id}`;
    if (disconnectionTimers.has(timerKey)) {
      clearTimeout(disconnectionTimers.get(timerKey));
      disconnectionTimers.delete(timerKey);
      console.log(
        `Cleared disconnection timer for ${disconnectedUser.id} in room ${roomId}`
      );
    }

    io.to(roomId).emit("set-status-online", disconnectedUser.color);

    user.color = disconnectedUser.color;
    user.username = disconnectedUser.username;
    user.authId = disconnectedUser.authId || user.authId;

    const disconnectedUserIndex = roomUsers.findIndex(
      (u) => u.id === disconnectedUser.id
    );
    roomUsers[disconnectedUserIndex] = user;

    socket.join(roomId);
    socket.emit("send-room-occupancy", roomUsers.length);

    const game = games.get(roomId);
    if (game) {
      socket.emit("send-game-state", {
        serializedBoard: game.serializedBoard,
        turn: game.turn,
        gameOver: game.gameOver,
        whiteTime: game.whiteTime,
        blackTime: game.blackTime,
        increment: game.timeControl.increment,
      });
    }

    socket.to(roomId).emit("send-username", user.username, user.id);

    roomUsers.forEach((roomUser) => {
      if (roomUser.id !== user.id) {
        socket.emit("send-username", roomUser.username, roomUser.id);
      }
    });

    socket.emit("reconnect-success");
    console.log(
      `User ${socket.id} reconnected as ${user.username} with color ${user.color}`
    );
  });

  // Room management events
  socket.on("get-rooms", () => {
    const roomsInfo = Array.from(rooms.entries()).map(([roomId, users]) => ({
      roomId,
      users: users.map((u) => ({
        id: u.id,
        authId: u.authId,
        username: u.username,
        color: u.color,
      })),
    }));

    socket.emit("rooms-update", roomsInfo);
  });

  socket.on("join-room", (roomId: string, username: string) => {
    user.username = username;
    let color = "white";

    if (rooms.has(roomId)) {
      const existingUsers = rooms.get(roomId);
      if (existingUsers && existingUsers.length > 0) {
        const existingColor = existingUsers[0].color;
        color = existingColor === "white" ? "black" : "white";
        socket.emit(
          "send-username",
          existingUsers[0].username,
          existingUsers[0].id
        );
        socket.to(roomId).emit("send-username", username, socket.id);
      }
    }

    user.color = color;
    console.log(`${user.username} joined room: ${roomId}`);
    console.log("User color:", user.color);

    if (rooms.has(roomId)) {
      rooms.get(roomId)?.push(user);
    } else {
      rooms.set(roomId, [user]);
    }

    socket.join(roomId);
    io.to(roomId).emit("player-joined-room", rooms.get(roomId)?.length);
  });

  // Game management events
  socket.on(
    "start-game",
    (roomId: string, timeControl: { time: number; increment: number }) => {
      if (games.has(roomId)) {
        console.log("Game already started in room:", roomId);
        return;
      }

      const newBoard = new Board();
      const game: Game = {
        board: newBoard,
        serializedBoard: newBoard.serializeBoard(),
        turn: "white",
        gameOver: false,
        white: new Player("white", true),
        black: new Player("black", false),
        timeControl: timeControl,
        whiteTime: timeControl.time * 60,
        blackTime: timeControl.time * 60,
      };

      games.set(roomId, game);
      startClock(roomId, "white");
      console.log("Game started in room:", roomId);
      saveGameToSupabase(roomId, game);

      const roomUsers = rooms.get(roomId) || [];
      roomUsers.forEach((roomUser) => {
        socket.to(roomId).emit("send-username", roomUser.username, roomUser.id);
      });
      socket.to(roomId).emit("send-username", user.username, user.id);
    }
  );

  socket.on(
    "move-piece",
    (
      roomId: string,
      from: string,
      to: string,
      promotionPiece?: "queen" | "rook" | "bishop" | "knight"
    ) => {
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

      if (validateMove(roomId, from, to, promotionPiece) === false) {
        console.error("Invalid move in room:", roomId);
        return;
      } else {
        console.log(`Move piece from ${from} to ${to} in room: ${roomId}`);

        const currentColor = user.color as "white" | "black";
        const nextColor = currentColor === "white" ? "black" : "white";

        stopClock(roomId, currentColor);

        if (currentColor === "white") {
          game.whiteTime += game.timeControl.increment;
          io.to(roomId).emit("sync-time", game.whiteTime, "white");
        } else {
          game.blackTime += game.timeControl.increment;
          io.to(roomId).emit("sync-time", game.blackTime, "black");
        }

        startClock(roomId, nextColor);
        game.turn = nextColor;
        game.serializedBoard = game.board.serializeBoard();

        io.to(roomId).emit("board-update", {
          lastMove: { from, to },
          turn: game.turn,
          promotionPiece: promotionPiece,
        });
      }

      // Check for game ending conditions
      if (game.board.isCheckmateOrStalemate("black") !== "none") {
        game.gameOver = true;
        saveGameToSupabase(roomId, game);
        io.to(roomId).emit("game-over", {
          message:
            game.board.isCheckmateOrStalemate("black") === "checkmate"
              ? "White wins by checkmate"
              : "Game drawn by stalemate",
        });
        stopClock(roomId, "white");
        stopClock(roomId, "black");
      } else if (game.board.isCheckmateOrStalemate("white") !== "none") {
        game.gameOver = true;
        saveGameToSupabase(roomId, game);
        io.to(roomId).emit("game-over", {
          message:
            game.board.isCheckmateOrStalemate("white") === "checkmate"
              ? "Black wins by checkmate"
              : "Game drawn by stalemate",
        });
        stopClock(roomId, "white");
        stopClock(roomId, "black");
      }
    }
  );

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

    game.gameOver = true;
    saveGameToSupabase(roomId, game);

    const winner = playerColor === "white" ? "black" : "white";
    console.log(
      `${playerColor}'s time ran out. ${winner} wins in room: ${roomId}`
    );

    io.to(roomId).emit("game-over", {
      message: `${
        winner.charAt(0).toUpperCase() + winner.slice(1)
      } wins by timeout`,
    });

    stopClock(roomId, "white");
    stopClock(roomId, "black");
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
