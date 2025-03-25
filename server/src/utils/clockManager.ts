import { Server } from "socket.io";
import { Game } from "../models/interfaces";

export function startClock(
  io: Server,
  roomId: string,
  game: Game,
  playerColor: "white" | "black"
) {
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

export function stopClock(
  roomId: string,
  game: Game,
  playerColor: "white" | "black"
) {
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

export function stopAllClocks(game: Game) {
  if (game.whiteClockId) {
    clearInterval(game.whiteClockId);
    game.whiteClockId = undefined;
  }

  if (game.blackClockId) {
    clearInterval(game.blackClockId);
    game.blackClockId = undefined;
  }
}
