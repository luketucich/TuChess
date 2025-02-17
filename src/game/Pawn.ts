import { Piece } from "../game/Piece.ts";
import { Board } from "../game/Board.ts";

export class Pawn extends Piece {
  constructor(
    color: "white" | "black",
    position: string,
    hasMoved: boolean = false
  ) {
    super(color, position, hasMoved, 1);
  }

  getMoves(board: Board): string[] {
    const currBoard = board.getBoard();
    const moves: string[] = [];
    const [row, col] = board.squareToIndex(this.position);

    // White pawns
    if (this.color === "white") {
      // Check if pawn can move forawrd one square
      if (currBoard[row - 1][col] === "*") {
        moves.push(board.indexToSquare([row - 1, col]));
      }
    }

    return moves;
  }
}
