import { Piece } from "../game/Piece.ts";
import { Board } from "../game/Board.ts";
import { King } from "./King.ts";

export class Pawn extends Piece {
  private hasMoved: boolean;

  constructor(
    color: "white" | "black",
    position: string,
    hasMoved: boolean = false
  ) {
    super(color, position, 1);
    this.hasMoved = hasMoved;
  }

  getHasMoved(): boolean {
    return this.hasMoved;
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

  move(position: string): void {
    this.position = position;
    if (this.hasMoved === false) this.hasMoved = true;
  }

  getCaptures(board: Board): string[] {
    const [row, col] = board.squareToIndex(this.position);
    const currBoard = board.getBoard();
    const captures: string[] = [];

    if (this.color === "white") {
      const left = currBoard[row - 1][col - 1];
      const right = currBoard[row - 1][col + 1];

      // Check if pawn can capture to the left
      if (
        left &&
        left.getColor() === "black" &&
        left instanceof King === false
      ) {
        captures.push(board.indexToSquare([row - 1, col - 1]));
      }

      // Check if pawn can capture to the right
      if (
        right &&
        right.getColor() === "black" &&
        right instanceof King === false
      ) {
        captures.push(board.indexToSquare([row - 1, col + 1]));
      }
    }

    if (this.color === "black") {
      const left = currBoard[row + 1][col + 1];
      const right = currBoard[row + 1][col - 1];

      // Check if pawn can capture to the left
      if (
        left &&
        left.getColor() === "white" &&
        left instanceof King === false
      ) {
        captures.push(board.indexToSquare([row + 1, col + 1]));
      }

      // Check if pawn can capture to the right
      if (
        right &&
        right.getColor() === "white" &&
        right instanceof King === false
      ) {
        captures.push(board.indexToSquare([row + 1, col - 1]));
      }
    }

    return captures;
  }
}
