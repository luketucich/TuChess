import { Game, User, TimeControl } from "../models/interfaces";
import { Board } from "../game/Board";
import { Player } from "../game/Player";
import { Server } from "socket.io";
import { saveGameToSupabase } from "./supabaseService";
import { startClock, stopClock, stopAllClocks } from "../utils/clockManager";
import { validateMove } from "../utils/moveValidator";

export function createGame(timeControl: TimeControl): Game {
  const newBoard = new Board();
  return {
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
}

export function handleMove(
  io: Server,
  roomId: string,
  game: Game,
  user: User,
  from: string,
  to: string,
  promotionPiece?: "queen" | "rook" | "bishop" | "knight"
): boolean {
  if (!game) {
    console.error("Board not found for room:", roomId);
    return false;
  }

  if (game.gameOver) {
    console.error("Game is already over in room:", roomId);
    return false;
  }

  if (game.turn !== user.color) {
    console.error("Not your turn in room:", roomId);
    return false;
  }

  if (!validateMove(io, roomId, game, user, from, to, promotionPiece)) {
    console.error("Invalid move in room:", roomId);
    return false;
  }

  console.log(`Move piece from ${from} to ${to} in room: ${roomId}`);

  const currentColor = user.color as "white" | "black";
  const nextColor = currentColor === "white" ? "black" : "white";

  stopClock(roomId, game, currentColor);

  if (currentColor === "white") {
    game.whiteTime += game.timeControl.increment;
    io.to(roomId).emit("sync-time", game.whiteTime, "white");
  } else {
    game.blackTime += game.timeControl.increment;
    io.to(roomId).emit("sync-time", game.blackTime, "black");
  }

  startClock(io, roomId, game, nextColor);

  game.turn = nextColor;
  game.serializedBoard = game.board.serializeBoard();

  io.to(roomId).emit("board-update", {
    lastMove: { from, to },
    turn: game.turn,
    promotionPiece: promotionPiece,
  });

  return true;
}

export function checkGameEnd(
  io: Server,
  roomId: string,
  game: Game,
  rooms: Map<string, User[]>
): boolean {
  if (game.board.isCheckmateOrStalemate("black") !== "none") {
    game.gameOver = true;
    saveGameToSupabase(roomId, game, rooms.get(roomId) || []);
    io.to(roomId).emit("game-over", {
      message:
        game.board.isCheckmateOrStalemate("black") === "checkmate"
          ? "White wins by checkmate"
          : "Game drawn by stalemate",
    });
    stopAllClocks(game);
    return true;
  } else if (game.board.isCheckmateOrStalemate("white") !== "none") {
    game.gameOver = true;
    saveGameToSupabase(roomId, game, rooms.get(roomId) || []);
    io.to(roomId).emit("game-over", {
      message:
        game.board.isCheckmateOrStalemate("white") === "checkmate"
          ? "Black wins by checkmate"
          : "Game drawn by stalemate",
    });
    stopAllClocks(game);
    return true;
  }

  return false;
}

export function handleTimeout(
  io: Server,
  roomId: string,
  game: Game,
  playerColor: string,
  rooms: Map<string, User[]>
): boolean {
  if (!game) {
    console.error("Game not found for room:", roomId);
    return false;
  }

  if (game.gameOver) {
    console.error("Game is already over in room:", roomId);
    return false;
  }

  game.gameOver = true;
  saveGameToSupabase(roomId, game, rooms.get(roomId) || []);

  const winner = playerColor === "white" ? "black" : "white";
  console.log(
    `${playerColor}'s time ran out. ${winner} wins in room: ${roomId}`
  );

  io.to(roomId).emit("game-over", {
    message: `${
      winner.charAt(0).toUpperCase() + winner.slice(1)
    } wins by timeout`,
  });

  stopAllClocks(game);
  return true;
}
