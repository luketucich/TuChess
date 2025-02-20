import { Piece } from "../game/Piece.ts";
import { Board } from "../game/Board.ts";
import { King } from "./King.ts";

export class Knight extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, 3);
  }

  getMoves(board: Board): string[] {
    const moves: string[] = [];
    const [row, col]: number[] = board.squareToIndex(this.position);
    const directions: number[][] = [
      [-2, -1], // Up left
      [-2, 1], // Up right
      [2, -1], // Down left
      [2, 1], // Down right
      [-1, -2], // Left up
      [1, -2], // Left down
      [-1, 2], // Right up
      [1, 2], // Right down
    ];

    directions.forEach(([rowOffset, colOffset]) => {
      const move = board.indexToSquare([row + rowOffset, col + colOffset]);

      if (board.squareIsValid(move) && board.getSquare(move) === null) {
        moves.push(move);
      }
    });

    return moves;
  }

  move(position: string): void {
    this.position = position;
  }

  getCaptures(board: Board): string[] {
    const captures: string[] = [];
    const [row, col]: number[] = board.squareToIndex(this.position);
    const directions: number[][] = [
      [-2, -1], // Up left
      [-2, 1], // Up right
      [2, -1], // Down left
      [2, 1], // Down right
      [-1, -2], // Left up
      [1, -2], // Left down
      [-1, 2], // Right up
      [1, 2], // Right down
    ];

    directions.forEach(([rowOffset, colOffset]) => {
      const capture = board.indexToSquare([row + rowOffset, col + colOffset]);

      if (board.squareIsValid(capture)) {
        const captureContent = board.getSquare(capture);

        if (
          captureContent !== null &&
          captureContent.getColor() !== this.color &&
          captureContent instanceof King === false
        ) {
          captures.push(capture);
        }
      }
    });

    return captures;
  }
}
