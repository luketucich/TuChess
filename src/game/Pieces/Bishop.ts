import { Piece } from "./Piece.ts";
import { King } from "./King.ts";
import { Board } from "../Board.ts";
import { Move } from "../Moves/Move.ts";

export class Bishop extends Piece {
  private isBeingCalculated: boolean = false;

  constructor(color: "white" | "black", position: string) {
    super(color, position, 3, "bishop");
  }

  move(position: string): void {
    this.position = position;
  }

  getMoves(board: Board): Move[] {
    const validMoves: Move[] = [];
    const directions = [
      [-1, -1], // Top (left)
      [-1, 1], // Top (right)
      [1, -1], // Bottom (left)
      [1, 1], // Bottom (right)
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
            piece: "bishop",
            color: this.color,
            isCapture: false,
            isCheck: this.isCheck(board, [row, col]),
          };

          validMoves.push(move);
        } else if (this.isCapture(board, [row, col])) {
          const move: Move = {
            square: board.indexToSquare([row, col]),
            piece: "bishop",
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

    return this.filterSelfCheck(board, this.position, validMoves, this.color);
  }

  isCheck(board: Board, position: [number, number]): boolean {
    const directions = [
      [-1, -1], // Top (left)
      [-1, 1], // Top (right)
      [1, -1], // Bottom (left)
      [1, 1], // Bottom (right)
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
