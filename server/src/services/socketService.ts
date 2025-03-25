import { Server, Socket } from "socket.io";
import { Game, User, TimeControl } from "../models/interfaces";
import { saveGameToSupabase } from "./supabaseService";
import {
  createGame,
  handleMove,
  checkGameEnd,
  handleTimeout,
} from "./gameService";
import { startClock, stopAllClocks } from "../utils/clockManager";
import { DEBUG_LEVEL } from "../config/env";

// Storage for active rooms and games
export const rooms = new Map<string, User[]>();
export const games = new Map<string, Game>();
export const disconnectionTimers = new Map<string, NodeJS.Timeout>();

export function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);
    const user: User = { id: socket.id, isConnected: true };

    function emitRoomsUpdate() {
      const roomsInfo = Array.from(rooms.entries()).map(([roomId, users]) => ({
        roomId,
        users: users.map((u) => ({
          id: u.id,
          authId: u.authId,
          username: u.username,
          color: u.color,
          isConnected: u.isConnected,
        })),
      }));
      io.emit("rooms-update", roomsInfo);
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
                  stopAllClocks(game);
                  game.gameOver = true;
                  saveGameToSupabase(roomId, game, rooms.get(roomId) || []);
                }

                emitRoomsUpdate();
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
                stopAllClocks(game);
              }
              rooms.delete(roomId);
              games.delete(roomId);
              emitRoomsUpdate();
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

        if (DEBUG_LEVEL === "verbose") {
          console.log(
            `No matching disconnected user found for ${socket.id} in room ${roomId}`
          );
        }
        return;
      }

      const timerKey = `${roomId}:${disconnectedUser.id}`;
      if (disconnectionTimers.has(timerKey)) {
        clearTimeout(disconnectionTimers.get(timerKey)!);
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
      emitRoomsUpdate();
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
    socket.on("start-game", (roomId: string, timeControl: TimeControl) => {
      if (games.has(roomId)) {
        console.log("Game already started in room:", roomId);
        return;
      }

      const game = createGame(timeControl);
      games.set(roomId, game);
      startClock(io, roomId, game, "white");

      console.log("Game started in room:", roomId);
      saveGameToSupabase(roomId, game, rooms.get(roomId) || []);

      const roomUsers = rooms.get(roomId) || [];
      roomUsers.forEach((roomUser) => {
        socket.to(roomId).emit("send-username", roomUser.username, roomUser.id);
      });
      socket.to(roomId).emit("send-username", user.username, user.id);
    });

    socket.on(
      "move-piece",
      (
        roomId: string,
        from: string,
        to: string,
        promotionPiece?: "queen" | "rook" | "bishop" | "knight"
      ) => {
        const game = games.get(roomId);
        if (!game) return;

        if (handleMove(io, roomId, game, user, from, to, promotionPiece)) {
          checkGameEnd(io, roomId, game, rooms);
        }
      }
    );

    socket.on("timeout", (roomId: string, playerColor: string) => {
      const game = games.get(roomId);
      if (!game) return;

      handleTimeout(io, roomId, game, playerColor, rooms);
    });
  });
}
