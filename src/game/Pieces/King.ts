import { Piece } from "./Piece.ts";
import { Board } from "../Board.ts";
import { Move } from "../Moves/Move.ts";

export class King extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, Infinity, "king");
  }

  move(position: string): void {
    this.position = position;
  }

  getMoves(board: Board): Move[] {
    const validMoves: Move[] = [];
    const [row, col]: [number, number] = board.squareToIndex(this.position);
    const directions: [number, number][] = [
      [-1, -1], // Top (left)
      [-1, 0], // Top
      [-1, 1], // Top (right)
      [0, -1], // Left
      [0, 1], // Right
      [1, -1], // Bottom (left)
      [1, 0], // Bottom
      [1, 1], // Bottom (right)
    ];

    for (const [rowOffset, colOffset] of directions) {
      const index: [number, number] = [row + rowOffset, col + colOffset];
      const square = board.indexToSquare(index);

      if (
        board.isValidIndex(index) &&
        !board.isSquareAttacked(square, this.color)
      ) {
        const move: Move = {
          square: square,
          piece: "king",
          color: this.color,
          isCapture: this.isCapture(board, index),
          isCheck: false,
        };

        validMoves.push(move);
      }
    }

    return validMoves;
  }
}
