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
  const turn = player1.getIsTurn() ? player1 : player2;
  console.log("\n");
  board.displayBoard(turn);

  const color = turn.getColor() === "white" ? "\x1b[37m" : "\x1b[34m";
  console.log(
    `\n${color}${
      turn.getColor().charAt(0).toUpperCase() + turn.getColor().slice(1)
    } to move!\x1b[0m`
  );

  rl.question("\x1b[33mEnter as 'start end': \x1b[0m", (move) => {
    const [moveStart, moveEnd] = move.split(" ");

    try {
      board.movePiece(moveStart, moveEnd, turn);

      // Update player turn
      player1.setIsTurn(turn === player2);
      player2.setIsTurn(turn === player1);
    } catch (error) {
      console.log(error.message);
    }

    gameLoop();
  });
}

gameLoop();
