import { Board } from "./game/Board.ts";
import * as readline from "readline";

const board = new Board();
let currentPlayer = "White";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function gameLoop() {
  console.log(board.displayBoard());
  rl.question(`${currentPlayer} to move (start-end): `, (move) => {
    const [start, end] = move.split("-");
    try {
      board.movePiece(start, end);
    } catch {
      console.log("Invalid move! Try again.");
      gameLoop();
      return;
    }
    currentPlayer = currentPlayer === "White" ? "Black" : "White";
    gameLoop();
  });
}

gameLoop();
