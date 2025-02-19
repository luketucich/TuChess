import { Board } from "./game/Board.ts";
import * as readline from "readline";

// Initialize the board and set the starting player
const board = new Board();
let currentPlayer = "White";
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
    currentPlayer === "White" ? whiteMessage : blackMessage,
    (move) => {
      const [start, end] = move.split("-");
      try {
        // Attempt to move the piece
        board.movePiece(start, end);
      } catch {
        // If the move is invalid, notify the player and restart the loop
        console.log("Invalid move! Try again.");
        gameLoop();
        return;
      }

      // Swap the current player
      currentPlayer = currentPlayer === "White" ? "Black" : "White";

      // Continue the game loop
      gameLoop();
    }
  );
}

// Start the game loop
gameLoop();
