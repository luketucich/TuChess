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
      if (currBoard[row - 1][col] === null) {
        moves.push(board.indexToSquare([row - 1, col]));
      }
      // Check if pawn can move forward two squares
      if (
        !this.hasMoved &&
        currBoard[row - 2][col] === null &&
        currBoard[row - 1][col] === null
      ) {
        moves.push(board.indexToSquare([row - 2, col]));
      }
    }

    // Black pawns
    if (this.color === "black") {
      // Check if pawn can move forward one square
      if (currBoard[row + 1][col] === null) {
        moves.push(board.indexToSquare([row + 1, col]));
      }
      // Check if pawn can move forward two squares
      if (
        !this.hasMoved &&
        currBoard[row + 2][col] === null &&
        currBoard[row + 1][col] === null
      ) {
        moves.push(board.indexToSquare([row + 2, col]));
      }
    }

    return moves;
  }
}
