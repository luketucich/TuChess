import { Piece } from "./Piece.ts";
import { King } from "./King.ts";
import { Board } from "../Board.ts";

export class Bishop extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, 3);
  }

  move(position: string): void {
    this.position = position;
  }

  isCheck(board: Board, position: [number, number]) {
    const directions = [
      [-1, -1], // Top left
      [-1, 1], // Top right
      [1, -1], // Bottom left
      [1, 1], // Bottom right
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
