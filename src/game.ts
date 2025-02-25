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

function gameLoop() {
  board.displayBoard();
  const turn = player1.getIsTurn() ? player1 : player2;

  console.log(`${turn.getColor()}'s turn`);

  rl.question("Enter your move (format: start end): ", (move) => {
    const [moveStart, moveEnd] = move.split(" ");

    try {
      board.movePiece(moveStart, moveEnd, turn);

      // **Corrected Turn Switching**
      player1.setIsTurn(turn === player2);
      player2.setIsTurn(turn === player1);
    } catch (error) {
      console.log(error.message);
    }

    gameLoop();
  });
}

gameLoop();
