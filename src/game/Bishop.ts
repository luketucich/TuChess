import { Piece } from "../game/Piece.ts";
import { Board } from "../game/Board.ts";

export class Bishop extends Piece {
  constructor(color: "white" | "black", position: string) {
    super(color, position, 3);
  }

  getMoves(board: Board): string[] {
    const moves: string[] = [];
    const [row, col]: number[] = board.squareToIndex(this.position);
    const directions: number[][] = [
      [-1, -1], // Up left
      [-1, 1], // Up right
      [1, -1], // Down left
      [1, 1], // Down right
    ];

    directions.forEach(([rowOffset, colOffset]) => {
      const move = board.indexToSquare([row + rowOffset, col + colOffset]);

      while (board.squareIsValid(move) && board.getSquare(move) === null) {
        moves.push(move);
      }
    });

    return moves;
  }

  move(position: string): void {
    this.position = position;
  }
}
