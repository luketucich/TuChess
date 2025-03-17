import { Piece } from "./Piece";
import { King } from "./King";
import { Board } from "../Board";
import { Move } from "../Moves/Move";

export class Queen extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, 9, "queen");
  }

  move(position: string): void {
    this.position = position;
  }

  getMoves(board: Board): Move[] {
    const validMoves: Move[] = [];
    const directions = [
      [-1, -1], // Top-left (diagonal)
      [-1, 1], // Top-right (diagonal)
      [1, -1], // Bottom-left (diagonal)
      [1, 1], // Bottom-right (diagonal)
      [-1, 0], // Up (vertical)
      [1, 0], // Down (vertical)
      [0, -1], // Left (horizontal)
      [0, 1], // Right (horizontal)
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
            piece: "queen",
            color: this.color,
            isCapture: false,
            isCheck: this.isCheck(board, [row, col]),
          };

          validMoves.push(move);
        } else if (this.isCapture(board, [row, col])) {
          const move: Move = {
            square: board.indexToSquare([row, col]),
            piece: "queen",
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
      [-1, -1], // Top-left (diagonal)
      [-1, 1], // Top-right (diagonal)
      [1, -1], // Bottom-left (diagonal)
      [1, 1], // Bottom-right (diagonal)
      [-1, 0], // Up (vertical)
      [1, 0], // Down (vertical)
      [0, -1], // Left (horizontal)
      [0, 1], // Right (horizontal)
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
