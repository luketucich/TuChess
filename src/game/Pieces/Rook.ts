import { Piece } from "./Piece.ts";
import { King } from "./King.ts";
import { Board } from "../Board.ts";
import { Move } from "../Moves/Move.ts";

export class Rook extends Piece {
  private hasMoved: boolean;

  constructor(
    color: "white" | "black",
    position: string,
    hasMoved: boolean = false
  ) {
    super(color, position, 5, "rook");
    this.hasMoved = hasMoved;
  }

  getHasMoved(): boolean {
    return this.hasMoved;
  }

  move(position: string): void {
    this.position = position;
    this.hasMoved = true;
  }

  getMoves(board: Board): Move[] {
    const validMoves: Move[] = [];
    const directions = [
      [-1, 0], // Up
      [1, 0], // Down
      [0, -1], // Left
      [0, 1], // Right
    ];

    const [startRow, startCol] = board.squareToIndex(this.position);

    for (const [rowOffset, colOffset] of directions) {
      let row = startRow + rowOffset;
      let col = startCol + colOffset;

      while (board.isValidIndex([row, col])) {
        const square = board.getIndex([row, col]);

        if (square === null) {
          const move: Move = {
            square: board.indexToSquare([row, col]),
            piece: "rook",
            color: this.color,
            isCapture: false,
            isCheck: this.isCheck(board, [row, col]),
          };

          validMoves.push(move);
        } else if (this.isCapture(board, [row, col])) {
          const move: Move = {
            square: board.indexToSquare([row, col]),
            piece: "rook",
            color: this.color,
            isCapture: true,
            isCheck: this.isCheck(board, [row, col]),
          };

          validMoves.push(move);
          break; // Stop after capturing an enemy piece
        } else {
          break; // Stop if blocked by friendly piece
        }

        row += rowOffset;
        col += colOffset;
      }
    }

    return validMoves;
  }

  isCheck(board: Board, position: [number, number]): boolean {
    const directions = [
      [-1, 0], // Up
      [1, 0], // Down
      [0, -1], // Left
      [0, 1], // Right
    ];

    const [startRow, startCol] = position;

    for (const [rowOffset, colOffset] of directions) {
      let row = startRow + rowOffset;
      let col = startCol + colOffset;

      while (board.isValidIndex([row, col])) {
        const square = board.getIndex([row, col]);

        if (square !== null) {
          if (square instanceof King && square.getColor() !== this.color) {
            return true; // Enemy king is in check
          }
          break; // Stop if any other piece is found
        }

        row += rowOffset;
        col += colOffset;
      }
    }

    return false;
  }
}
