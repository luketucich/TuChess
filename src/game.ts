import { Board } from "./game/Board.ts";

const board: Board = new Board();
let gameOver: boolean = false;

while (!gameOver) {
  console.log(board.getBoard());
  gameOver = true;
}
