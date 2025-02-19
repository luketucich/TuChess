import { Board } from "./game/Board.ts";
import * as readline from "readline";

// Initialize the board and set the starting player
const board = new Board();
let currentPlayer = "white";
const blackMessage = `\n\x1b[31m${"Black to move (start-end): \n"}\x1b[0m`;
const whiteMessage = `\n\x1b[37m${"White to move (start-end): \n"}\x1b[0m`;

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Main game loop
function gameLoop() {
  // Display the current state of the board
  board.displayBoard();

  // Prompt the current player for their move
  rl.question(
    currentPlayer === "white" ? whiteMessage : blackMessage,
    (move) => {
      if (move.includes("-")) {
        const [start, end] = move.split("-");
        try {
          // Attempt to move the piece
          board.movePiece(start, end);
        } catch {
          // If the move is invalid, notify the player and restart the loop
          console.log("\n\x1b[33mInvalid move! Try again.\x1b[0m\n");
          gameLoop();
          return;
        }
      } else if (move.includes("x")) {
        const [start, end] = move.split("x");
        try {
          // Attempt to capture the piece
          board.capturePiece(start, end);
        } catch {
          // If the move is invalid, notify the player and restart the loop
          console.log("\n\x1b[33mInvalid capture! Try again.\x1b[0m\n");
          gameLoop();
          return;
        }
      }

      // Swap the current player
      currentPlayer = currentPlayer === "white" ? "black" : "white";

      // Continue the game loop
      gameLoop();
    }
  );
}

// Start the game loop
gameLoop();
