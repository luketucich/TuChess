import { Piece } from "../game/Piece.ts";
import { Board } from "../game/Board.ts";
import { King } from "./King.ts";

export class Knight extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, 3);
  }

  getMoves(board: Board): {
    moves: string[];
    captures: string[];
    checks: string[];
  } {
    const validMoves: {
      moves: string[];
      captures: string[];
      checks: string[];
    } = {
      moves: [],
      captures: [],
      checks: [],
    };

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

      if (board.squareIsValid(move)) {
        const piece = board.getSquare(move);

        // Get moves
        if (piece === null) {
          validMoves.moves.push(move);
        } else if (
          piece.getColor() !== this.color &&
          piece instanceof King === false
        ) {
          validMoves.captures.push(move);
        }
      }
    });

    return validMoves;
  }

  move(position: string): void {
    this.position = position;
  }
}
