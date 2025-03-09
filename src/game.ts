import { Board } from "./game/Board.ts";
import { Player } from "./game/Player.ts";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const board = new Board();
const player1 = new Player("white", true);
const player2 = new Player("black", false);
let lastMoveBy: Player | null = null;

function gameLoop(): void {
  const currentPlayer = player1.getIsTurn() ? player1 : player2;
  console.log("\n");
  board.displayBoard(currentPlayer);

  // Check for checkmate or stalemate
  if (lastMoveBy) {
    const lastMoveColor = lastMoveBy.getColor();
    const opponentColor = lastMoveColor === "white" ? "black" : "white";

    if (board.isCheckmateOrStalemate(opponentColor) === "checkmate") {
      const winnerColor = lastMoveColor === "white" ? "\x1b[37m" : "\x1b[34m";
      const capitalizedColor =
        lastMoveColor.charAt(0).toUpperCase() + lastMoveColor.slice(1);
      console.log(`${winnerColor}${capitalizedColor} wins by CHECKMATE!`);
      rl.close();
      return;
    } else if (
      board.isCheckmateOrStalemate(opponentColor) === "stalemate" ||
      board.isCheckmateOrStalemate(lastMoveColor) === "stalemate"
    ) {
      console.log("Game drawn by STALEMATE!");
      rl.close();
      return;
    }

    lastMoveBy = null;
  }

  // Display turn information
  const playerColor = currentPlayer.getColor();
  const colorCode = playerColor === "white" ? "\x1b[37m" : "\x1b[34m";
  const capitalizedColor =
    playerColor.charAt(0).toUpperCase() + playerColor.slice(1);
  console.log(`\n${colorCode}${capitalizedColor} to move!\x1b[0m`);

  rl.question("\x1b[33mEnter as 'start end': \x1b[0m", (move) => {
    const [moveStart, moveEnd] = move.split(" ");

    try {
      board.movePiece(moveStart, moveEnd, currentPlayer);
      lastMoveBy = currentPlayer;

      // Toggle turns
      player1.setIsTurn(currentPlayer === player2);
      player2.setIsTurn(currentPlayer === player1);
    } catch (error) {
      console.log(error.message);
    }

    gameLoop();
  });
}

gameLoop();
